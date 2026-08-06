import ConversionSections from "@/components/ConversionSections";
import LeadForm from "@/components/LeadForm";
import Navbar from "@/components/layout/Navbar";
import Tracker from "@/components/tracking/Tracker";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <Tracker />
      <Navbar />

      {/* HERO */}
      <section
        id="inicio"
        className="relative flex min-h-screen scroll-mt-24 items-center pb-16 pt-28 sm:pb-20 lg:pb-16 lg:pt-24"
      >
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/images/hero.png"
            alt="Comunidade Terapêutica Águias de Cristo"
            className="h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-black/75" />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/30" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#050706] via-transparent to-transparent" />
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 md:px-8 lg:grid-cols-2 lg:gap-14 lg:px-8 xl:gap-16">
          {/* Texto */}
          <div className="order-2 lg:order-1">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-500 bg-green-700/20 px-3 py-2 text-[11px] text-green-300 sm:mb-6 sm:px-4 sm:text-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              Atendimento 24 horas • Sigilo absoluto
            </span>

            <h1 className="max-w-3xl text-4xl font-black leading-[1.03] sm:text-5xl md:text-6xl lg:text-[58px] xl:text-7xl">
              Existe
              <span className="text-green-500"> esperança.</span>
              <br />
              E ela pode começar
              <br />
              hoje.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8 lg:mt-7 lg:text-xl">
              Tratamento especializado para dependência química e alcoolismo,
              com acolhimento humanizado, equipe multidisciplinar,
              acompanhamento familiar e apoio espiritual.
            </p>

            <div className="mt-7 flex flex-col gap-3 min-[460px]:flex-row sm:mt-9 sm:gap-4">
              <a
                href="#formulario"
                data-track-id="hero-formulario"
                className="flex min-h-14 w-full items-center justify-center rounded-xl bg-green-600 px-6 text-center text-sm font-black shadow-[0_15px_45px_rgba(22,163,74,0.25)] transition hover:-translate-y-0.5 hover:bg-green-500 min-[460px]:w-auto sm:px-8 sm:text-base"
              >
                Quero ajuda agora
              </a>

              <a
                href="https://wa.me/5562994043036?text=Olá%2C%20preciso%20de%20informações%20sobre%20o%20tratamento."
                target="_blank"
                rel="noopener noreferrer"
                data-track-id="hero-whatsapp"
                className="flex min-h-14 w-full items-center justify-center rounded-xl border border-white/20 px-6 text-center text-sm font-bold transition hover:border-green-500 hover:bg-green-500/10 min-[460px]:w-auto sm:px-8 sm:text-base"
              >
                Falar pelo WhatsApp
              </a>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-sm">
                <h2 className="text-2xl font-black text-green-500 sm:text-3xl">
                  10+
                </h2>

                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Anos
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-sm">
                <h2 className="text-2xl font-black text-green-500 sm:text-3xl">
                  24h
                </h2>

                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Atendimento
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-sm">
                <h2 className="text-2xl font-black text-green-500 sm:text-3xl">
                  30
                </h2>

                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Vagas
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-sm">
                <h2 className="text-2xl font-black text-green-500 sm:text-3xl">
                  100%
                </h2>

                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Sigilo
                </p>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="order-1 w-full lg:order-2">
            <LeadForm />
          </div>
        </div>
      </section>

      <ConversionSections />
    </main>
  );
}