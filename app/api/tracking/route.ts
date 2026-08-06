import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type EventName =
  | "page_view"
  | "form_view"
  | "form_start"
  | "lead_submit"
  | "cta_click"
  | "whatsapp_click"
  | "phone_click"
  | "faq_open"
  | "scroll_25"
  | "scroll_50"
  | "scroll_75"
  | "scroll_100"
  | "time_30_seconds"
  | "time_60_seconds"
  | "page_exit";

type TrackingPayload = {
  eventName?: EventName;
  visitorId?: string;
  sessionId?: string;
  pagePath?: string;
  elementId?: string;
  elementText?: string;
  metadata?: Record<string, unknown>;

  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;

  gclid?: string;
  fbclid?: string;
};

const ALLOWED_EVENTS: EventName[] = [
  "page_view",
  "form_view",
  "form_start",
  "lead_submit",
  "cta_click",
  "whatsapp_click",
  "phone_click",
  "faq_open",
  "scroll_25",
  "scroll_50",
  "scroll_75",
  "scroll_100",
  "time_30_seconds",
  "time_60_seconds",
  "page_exit",
];

function cleanText(
  value: unknown,
  maxLength = 500
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const text = value.trim();

  if (!text) {
    return null;
  }

  return text.slice(0, maxLength);
}

function getIp(request: NextRequest) {
  const forwardedFor =
    request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor
      .split(",")[0]
      .trim();
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    ""
  );
}

function hashIp(ip: string) {
  if (!ip) {
    return null;
  }

  const secret =
    process.env.IP_HASH_SECRET ||
    process.env.SUPABASE_SECRET_KEY ||
    "aguias-de-cristo";

  return createHash("sha256")
    .update(`${ip}:${secret}`)
    .digest("hex");
}

function getDevice(userAgent: string) {
  const ua = userAgent.toLowerCase();

  if (/ipad|tablet/.test(ua)) {
    return "Tablet";
  }

  if (
    /mobile|android|iphone|ipod/.test(ua)
  ) {
    return "Celular";
  }

  return "Computador";
}

function getBrowser(userAgent: string) {
  if (/edg/i.test(userAgent)) {
    return "Microsoft Edge";
  }

  if (/opr|opera/i.test(userAgent)) {
    return "Opera";
  }

  if (/chrome|crios/i.test(userAgent)) {
    return "Google Chrome";
  }

  if (/firefox|fxios/i.test(userAgent)) {
    return "Mozilla Firefox";
  }

  if (/safari/i.test(userAgent)) {
    return "Safari";
  }

  return "Outro";
}

function getOperatingSystem(userAgent: string) {
  if (/windows/i.test(userAgent)) {
    return "Windows";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return "iOS";
  }

  if (/macintosh|mac os/i.test(userAgent)) {
    return "macOS";
  }

  if (/linux/i.test(userAgent)) {
    return "Linux";
  }

  return "Outro";
}

