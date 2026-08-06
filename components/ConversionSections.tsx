"use client";

import { useState } from "react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
  "5562994043036";

const whatsappUrl =
  `https://wa.me/${WHATSAPP_NUMBER}` +
  "?text=Olá%2C%20preciso%20de%20informações%20sobre%20o%20tratamento.";

const etapas = [
  {
    numero: "01",
    titulo: "Fale com nossa equipe",
    descricao:
      "Conte de forma confidencial o que está acontecendo. Nossa equipe está disponível 24 horas.",
    icone: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    numero: "02",
    titulo: "Entendemos a situação",
    descricao:
      "Avaliamos o caso, o histórico e as necessidades da pessoa que precisa de ajuda.",
    icone: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
          stroke="currentColor"
          strokeWidth="1.7"
        />

        <path
          d="M9 12.2 11 14l4-4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    numero: "03",
    titulo: "Orientamos o acolhimento",
    descricao:
      "Explicamos como funciona o tratamento, a estrutura e os próximos passos para a internação.",
    icone: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          d="M4 20h16M6 20V9l6-5 6 5v11M9 20v-6h6v6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const diferenciais = [
  {
    titulo: "Atendimento humanizado",
    descricao:
      "Cada pessoa é acolhida com dignidade, respeito e escuta, sem julgamentos.",
    icone: "♡",
  },
  {
    titulo: "Equipe multidisciplinar",
    descricao:
      "Acompanhamento integrado durante todas as etapas do processo de recuperação.",
    icone: "✦",
  },
  {
    titulo: "Acompanhamento familiar",
    descricao:
      "A família recebe orientação e participa do processo de restauração.",
    icone: "⌂",
  },
  {
    titulo: "Apoio espiritual cristão",
    descricao:
      "A fé faz parte da rotina e fortalece o propósito de transformação.",
    icone: "✝",
  },
  {
    titulo: "Ambiente rural tranquilo",
    descricao:
      "Espaço afastado dos estímulos urbanos, cercado por natureza e tranquilidade.",
    icone: "⌁",
  },
  {
    titulo: "Rotina segura e estruturada",
    descricao:
      "Atividades planejadas, acompanhamento contínuo e organização diária.",
    icone: "✓",
  },
];

const estrutura = [
  {
    titulo: "Alojamentos",
    descricao:
      "Espaços organizados para descanso, convivência e recuperação.",
  },
  {
    titulo: "Área de convivência",
    descricao:
      "Ambiente para atividades, integração e momentos de reflexão.",
  },
  {
    titulo: "Espaço espiritual",
    descricao:
      "Local dedicado a cultos, orações e desenvolvimento espiritual.",
  },
  {
    titulo: "Área externa",
    descricao:
      "Contato com a natureza, atividades físicas e ambiente de tranquilidade.",
  },
];

const perguntas = [
  {
    pergunta: "Quanto tempo dura o tratamento?",
    resposta:
      "O tempo pode variar conforme o caso e a evolução de cada pessoa. A equipe orienta a família após compreender a situação.",
  },
  {
    pergunta: "Como funciona o processo de acolhimento?",
    resposta:
      "Primeiro conversamos com a família ou com a pessoa que precisa de ajuda. Depois explicamos o funcionamento da comunidade, avaliamos o caso e orientamos os próximos passos.",
  },
  {
    pergunta: "A família recebe acompanhamento?",
    resposta:
      "Sim. A família faz parte do processo de recuperação e recebe orientações durante o período de tratamento.",
  },
  {
    pergunta: "Existe atendimento durante a madrugada?",
    resposta:
      "Sim. O atendimento para orientações e solicitações de ajuda funciona 24 horas por dia, todos os dias da semana.",
  },
  {
    pergunta: "O atendimento é confidencial?",
    resposta:
      "Sim. As informações fornecidas pelo formulário, telefone ou WhatsApp são tratadas com respeito, cuidado e confidencialidade.",
  },
];

export default function ConversionSections() {
  const [faqAberta, setFaqAberta] =
    useState<number | null>(0);

  function abrirFaq(index: number) {
    const vaiAbrir =
      faqAberta === index ? null : index;

    setFaqAberta(vaiAbrir);

    if (vaiAbrir !== null) {
      window.trackAguiasEvent?.("faq_open", {
        elementId: `faq-${index}`,
        elementText:
          perguntas[index].pergunta,
      });
    }
  }

  return (
    <>
      {/* FAIXA DE CONFIANÇA */}
      <section className="relative z-10 border-y border-white/10 bg-[#080b09]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-white/10 px-4 sm:px-6 md:grid-cols-4 md:divide-y-0 lg:px-8">
          <div className="flex min-h-28 flex-col justify-center px-4 py-5 sm:px-6">
            <strong className="text-sm font-black text-white sm:text-base">
              Atendimento 24h
            </strong>

            <span className="mt-1 text-xs leading-5 text-gray-500">
              Equipe disponível todos os dias
            </span>
          </div>

          <div className="flex min-h-28 flex-col justify-center px-4 py-5 sm:px-6">
            <strong className="text-sm font-black text-white sm:text-base">
              Sigilo absoluto
            </strong>

            <span className="mt-1 text-xs leading-5 text-gray-500">
              Atendimento confidencial
            </span>
          </div>

          <div className="flex min-h-28 flex-col justify-center px-4 py-5 sm:px-6">
            <strong className="text-sm font-black text-white sm:text-base">
              Equipe preparada
            </strong>

            <span className="mt-1 text-xs leading-5 text-gray-500">
              Acolhimento humanizado
            </span>
          </div>

          <div className="flex min-h-28 flex-col justify-center px-4 py-5 sm:px-6">
            <strong className="text-sm font-black text-white sm:text-base">
              Apoio à família
            </strong>

            <span className="mt-1 text-xs leading-5 text-gray-500">
              Orientação durante o processo
            </span>
          </div>
        </div>
      </section>

      {/* TRATAMENTO */}
      <section
        id="tratamento"
        className="scroll-mt-24 bg-[#050706] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-[0.22em] text-green-500">
              O primeiro passo
            </span>

            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Pedir ajuda pode ser mais simples do que parece.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
              Nossa equipe acolhe a família, entende a situação e orienta sobre
              o melhor caminho para iniciar o tratamento.
            </p>
          </div>

          <div className="relative mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 lg:mt-16">
            {etapas.map((etapa) => (
              <article
                key={etapa.numero}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f0c] p-6 transition duration-300 hover:-translate-y-1 hover:border-green-500/30 sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10 text-green-400">
                    {etapa.icone}
                  </div>

                  <span className="text-4xl font-black text-white/[0.04] transition group-hover:text-green-500/10">
                    {etapa.numero}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-black">
                  {etapa.titulo}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {etapa.descricao}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA INTERMEDIÁRIO */}
      <section className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-green-500/20 bg-gradient-to-r from-green-950/70 via-[#0a140d] to-[#070a08] px-5 py-8 sm:px-8 sm:py-10 lg:flex lg:items-center lg:justify-between lg:px-12">
          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-green-500">
              Não espere a situação piorar
            </p>

            <h2 className="mt-3 text-2xl font-black sm:text-3xl">
              Uma conversa pode ser o início de uma mudança.
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400 sm:text-base">
              Fale com nossa equipe e receba uma orientação confidencial sobre
              o caso.
            </p>
          </div>

          <div className="relative z-10 mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
            <a
              href="#formulario"
              className="flex min-h-13 items-center justify-center rounded-xl bg-green-600 px-6 py-4 text-center text-sm font-black transition hover:bg-green-500"
            >
              Solicitar atendimento
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-13 items-center justify-center rounded-xl border border-white/15 px-6 py-4 text-center text-sm font-bold transition hover:border-green-500/40 hover:bg-green-500/10"
            >
              Falar no WhatsApp
            </a>
          </div>

          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-green-500/10 blur-[80px]" />
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="border-y border-white/10 bg-[#080b09] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-black uppercase tracking-[0.22em] text-green-500">
              Por que escolher
            </span>

            <h2 className="mt-4 text-3xl font-black sm:text-4xl lg:text-5xl">
              Cuidado completo durante a recuperação.
            </h2>

            <p className="mt-5 text-base leading-8 text-gray-400 sm:text-lg">
              Um ambiente preparado para acolher, orientar e apoiar cada etapa
              da restauração.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {diferenciais.map((diferencial) => (
              <article
                key={diferencial.titulo}
                className="group rounded-3xl border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-green-500/25 hover:bg-green-500/[0.04]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-xl text-green-500 transition group-hover:border-green-500/20 group-hover:bg-green-500/10">
                  {diferencial.icone}
                </div>

                <h3 className="mt-6 text-lg font-black">
                  {diferencial.titulo}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {diferencial.descricao}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ESTRUTURA */}
      <section
        id="estrutura"
        className="scroll-mt-24 bg-[#050706] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.22em] text-green-500">
                Nossa estrutura
              </span>

              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Um ambiente de paz, segurança e restauração.
              </h2>

              <p className="mt-5 text-base leading-8 text-gray-400 sm:text-lg">
                A comunidade está localizada em uma região tranquila, afastada
                do movimento urbano e preparada para apoiar a recuperação.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <strong className="text-2xl font-black text-green-500">
                    30
                  </strong>

                  <p className="mt-1 text-xs text-gray-500">
                    Vagas disponíveis
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <strong className="text-2xl font-black text-green-500">
                    24h
                  </strong>

                  <p className="mt-1 text-xs text-gray-500">
                    Atendimento contínuo
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {estrutura.map((item, index) => (
                <article
                  key={item.titulo}
                  className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#101511] to-[#090c0a] p-6 sm:min-h-56 ${
                    index === 0 || index === 3
                      ? "sm:translate-y-5"
                      : ""
                  }`}
                >
                  <span className="text-xs font-black text-green-500">
                    0{index + 1}
                  </span>

                  <h3 className="mt-12 text-xl font-black">
                    {item.titulo}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    {item.descricao}
                  </p>

                  <div className="pointer-events-none absolute -bottom-16 -right-16 h-36 w-36 rounded-full bg-green-500/[0.06] blur-3xl" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="scroll-mt-24 border-t border-white/10 bg-[#080b09] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.22em] text-green-500">
              Tire suas dúvidas
            </span>

            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Perguntas frequentes.
            </h2>

            <p className="mt-5 max-w-lg text-base leading-8 text-gray-400">
              Não encontrou a resposta que procurava? Nossa equipe está
              disponível para orientar sua família.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl border border-green-500/25 bg-green-500/10 px-5 text-sm font-black text-green-300 transition hover:bg-green-500/20"
            >
              Tirar dúvidas pelo WhatsApp
            </a>
          </div>

          <div className="space-y-3">
            {perguntas.map((item, index) => {
              const aberta = faqAberta === index;

              return (
                <article
                  key={item.pergunta}
                  className={`overflow-hidden rounded-2xl border transition ${
                    aberta
                      ? "border-green-500/25 bg-green-500/[0.05]"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <button
                    id={`faq-${index}`}
                    type="button"
                    data-track-event="faq_open"
                    onClick={() => abrirFaq(index)}
                    aria-expanded={aberta}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                  >
                    <span className="text-sm font-bold sm:text-base">
                      {item.pergunta}
                    </span>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-xl text-green-500 transition ${
                        aberta ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      aberta
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-7 text-gray-500 sm:px-6 sm:pb-6">
                        {item.resposta}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden bg-[#050706] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-bold text-green-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            Atendimento disponível agora
          </span>

          <h2 className="mt-6 text-3xl font-black leading-tight sm:text-4xl lg:text-6xl">
            Não precisa enfrentar essa situação sozinho.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
            Converse com nossa equipe e descubra como iniciar o processo de
            recuperação.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#formulario"
              className="flex min-h-14 items-center justify-center rounded-xl bg-green-600 px-7 text-sm font-black transition hover:bg-green-500 sm:text-base"
            >
              Solicitar atendimento agora
            </a>

            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              className="flex min-h-14 items-center justify-center rounded-xl border border-white/15 px-7 text-sm font-bold transition hover:border-green-500/30 hover:bg-green-500/10 sm:text-base"
            >
              Ligar para a equipe
            </a>
          </div>

          <p className="mt-5 text-xs text-gray-600">
            Atendimento confidencial 24 horas por dia.
          </p>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/[0.06] blur-[130px]" />
      </section>

      {/* RODAPÉ */}
      <footer className="border-t border-white/10 bg-[#030403] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            <p className="font-black">
              ÁGUIAS
              <span className="text-green-500">
                {" "}
                DE CRISTO
              </span>
            </p>

            <p className="mt-1 text-xs text-gray-600">
              Lugar de Restauração
            </p>
          </div>

          <div className="text-xs leading-5 text-gray-600">
            <p>Atendimento 24 horas</p>

            <p>Comunidade Terapêutica Águias de Cristo</p>
          </div>

          <p className="text-xs text-gray-700">
            © 2026 Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* BOTÃO FLUTUANTE MOBILE */}
      <div className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-[1fr_auto] gap-2 rounded-2xl border border-white/10 bg-black/90 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:inset-x-auto sm:bottom-5 sm:right-5 sm:flex lg:hidden">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-track-id="whatsapp-flutuante"
          className="flex min-h-12 items-center justify-center rounded-xl bg-green-600 px-5 text-sm font-black text-white transition hover:bg-green-500"
        >
          Falar no WhatsApp
        </a>

        <a
          href={`tel:+${WHATSAPP_NUMBER}`}
          data-track-id="telefone-flutuante"
          aria-label="Ligar agora"
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-lg text-green-400"
        >
          ☎
        </a>
      </div>

      {/* ESPAÇO PARA O BOTÃO FIXO NO CELULAR */}
      <div className="h-20 bg-[#030403] lg:hidden" />
    </>
  );
}