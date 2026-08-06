import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type LeadPayload = {
  nome?: string;
  telefone?: string;
  quemPrecisa?: string;
  situacao?: string;
  mensagem?: string;
  visitorId?: string;
  sessionId?: string;
  paginaOrigem?: string;
  referencia?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
};

function limparTexto(valor: unknown, tamanhoMaximo = 500): string | null {
  if (typeof valor !== "string") {
    return null;
  }

  const texto = valor.trim();

  if (!texto) {
    return null;
  }

  return texto.slice(0, tamanhoMaximo);
}

function limparTelefone(valor: unknown): string {
  if (typeof valor !== "string") {
    return "";
  }

  return valor.replace(/\D/g, "").slice(0, 15);
}

function gerarHashIp(ip: string): string | null {
  if (!ip) {
    return null;
  }

  const segredo =
    process.env.IP_HASH_SECRET ||
    process.env.SUPABASE_SECRET_KEY ||
    "aguias-de-cristo";

  return createHash("sha256")
    .update(`${ip}:${segredo}`)
    .digest("hex");
}

function obterIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    ""
  );
}

function obterDispositivo(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  if (/tablet|ipad/.test(ua)) {
    return "Tablet";
  }

  if (/mobile|android|iphone|ipod/.test(ua)) {
    return "Celular";
  }

  return "Computador";
}

function obterNavegador(userAgent: string): string {
  if (/edg/i.test(userAgent)) return "Microsoft Edge";
  if (/opr|opera/i.test(userAgent)) return "Opera";
  if (/chrome|crios/i.test(userAgent)) return "Google Chrome";
  if (/firefox|fxios/i.test(userAgent)) return "Mozilla Firefox";
  if (/safari/i.test(userAgent)) return "Safari";

  return "Outro";
}

function obterSistemaOperacional(userAgent: string): string {
  if (/windows/i.test(userAgent)) return "Windows";
  if (/android/i.test(userAgent)) return "Android";
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
  if (/macintosh|mac os/i.test(userAgent)) return "macOS";
  if (/linux/i.test(userAgent)) return "Linux";

  return "Outro";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LeadPayload;

    const nome = limparTexto(body.nome, 120);
    const telefone = limparTelefone(body.telefone);
    const quemPrecisa = limparTexto(body.quemPrecisa, 80);
    const situacao = limparTexto(body.situacao, 80);
    const mensagem = limparTexto(body.mensagem, 1500);

    if (!nome || nome.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Informe um nome válido.",
        },
        {
          status: 400,
        }
      );
    }

    if (telefone.length < 10) {
      return NextResponse.json(
        {
          success: false,
          message: "Informe um telefone válido com DDD.",
        },
        {
          status: 400,
        }
      );
    }

    if (!quemPrecisa) {
      return NextResponse.json(
        {
          success: false,
          message: "Informe quem precisa de ajuda.",
        },
        {
          status: 400,
        }
      );
    }

    if (!situacao) {
      return NextResponse.json(
        {
          success: false,
          message: "Informe qual é a situação.",
        },
        {
          status: 400,
        }
      );
    }

    const userAgent = request.headers.get("user-agent") || "";
    const ip = obterIp(request);

    /*
     * Na Vercel, estes cabeçalhos podem trazer localização aproximada.
     * Localmente, normalmente ficarão vazios.
     */
    const pais =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      null;

    const estado =
      request.headers.get("x-vercel-ip-country-region") ||
      null;

    const cidadeCodificada =
      request.headers.get("x-vercel-ip-city");

    let cidade: string | null = null;

    if (cidadeCodificada) {
      try {
        cidade = decodeURIComponent(cidadeCodificada);
      } catch {
        cidade = cidadeCodificada;
      }
    }

    const lead = {
      nome,
      telefone,
      quem_precisa: quemPrecisa,
      situacao,
      mensagem,

      status: "novo",

      pagina_origem: limparTexto(body.paginaOrigem, 500),
      referencia: limparTexto(body.referencia, 1000),

      utm_source: limparTexto(body.utmSource, 150),
      utm_medium: limparTexto(body.utmMedium, 150),
      utm_campaign: limparTexto(body.utmCampaign, 200),
      utm_content: limparTexto(body.utmContent, 200),
      utm_term: limparTexto(body.utmTerm, 200),

      gclid: limparTexto(body.gclid, 500),
      fbclid: limparTexto(body.fbclid, 500),

      visitor_id: limparTexto(body.visitorId, 150),
      session_id: limparTexto(body.sessionId, 150),

      ip_hash: gerarHashIp(ip),
      user_agent: userAgent.slice(0, 1000),
      dispositivo: obterDispositivo(userAgent),
      navegador: obterNavegador(userAgent),
      sistema_operacional: obterSistemaOperacional(userAgent),

      pais,
      codigo_pais: pais,
      estado,
      cidade,
    };

    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert(lead)
      .select("id, nome, telefone, created_at")
      .single();

    if (error) {
      console.error("Erro ao salvar lead:", error);

      return NextResponse.json(
        {
          success: false,
          message:
            "Não foi possível enviar seus dados neste momento.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Registramos também o evento de conversão.
     * Caso esse evento falhe, o lead continua salvo.
     */
    const { error: eventError } = await supabaseAdmin
      .from("analytics_events")
      .insert({
        event_name: "lead_submit",
        visitor_id: limparTexto(body.visitorId, 150),
        session_id: limparTexto(body.sessionId, 150),
        page_path: limparTexto(body.paginaOrigem, 500),
        utm_source: limparTexto(body.utmSource, 150),
        utm_medium: limparTexto(body.utmMedium, 150),
        utm_campaign: limparTexto(body.utmCampaign, 200),
        dispositivo: obterDispositivo(userAgent),
        pais,
        estado,
        cidade,
        metadata: {
          lead_id: data.id,
          quem_precisa: quemPrecisa,
          situacao,
        },
      });

    if (eventError) {
      console.error(
        "O lead foi salvo, mas houve erro no evento:",
        eventError
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Solicitação recebida. Nossa equipe entrará em contato.",
        leadId: data.id,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Erro inesperado na API de leads:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Ocorreu um erro inesperado. Tente novamente.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: "Método não permitido.",
    },
    {
      status: 405,
    }
  );
}