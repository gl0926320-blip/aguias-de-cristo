import ConversionSections from "@/components/ConversionSections";
import LeadForm from "@/components/LeadForm";
import Navbar from "@/components/layout/Navbar";
import Tracker from "@/components/tracking/Tracker";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
  "5562994093021";

const WHATSAPP_URL =
  `https://wa.me/${WHATSAPP_NUMBER}` +
  "?text=Olá%2C%20preciso%20de%20informações%20sobre%20o%20tratamento.";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#03050a] text-white">
      <Tracker />
      <Navbar />

      {/* HERO */}
      <section
        id="inicio"
        className="relative flex min-h-screen scroll-mt-24 items-center overflow-hidden pb-16 pt-28 sm:pb-20 lg:pb-16 lg:pt-24"
      >
        {/* FOTO DE FUNDO */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-aguias.jpg"
            alt="Atendimento Reconciliar"
            className="h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-black/65" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#100405] via-[#180708]/90 to-[#100405]/35" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#03050a] via-black/10 to-black/25" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(220,38,38,0.16),transparent_36%)]" />
        </div>

        {/* LOGO COMO MARCA-D'ÁGUA AO FUNDO */}
        <div className="pointer-events-none absolute right-[-90px] top-1/2 z-[1] hidden -translate-y-1/2 opacity-[0.10] lg:block xl:right-[-20px]">
          <img
            src="/images/logo-reconciliar.png"
            alt=""
            aria-hidden="true"
            className="h-auto w-[520px] object-contain grayscale xl:w-[620px]"
          />
        </div>

        {/* Marca-d'água menor no celular */}
        <div className="pointer-events-none absolute right-[-75px] top-24 z-[1] opacity-[0.08] lg:hidden">
          <img
            src="/images/logo-reconciliar.png"
            alt=""
            aria-hidden="true"
            className="h-auto w-[260px] object-contain grayscale"
          />
        </div>

        {/* CONTEÚDO */}
        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 md:px-8 lg:grid-cols-2 lg:gap-14 lg:px-8 xl:gap-16">
          {/* TEXTO */}
          <div className="order-2 lg:order-1">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/70 bg-red-600/15 px-3 py-2 text-[11px] font-semibold text-red-200 backdrop-blur-sm sm:mb-6 sm:px-4 sm:text-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />

              Internação voluntária e involuntária • Atendimento confidencial
            </span>

            <h1 className="max-w-3xl text-4xl font-black leading-[1.03] text-white sm:text-5xl md:text-6xl lg:text-[58px] xl:text-7xl">
              Existe
              <span className="text-red-400">
                {" "}
                esperança.
              </span>

              <br />

              O cuidado pode começar

              <br />

              hoje.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-200 sm:text-lg sm:leading-8 lg:mt-7 lg:text-xl">
              Tratamento para dependência química com atendimento de psiquiatra,
              psicólogo e terapeuta, ambiente aconchegante, equipe multidisciplinar
              e acolhimento para o público masculino e feminino.
            </p>

            <div className="mt-7 flex flex-col gap-3 min-[460px]:flex-row sm:mt-9 sm:gap-4">
              <a
                href="#formulario"
                data-track-id="hero-formulario"
                className="flex min-h-14 w-full items-center justify-center rounded-xl bg-red-600 px-6 text-center text-sm font-black text-white shadow-[0_15px_45px_rgba(220,38,38,0.24)] transition hover:-translate-y-0.5 hover:bg-red-500 min-[460px]:w-auto sm:px-8 sm:text-base"
              >
                Quero ajuda agora
              </a>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-track-id="hero-whatsapp"
                className="flex min-h-14 w-full items-center justify-center rounded-xl border border-white/25 bg-black/20 px-6 text-center text-sm font-bold text-white backdrop-blur-sm transition hover:border-red-400 hover:bg-red-500/10 min-[460px]:w-auto sm:px-8 sm:text-base"
              >
                Falar pelo WhatsApp
              </a>
            </div>

            {/* INDICADORES */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-4">
              <div className="rounded-2xl border border-red-400/20 bg-black/40 p-4 backdrop-blur-md">
                <h2 className="text-2xl font-black text-red-400 sm:text-3xl">
                  2
                </h2>

                <p className="mt-1 text-xs text-gray-300 sm:text-sm">
                  Modalidades de internação
                </p>
              </div>

              <div className="rounded-2xl border border-red-400/20 bg-black/40 p-4 backdrop-blur-md">
                <h2 className="text-2xl font-black text-red-400 sm:text-3xl">
                  M/F
                </h2>

                <p className="mt-1 text-xs text-gray-300 sm:text-sm">
                  Masculino e feminino
                </p>
              </div>

              <div className="rounded-2xl border border-red-400/20 bg-black/40 p-4 backdrop-blur-md">
                <h2 className="text-2xl font-black text-red-400 sm:text-3xl">
                  3+
                </h2>

                <p className="mt-1 text-xs text-gray-300 sm:text-sm">
                  Especialidades
                </p>
              </div>

              <div className="rounded-2xl border border-red-400/20 bg-black/40 p-4 backdrop-blur-md">
                <h2 className="text-2xl font-black text-red-400 sm:text-3xl">
                  Sigilo
                </h2>

                <p className="mt-1 text-xs text-gray-300 sm:text-sm">
                  Atendimento confidencial
                </p>
              </div>
            </div>
          </div>

          {/* FORMULÁRIO */}
          <div className="order-1 w-full lg:order-2">
            <LeadForm />
          </div>
        </div>
      </section>

      <ConversionSections />
    </main>
  );
}
