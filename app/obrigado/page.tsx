"use client";

import { useEffect, useState } from "react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
  "5562994043036";

export default function ObrigadoPage() {
  const [nome, setNome] = useState("");

  useEffect(() => {
    const nomeSalvo =
      sessionStorage.getItem(
        "aguias_ultimo_lead_nome"
      ) || "";

    setNome(nomeSalvo);
  }, []);

  const mensagemWhatsApp = encodeURIComponent(
    nome
      ? `Olá, meu nome é ${nome}. Acabei de enviar uma solicitação de atendimento pelo site da Comunidade Terapêutica Águias de Cristo e gostaria de falar com a equipe.`
      : "Olá. Acabei de enviar uma solicitação de atendimento pelo site da Comunidade Terapêutica Águias de Cristo e gostaria de falar com a equipe."
  );

  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}` +
    `?text=${mensagemWhatsApp}`;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050706] px-4 py-10 text-white sm:px-6">
      {/* FUNDO */}
      <div className="absolute inset-0">
        <img
          src="/images/hero.png"
          alt=""
          className="h-full w-full object-cover object-center opacity-20"
        />

        <div className="absolute inset-0 bg-black/85" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.16),transparent_38%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(22,163,74,0.10),transparent_38%)]" />
      </div>

      {/* DECORAÇÃO */}
      <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-green-500/10 blur-[100px] sm:h-96 sm:w-96" />

      <div className="pointer-events-none absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-green-700/10 blur-[110px] sm:h-[420px] sm:w-[420px]" />

      <section className="relative z-10 w-full max-w-2xl">
        {/* LOGO */}
        <div className="mb-7 text-center sm:mb-9">
          <a
            href="/"
            className="inline-flex flex-col"
          >
            <strong className="text-xl font-black tracking-wide sm:text-2xl">
              ÁGUIAS
              <span className="text-green-500">
                {" "}
                DE CRISTO
              </span>
            </strong>

            <span className="mt-1 text-xs text-gray-500">
              Lugar de Restauração
            </span>
          </a>
        </div>

        {/* CARD */}
        <div className="overflow-hidden rounded-[26px] border border-white/10 bg-black/55 shadow-[0_35px_120px_rgba(0,0,0,0.75)] backdrop-blur-2xl sm:rounded-[32px]">
          <div className="border-b border-white/10 bg-green-500/[0.04] px-5 py-8 text-center sm:px-10 sm:py-10">
            {/* ÍCONE */}
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 sm:h-24 sm:w-24">
              <div className="absolute inset-2 animate-pulse rounded-full bg-green-500/5" />

              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="relative h-10 w-10 text-green-500 sm:h-12 sm:w-12"
                aria-hidden="true"
              >
                <path
                  d="M20 6 9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-green-500">
              Solicitação recebida
            </p>

            <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
              {nome
                ? `${nome}, recebemos seus dados.`
                : "Recebemos seus dados."}
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-400 sm:text-base sm:leading-8">
              Nossa equipe recebeu sua solicitação e entrará
              em contato o mais rápido possível para compreender
              a situação e orientar sobre os próximos passos.
            </p>
          </div>

          <div className="px-5 py-6 sm:px-10 sm:py-8">
            {/* STATUS */}
            <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.07] p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-green-500" />

                <div>
                  <p className="text-sm font-black text-green-300">
                    Equipe disponível agora
                  </p>

                  <p className="mt-1 text-xs leading-6 text-gray-500 sm:text-sm">
                    Para falar imediatamente com nossa equipe,
                    abra uma conversa pelo WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            {/* BOTÕES */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-14 items-center justify-center gap-3 rounded-xl bg-green-600 px-5 text-center text-sm font-black text-white shadow-[0_15px_45px_rgba(22,163,74,0.25)] transition hover:-translate-y-0.5 hover:bg-green-500 sm:text-base"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.6Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M8.3 8.2c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4 0 .7.6 1.1 1.6 2 2.7 2.6.3.2.5.1.7-.1l.7-.9c.2-.3.5-.3.8-.2l1.8.8c.3.1.4.3.4.6 0 .4-.2 1.3-.8 1.8-.6.5-1.4.8-2.4.5-1.5-.4-3.3-1.3-4.8-2.7-1.2-1.1-2.3-2.8-2.7-4.3-.3-.9.1-1.6.5-2Z"
                    fill="currentColor"
                  />
                </svg>

                Falar no WhatsApp
              </a>

              <a
                href={`tel:+${WHATSAPP_NUMBER}`}
                className="flex min-h-14 items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-5 text-center text-sm font-bold text-gray-200 transition hover:border-green-500/30 hover:bg-green-500/10 hover:text-green-300 sm:text-base"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 text-green-500"
                  aria-hidden="true"
                >
                  <path
                    d="M7.5 4.5 10 8 8.2 9.8c1.2 2.5 3.5 4.8 6 6L16 14l3.5 2.5-.7 3c-.2.9-1 1.5-1.9 1.5C9.2 20.4 3.6 14.8 3 7.1c-.1-.9.6-1.7 1.5-1.9l3-.7Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                Fazer uma ligação
              </a>
            </div>

            <a
              href="/"
              className="mx-auto mt-6 flex w-fit items-center justify-center rounded-lg px-4 py-2 text-sm text-gray-500 transition hover:bg-white/5 hover:text-green-500"
            >
              ← Voltar para a página inicial
            </a>

            {/* SEGURANÇA */}
            <div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-6">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="mt-0.5 h-5 w-5 shrink-0 text-green-500"
                aria-hidden="true"
              >
                <path
                  d="M12 3 5 6v5c0 4.4 2.8 8.3 7 10 4.2-1.7 7-5.6 7-10V6l-7-3Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />

                <path
                  d="m9 12 2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <p className="text-xs leading-5 text-gray-600">
                Seus dados são utilizados somente para o
                atendimento e tratados com confidencialidade.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-700">
          © 2026 Comunidade Terapêutica Águias de Cristo
        </p>
      </section>
    </main>
  );
}