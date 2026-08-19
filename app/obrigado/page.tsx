"use client";

import { useEffect, useState } from "react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
  "5562994093021";

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
      ? `Olá, meu nome é ${nome}. Acabei de enviar uma solicitação de atendimento pelo site da Reconciliar e gostaria de falar com a equipe.`
      : "Olá. Acabei de enviar uma solicitação de atendimento pelo site da Reconciliar e gostaria de falar com a equipe."
  );

  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}` +
    `?text=${mensagemWhatsApp}`;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#03050a] px-4 py-10 text-white sm:px-6">
      {/* FUNDO */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-aguias.jpg"
          alt=""
          className="h-full w-full object-cover object-center opacity-20"
        />

        <div className="absolute inset-0 bg-black/85" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.14),transparent_38%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(185,28,28,0.10),transparent_38%)]" />
      </div>

      {/* LOGO COMO MARCA-D'ÁGUA */}
      <div className="pointer-events-none absolute right-[-100px] top-1/2 hidden -translate-y-1/2 opacity-[0.07] lg:block">
        <img
          src="/images/logo-reconciliar.png"
          alt=""
          aria-hidden="true"
          className="h-auto w-[520px] object-contain grayscale"
        />
      </div>

      {/* DECORAÇÃO */}
      <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-red-500/10 blur-[100px] sm:h-96 sm:w-96" />

      <div className="pointer-events-none absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-red-700/10 blur-[110px] sm:h-[420px] sm:w-[420px]" />

      <section className="relative z-10 w-full max-w-2xl">
        {/* LOGO */}
        <div className="mb-7 text-center sm:mb-9">
          <a
            href="/"
            className="inline-flex flex-col items-center"
          >
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-red-400/20 bg-black shadow-[0_15px_45px_rgba(0,0,0,0.25)] sm:h-32 sm:w-32">
              <img
                src="/images/logo-reconciliar.png"
                alt="Logo Reconciliar"
                className="h-full w-full object-contain p-1"
              />
            </div>

            <strong className="mt-4 text-xl font-black tracking-wide sm:text-2xl">
              RECON
              <span className="text-red-500">
                CILIAR
              </span>
            </strong>

            <span className="mt-1 text-xs text-gray-500">
              Tratamento para dependência química
            </span>
          </a>
        </div>

        {/* CARD */}
        <div className="overflow-hidden rounded-[26px] border border-red-400/15 bg-black/60 shadow-[0_35px_120px_rgba(0,0,0,0.75)] backdrop-blur-2xl sm:rounded-[32px]">
          <div className="border-b border-white/10 bg-red-500/[0.04] px-5 py-8 text-center sm:px-10 sm:py-10">
            {/* ÍCONE */}
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 sm:h-24 sm:w-24">
              <div className="absolute inset-2 animate-pulse rounded-full bg-red-500/5" />

              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="relative h-10 w-10 text-red-400 sm:h-12 sm:w-12"
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

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-red-400">
              Solicitação recebida
            </p>

            <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
              {nome
                ? `${nome}, recebemos seus dados.`
                : "Recebemos seus dados."}
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-400 sm:text-base sm:leading-8">
              Nossa equipe recebeu sua solicitação e entrará
              em contato para compreender a situação,
              esclarecer as possibilidades de atendimento e orientar
              sobre os próximos passos.
            </p>
          </div>

          <div className="px-5 py-6 sm:px-10 sm:py-8">
            {/* STATUS */}
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.07] p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-400" />

                <div>
                  <p className="text-sm font-black text-red-300">
                    Fale diretamente com a equipe
                  </p>

                  <p className="mt-1 text-xs leading-6 text-gray-500 sm:text-sm">
                    Se preferir continuar o atendimento agora,
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
                className="flex min-h-14 items-center justify-center gap-3 rounded-xl bg-red-600 px-5 text-center text-sm font-black text-white shadow-[0_15px_45px_rgba(220,38,38,0.22)] transition hover:-translate-y-0.5 hover:bg-red-500 sm:text-base"
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
                className="flex min-h-14 items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-5 text-center text-sm font-bold text-gray-200 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 sm:text-base"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 text-red-400"
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
              className="mx-auto mt-6 flex w-fit items-center justify-center rounded-lg px-4 py-2 text-sm text-gray-500 transition hover:bg-white/5 hover:text-red-400"
            >
              ← Voltar para a página inicial
            </a>

            {/* SEGURANÇA */}
            <div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-6">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
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
          © 2026 Reconciliar
        </p>
      </section>
    </main>
  );
}
