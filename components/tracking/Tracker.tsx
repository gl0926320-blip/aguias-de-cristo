"use client";

import {
  useCallback,
  useEffect,
  useRef,
} from "react";

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

type TrackOptions = {
  elementId?: string;
  elementText?: string;
  metadata?: Record<string, unknown>;
};

function generateId(prefix: string) {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 12)}`;
}

function getVisitorId() {
  const key = "aguias_visitor_id";

  const current =
    localStorage.getItem(key);

  if (current) {
    return current;
  }

  const generated =
    generateId("visitor");

  localStorage.setItem(key, generated);

  return generated;
}

function getSessionId() {
  const key = "aguias_session_id";

  const current =
    sessionStorage.getItem(key);

  if (current) {
    return current;
  }

  const generated =
    generateId("session");

  sessionStorage.setItem(key, generated);

  return generated;
}

function getCampaignData() {
  const params = new URLSearchParams(
    window.location.search
  );

  return {
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get(
      "utm_campaign"
    ),
    utmContent: params.get("utm_content"),
    utmTerm: params.get("utm_term"),
    gclid: params.get("gclid"),
    fbclid: params.get("fbclid"),
  };
}

async function sendTrackingEvent(
  eventName: EventName,
  options: TrackOptions = {},
  useBeacon = false
) {
  const visitorId = getVisitorId();
  const sessionId = getSessionId();

  const payload = {
    eventName,
    visitorId,
    sessionId,

    pagePath:
      window.location.pathname +
      window.location.search,

    elementId: options.elementId,
    elementText: options.elementText,
    metadata: options.metadata,

    ...getCampaignData(),
  };

  if (
    useBeacon &&
    navigator.sendBeacon
  ) {
    const blob = new Blob(
      [JSON.stringify(payload)],
      {
        type: "application/json",
      }
    );

    navigator.sendBeacon(
      "/api/tracking",
      blob
    );

    return;
  }

  try {
    await fetch("/api/tracking", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),

      keepalive:
        eventName === "page_exit",
    });
  } catch (error) {
    console.error(
      "Erro ao enviar evento:",
      error
    );
  }
}

declare global {
  interface Window {
    trackAguiasEvent?: (
      eventName: EventName,
      options?: TrackOptions
    ) => void;
  }
}

export default function Tracker() {
  const scrollEventsSent = useRef(
    new Set<number>()
  );

  const formViewed = useRef(false);

  const track = useCallback(
    (
      eventName: EventName,
      options?: TrackOptions
    ) => {
      sendTrackingEvent(
        eventName,
        options
      );
    },
    []
  );

  useEffect(() => {
    window.trackAguiasEvent = track;

    return () => {
      delete window.trackAguiasEvent;
    };
  }, [track]);

  useEffect(() => {
    track("page_view", {
      metadata: {
        title: document.title,
        referrer:
          document.referrer || null,
        screen_width: window.screen.width,
        screen_height:
          window.screen.height,
        viewport_width:
          window.innerWidth,
        viewport_height:
          window.innerHeight,
      },
    });
  }, [track]);

  useEffect(() => {
    const timer30 = window.setTimeout(
      () => {
        track("time_30_seconds");
      },
      30000
    );

    const timer60 = window.setTimeout(
      () => {
        track("time_60_seconds");
      },
      60000
    );

    return () => {
      window.clearTimeout(timer30);
      window.clearTimeout(timer60);
    };
  }, [track]);

  useEffect(() => {
    function handleScroll() {
      const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

      if (documentHeight <= 0) {
        return;
      }

      const percentage = Math.round(
        (window.scrollY / documentHeight) *
          100
      );

      const marks = [25, 50, 75, 100];

      marks.forEach((mark) => {
        if (
          percentage >= mark &&
          !scrollEventsSent.current.has(mark)
        ) {
          scrollEventsSent.current.add(mark);

          track(
            `scroll_${mark}` as EventName,
            {
              metadata: {
                percentage: mark,
              },
            }
          );
        }
      });
    }

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [track]);

  useEffect(() => {
    const form =
      document.getElementById("formulario");

    if (!form) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry = entries[0];

          if (
            entry.isIntersecting &&
            !formViewed.current
          ) {
            formViewed.current = true;

            track("form_view", {
              elementId: "formulario",
            });

            observer.disconnect();
          }
        },
        {
          threshold: 0.35,
        }
      );

    observer.observe(form);

    return () => {
      observer.disconnect();
    };
  }, [track]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const clickable = target.closest(
        "a, button"
      );

      if (!clickable) {
        return;
      }

      const text =
        clickable.textContent
          ?.trim()
          .replace(/\s+/g, " ")
          .slice(0, 200) || "";

      const elementId =
        clickable.getAttribute("id") ||
        clickable.getAttribute(
          "data-track-id"
        ) ||
        null;

      const href =
        clickable instanceof
        HTMLAnchorElement
          ? clickable.href
          : "";

      const explicitEvent =
        clickable.getAttribute(
          "data-track-event"
        ) as EventName | null;

      if (explicitEvent) {
        track(explicitEvent, {
          elementId:
            elementId || undefined,
          elementText: text,
          metadata: {
            href: href || null,
          },
        });

        return;
      }

      if (
        href.includes("wa.me") ||
        href.includes("whatsapp")
      ) {
        track("whatsapp_click", {
          elementId:
            elementId || undefined,
          elementText: text,
          metadata: {
            href,
          },
        });

        return;
      }

      if (href.startsWith("tel:")) {
        track("phone_click", {
          elementId:
            elementId || undefined,
          elementText: text,
          metadata: {
            href,
          },
        });

        return;
      }

      if (
        href.includes("#formulario") ||
        text
          .toLowerCase()
          .includes("quero ajuda") ||
        text
          .toLowerCase()
          .includes("atendimento agora")
      ) {
        track("cta_click", {
          elementId:
            elementId || undefined,
          elementText: text,
          metadata: {
            href: href || null,
          },
        });
      }
    }

    document.addEventListener(
      "click",
      handleClick
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClick
      );
    };
  }, [track]);

  useEffect(() => {
    function handlePageExit() {
      sendTrackingEvent(
        "page_exit",
        {
          metadata: {
            scroll_y: window.scrollY,
          },
        },
        true
      );
    }

    window.addEventListener(
      "pagehide",
      handlePageExit
    );

    return () => {
      window.removeEventListener(
        "pagehide",
        handlePageExit
      );
    };
  }, []);

  return null;
}