function decodeHeader(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as TrackingPayload;

    const eventName = body.eventName;

    if (
      !eventName ||
      !ALLOWED_EVENTS.includes(eventName)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Evento inválido.",
        },
        {
          status: 400,
        }
      );
    }

    const visitorId = cleanText(
      body.visitorId,
      150
    );

    const sessionId = cleanText(
      body.sessionId,
      150
    );

    if (!visitorId || !sessionId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Identificação da sessão ausente.",
        },
        {
          status: 400,
        }
      );
    }

    const userAgent =
      request.headers.get("user-agent") || "";

    const ip = getIp(request);
    const ipHash = hashIp(ip);

    const country =
      request.headers.get(
        "x-vercel-ip-country"
      ) ||
      request.headers.get("cf-ipcountry") ||
      null;

    const state =
      request.headers.get(
        "x-vercel-ip-country-region"
      ) || null;

    const city = decodeHeader(
      request.headers.get("x-vercel-ip-city")
    );

    const device = getDevice(userAgent);
    const browser = getBrowser(userAgent);
    const operatingSystem =
      getOperatingSystem(userAgent);

    const pagePath =
      cleanText(body.pagePath, 500) || "/";

    const metadata =
      body.metadata &&
      typeof body.metadata === "object"
        ? body.metadata
        : {};

    const eventData = {
      event_name: eventName,
      visitor_id: visitorId,
      session_id: sessionId,

      page_path: pagePath,

      element_id: cleanText(
        body.elementId,
        200
      ),

      element_text: cleanText(
        body.elementText,
        300
      ),

      metadata: {
        ...metadata,
        utm_content: cleanText(
          body.utmContent,
          200
        ),
        utm_term: cleanText(
          body.utmTerm,
          200
        ),
        gclid: cleanText(body.gclid, 500),
        fbclid: cleanText(body.fbclid, 500),
        navegador: browser,
        sistema_operacional:
          operatingSystem,
        ip_hash: ipHash,
      },

      utm_source: cleanText(
        body.utmSource,
        150
      ),

      utm_medium: cleanText(
        body.utmMedium,
        150
      ),

      utm_campaign: cleanText(
        body.utmCampaign,
        200
      ),

      dispositivo: device,
      pais: country,
      estado: state,
      cidade: city,
    };

    const { error: eventError } =
      await supabaseAdmin
        .from("analytics_events")
        .insert(eventData);

    if (eventError) {
      console.error(
        "Erro ao registrar evento:",
        eventError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Não foi possível registrar o evento.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Cria ou atualiza a sessão do visitante.
     */
    const now = new Date().toISOString();

    const sessionFlags: Record<
      string,
      boolean
    > = {};

    if (eventName === "form_start") {
      sessionFlags.iniciou_formulario = true;
    }

    if (eventName === "lead_submit") {
      sessionFlags.enviou_formulario = true;
    }

    if (eventName === "whatsapp_click") {
      sessionFlags.clicou_whatsapp = true;
    }

    if (eventName === "phone_click") {
      sessionFlags.clicou_telefone = true;
    }

    const sessionData = {
      visitor_id: visitorId,
      session_id: sessionId,

      pagina_entrada: pagePath,
      pagina_saida:
        eventName === "page_exit"
          ? pagePath
          : null,

      referencia: cleanText(
        request.headers.get("referer"),
        1000
      ),

      utm_source: cleanText(
        body.utmSource,
        150
      ),

      utm_medium: cleanText(
        body.utmMedium,
        150
      ),

      utm_campaign: cleanText(
        body.utmCampaign,
        200
      ),

      utm_content: cleanText(
        body.utmContent,
        200
      ),

      utm_term: cleanText(
        body.utmTerm,
        200
      ),

      gclid: cleanText(body.gclid, 500),
      fbclid: cleanText(body.fbclid, 500),

      ip_hash: ipHash,
      user_agent: userAgent.slice(0, 1000),

      dispositivo: device,
      navegador: browser,
      sistema_operacional:
        operatingSystem,

      pais: country,
      codigo_pais: country,
      estado: state,
      cidade: city,

      ultima_atividade_em: now,

      ...sessionFlags,
    };

    const { data: existingSession } =
      await supabaseAdmin
        .from("visitor_sessions")
        .select(
          `
            id,
            quantidade_paginas,
            primeira_visita_em
          `
        )
        .eq("session_id", sessionId)
        .maybeSingle();

    if (existingSession) {
      const updateData: Record<
        string,
        unknown
      > = {
        ultima_atividade_em: now,
        pagina_saida:
          eventName === "page_exit"
            ? pagePath
            : undefined,
        ...sessionFlags,
      };

      if (eventName === "page_view") {
        updateData.quantidade_paginas =
          (existingSession.quantidade_paginas ||
            1) + 1;
      }

      if (
        eventName === "page_exit" &&
        existingSession.primeira_visita_em
      ) {
        const start = new Date(
          existingSession.primeira_visita_em
        ).getTime();

        const end = Date.now();

        updateData.duracao_segundos =
          Math.max(
            0,
            Math.round((end - start) / 1000)
          );
      }

      Object.keys(updateData).forEach(
        (key) => {
          if (updateData[key] === undefined) {
            delete updateData[key];
          }
        }
      );

      await supabaseAdmin
        .from("visitor_sessions")
        .update(updateData)
        .eq("session_id", sessionId);
    } else {
      await supabaseAdmin
        .from("visitor_sessions")
        .insert({
          ...sessionData,
          quantidade_paginas: 1,
        });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Erro inesperado no tracking:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Erro inesperado ao registrar evento.",
      },
      {
        status: 500,
      }
    );
  }
}