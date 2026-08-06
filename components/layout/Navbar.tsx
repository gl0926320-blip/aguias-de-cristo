"use client";

import { useEffect, useState } from "react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
  "5562998213325";

const PHONE_DISPLAY = "(62) 99821-3325";

const menuItems = [
  {
    label: "Início",
    href: "#inicio",
  },
  {
    label: "Tratamento",
    href: "#tratamento",
  },
  {
    label: "Estrutura",
    href: "#estrutura",
  },
  {
    label: "FAQ",
    href: "#faq",
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 30);
    }

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!menuAberto) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAberto]);

  function fecharMenu() {
    setMenuAberto(false);
  }

  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}` +
    "?text=Olá%2C%20preciso%20de%20informações%20sobre%20o%20tratamento.";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled || menuAberto
            ? "border-white/10 bg-black/90 shadow-[0_12px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl"
            : "border-transparent bg-gradient-to-b from-black/80 to-transparent"
        }`}
      >
        <div className="mx-auto flex h-[76px] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:h-24 lg:px-8">
          {/* LOGO */}
          <a
            href="#inicio"
            onClick={fecharMenu}
            className="flex min-w-0 shrink items-center gap-3"
            aria-label="Ir para o início"
          >
<div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center sm:h-[84px] sm:w-[84px] lg:h-[92px] lg:w-[92px]">
  <img
    src="/images/logo-aguias.png"
    alt="Logo Águias de Cristo"
    className="h-full w-full object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.55)]"
  />
</div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-black tracking-wide text-white sm:text-lg lg:text-xl">
                ÁGUIAS
                <span className="text-blue-400">
                  {" "}
                  DE CRISTO
                </span>
              </h2>

              <p className="mt-0.5 text-[10px] text-gray-400 sm:text-xs">
                Lugar de Restauração
              </p>
            </div>
          </a>

          {/* MENU DESKTOP */}
          <nav
            className="hidden items-center gap-7 lg:flex xl:gap-10"
            aria-label="Menu principal"
          >
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative py-2 text-sm font-medium text-gray-300 transition hover:text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-blue-500 after:transition-all hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* AÇÕES DESKTOP */}
          <div className="hidden items-center gap-5 lg:flex">
            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              className="hidden text-right xl:block"
            >
              <span className="block text-xs text-gray-400">
                Atendimento 24h
              </span>

              <strong className="mt-0.5 block text-sm text-white transition hover:text-blue-400">
                {PHONE_DISPLAY}
              </strong>
            </a>

            <a
              href="#formulario"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-black text-white shadow-[0_12px_35px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5 hover:bg-blue-500 xl:px-6"
            >
              Quero Ajuda
            </a>
          </div>

          {/* AÇÕES MOBILE */}
          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <a
              href="#formulario"
              className="hidden min-h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-xs font-black text-white transition hover:bg-blue-500 min-[420px]:inline-flex sm:min-h-11 sm:text-sm"
            >
              Quero Ajuda
            </a>

            <button
              type="button"
              onClick={() =>
                setMenuAberto((aberto) => !aberto)
              }
              aria-label={
                menuAberto
                  ? "Fechar menu"
                  : "Abrir menu"
              }
              aria-expanded={menuAberto}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white transition hover:border-blue-500/40 hover:bg-blue-500/10"
            >
              {menuAberto ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6l12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MENU MOBILE */}
      <div
        className={`fixed inset-0 z-40 transition lg:hidden ${
          menuAberto
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={fecharMenu}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        />

        <div
          className={`absolute inset-x-3 top-[84px] max-h-[calc(100dvh-100px)] overflow-y-auto rounded-3xl border border-white/10 bg-[#050914]/95 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.75)] backdrop-blur-2xl transition duration-300 sm:inset-x-6 sm:top-[88px] sm:p-5 ${
            menuAberto
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-3 scale-[0.98] opacity-0"
          }`}
        >
          <nav
            className="space-y-1"
            aria-label="Menu mobile"
          >
            {menuItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={fecharMenu}
                className="flex min-h-14 items-center justify-between rounded-2xl border border-transparent px-4 text-sm font-bold text-gray-300 transition hover:border-blue-500/20 hover:bg-blue-500/10 hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-xs text-blue-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {item.label}
                </span>

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 text-gray-600"
                  aria-hidden="true"
                >
                  <path
                    d="m9 6 6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            ))}
          </nav>

          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-white/10 pt-4 min-[420px]:grid-cols-2">
            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              onClick={fecharMenu}
              className="flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-center text-sm font-bold text-gray-200 transition hover:border-blue-500/30 hover:bg-blue-500/10"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 text-blue-400"
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

              Ligar agora
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={fecharMenu}
              className="flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-blue-600 px-4 text-center text-sm font-black text-white shadow-[0_12px_35px_rgba(37,99,235,0.25)] transition hover:bg-blue-500"
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

              Abrir WhatsApp
            </a>
          </div>

          <div className="mt-4 rounded-2xl border border-blue-500/15 bg-blue-500/[0.07] px-4 py-3 text-center">
            <p className="text-xs font-bold text-blue-300">
              Atendimento confidencial 24 horas
            </p>

            <p className="mt-1 text-[11px] text-gray-500">
              Sua conversa será tratada com respeito e sigilo.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}