"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] =
    useState(false);

  const [carregando, setCarregando] =
    useState(false);

  const [verificandoSessao, setVerificandoSessao] =
    useState(true);

  const [erro, setErro] = useState("");

  useEffect(() => {
    async function verificarSessao() {
      try {
        const supabase =
          createSupabaseBrowserClient();

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          router.replace("/admin");
          return;
        }
      } catch (error) {
        console.error(
          "Erro ao verificar sessão:",
          error
        );
      } finally {
        setVerificandoSessao(false);
      }
    }

    verificarSessao();
  }, [router]);

  async function entrar(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErro("");

    const emailLimpo = email
      .trim()
      .toLowerCase();

    if (!emailLimpo) {
      setErro("Informe seu e-mail.");
      return;
    }

    if (!emailLimpo.includes("@")) {
      setErro("Informe um e-mail válido.");
      return;
    }

    if (!senha) {
      setErro("Informe sua senha.");
      return;
    }

    if (senha.length < 6) {
      setErro(
        "A senha deve possuir pelo menos 6 caracteres."
      );
      return;
    }

    setCarregando(true);

    try {
      const supabase =
        createSupabaseBrowserClient();

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: emailLimpo,
          password: senha,
        });

      if (error) {
        console.error(
          "Erro de autenticação:",
          error
        );

        setErro(
          "E-mail ou senha incorretos."
        );

        return;
      }

      if (!data.user || !data.session) {
        setErro(
          "Não foi possível iniciar sua sessão."
        );

        return;
      }

      /*
       * Verifica se o usuário também está autorizado
       * na tabela admin_profiles.
       */
      const {
        data: perfil,
        error: perfilError,
      } = await supabase
        .from("admin_profiles")
        .select(
          "id, nome, email, nivel_acesso, ativo"
        )
        .eq("id", data.user.id)
        .maybeSingle();

      if (perfilError) {
        console.error(
          "Erro ao consultar perfil:",
          perfilError
        );

        await supabase.auth.signOut();

        setErro(
          "Não foi possível validar seu acesso administrativo."
        );

        return;
      }

      if (!perfil) {
        await supabase.auth.signOut();

        setErro(
          "Este usuário não possui acesso ao painel."
        );

        return;
      }

      if (!perfil.ativo) {
        await supabase.auth.signOut();

        setErro(
          "Este acesso administrativo está desativado."
        );

        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (error) {
      console.error(
        "Erro inesperado no login:",
        error
      );

      setErro(
        "Ocorreu um erro ao entrar. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  }

  if (verificandoSessao) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050706] px-4 text-white sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-green-500 sm:h-12 sm:w-12" />

          <p className="text-sm text-gray-400">
            Verificando acesso...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050706] text-white">
      {/* Fundo */}
      <div className="fixed inset-0">
        <img
          src="/images/hero.png"
          alt=""
          className="h-full w-full object-cover object-center opacity-20"
        />

        <div className="absolute inset-0 bg-black/80" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.16),transparent_35%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(22,163,74,0.10),transparent_35%)]" />
      </div>

      {/* Decoração */}
      <div className="pointer-events-none fixed -right-36 -top-36 h-[280px] w-[280px] rounded-full bg-green-500/10 blur-[100px] sm:-right-44 sm:-top-44 sm:h-[380px] sm:w-[380px] lg:h-[420px] lg:w-[420px] lg:blur-[120px]" />

      <div className="pointer-events-none fixed -bottom-44 -left-32 h-[300px] w-[300px] rounded-full bg-green-700/10 blur-[105px] sm:-bottom-52 sm:-left-40 sm:h-[390px] sm:w-[390px] lg:h-[440px] lg:w-[440px] lg:blur-[130px]" />

      <section className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(430px,0.95fr)]">
        {/* Lado institucional */}
        <div className="hidden min-h-screen flex-col justify-between border-r border-white/10 px-8 py-8 lg:flex xl:px-12 xl:py-10 2xl:px-16 2xl:py-12">
          <div>
            <a
              href="/"
              className="inline-flex flex-col"
            >
              <strong className="text-xl font-black tracking-wide xl:text-2xl">
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

          <div className="my-10 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs text-green-400 xl:text-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              Central administrativa
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.05] xl:mt-7 xl:text-5xl 2xl:text-6xl">
              Gestão inteligente da
              <span className="text-green-500">
                {" "}
                captação.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-gray-400 xl:mt-6 xl:text-lg xl:leading-8">
              Acompanhe novos contatos, visitas,
              origens das campanhas e resultados da
              landing page em um só lugar.
            </p>

            <div className="mt-8 grid max-w-lg grid-cols-1 gap-4 xl:mt-10 xl:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 xl:p-5">
                <strong className="block text-base xl:text-lg">
                  Leads em tempo real
                </strong>

                <span className="mt-2 block text-sm leading-6 text-gray-500">
                  Visualize cada solicitação recebida.
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 xl:p-5">
                <strong className="block text-base xl:text-lg">
                  Métricas completas
                </strong>

                <span className="mt-2 block text-sm leading-6 text-gray-500">
                  Descubra campanhas e regiões.
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-600">
            © 2026 Comunidade Terapêutica Águias
            de Cristo
          </p>
        </div>

        {/* Área de login */}
        <div className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:min-h-0 lg:px-8 lg:py-10 xl:px-10">
          <div className="w-full max-w-md">
            {/* Logo mobile e tablet */}
            <div className="mb-6 text-center sm:mb-8 lg:hidden">
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

                <span className="mt-1 text-[11px] text-gray-500 sm:text-xs">
                  Lugar de Restauração
                </span>
              </a>

              <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs text-green-400 sm:px-4">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                Central administrativa
              </div>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-black/55 p-4 shadow-[0_25px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl min-[360px]:p-5 sm:rounded-[28px] sm:p-7 md:p-8 xl:p-9">
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-wide text-green-500 sm:text-sm">
                    ACESSO RESTRITO
                  </p>

                  <h2 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">
                    Entrar no painel
                  </h2>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/10 sm:h-12 sm:w-12 sm:rounded-2xl">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 text-green-500 sm:h-6 sm:w-6"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M12 14v3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-400">
                Use seu e-mail e senha administrativa
                para acessar os dados da captação.
              </p>

              <form
                onSubmit={entrar}
                className="mt-6 space-y-4 sm:mt-8 sm:space-y-5"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    E-mail
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    autoComplete="email"
                    placeholder="admin@aguiasdecristo.com.br"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    disabled={carregando}
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-sm placeholder:text-gray-600 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="senha"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Senha
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      id="senha"
                      name="senha"
                      type={
                        mostrarSenha
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      placeholder="Digite sua senha"
                      value={senha}
                      onChange={(event) =>
                        setSenha(event.target.value)
                      }
                      disabled={carregando}
                      className="min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 pr-24 text-base text-white outline-none transition placeholder:text-sm placeholder:text-gray-600 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setMostrarSenha(
                          (atual) => !atual
                        )
                      }
                      disabled={carregando}
                      className="absolute right-3 top-1/2 min-h-10 -translate-y-1/2 rounded-lg px-2 text-xs font-semibold text-gray-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50 sm:right-4 sm:text-sm"
                    >
                      {mostrarSenha
                        ? "Ocultar"
                        : "Mostrar"}
                    </button>
                  </div>
                </div>

                {erro && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="rounded-xl border border-red-500/25 bg-red-500/10 p-3.5 text-sm leading-6 text-red-300 sm:p-4"
                  >
                    {erro}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={carregando}
                  className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-green-600 px-4 py-3.5 text-sm font-black text-white shadow-[0_15px_45px_rgba(22,163,74,0.25)] transition hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:bg-green-800 sm:px-5 sm:py-4 sm:text-base"
                >
                  {carregando && (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}

                  {carregando
                    ? "Validando acesso..."
                    : "Entrar no painel"}
                </button>
              </form>

              <div className="mt-5 flex items-start gap-3 border-t border-white/10 pt-5 sm:mt-6 sm:pt-6">
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

                <p className="text-[11px] leading-5 text-gray-500 sm:text-xs">
                  Área protegida. Somente usuários
                  cadastrados e autorizados podem acessar
                  os dados.
                </p>
              </div>
            </div>

            <a
              href="/"
              className="mx-auto mt-5 block w-fit rounded-lg px-3 py-2 text-center text-sm text-gray-500 transition hover:bg-white/5 hover:text-green-500 sm:mt-6"
            >
              ← Voltar para a página principal
            </a>

            <p className="mt-4 text-center text-[10px] leading-4 text-gray-700 sm:text-xs lg:hidden">
              © 2026 Comunidade Terapêutica Águias de Cristo
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}