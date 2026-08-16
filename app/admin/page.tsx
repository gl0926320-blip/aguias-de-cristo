"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

/* =========================================================
   TIPOS
========================================================= */

type AdminProfile = {
  id: string;
  nome: string;
  email: string;
  nivel_acesso: "admin" | "atendente";
  ativo: boolean;
};

type LeadStatus =
  | "novo"
  | "em_atendimento"
  | "contato_realizado"
  | "internacao_agendada"
  | "convertido"
  | "sem_resposta"
  | "descartado";

type Lead = {
  id: string;
  nome: string;
  telefone: string;
  quem_precisa: string | null;
  situacao: string | null;
  mensagem: string | null;
  status: LeadStatus;
  observacoes: string | null;

  pagina_origem: string | null;
  referencia: string | null;

  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;

  dispositivo: string | null;
  navegador: string | null;
  sistema_operacional: string | null;

  pais: string | null;
  estado: string | null;
  cidade: string | null;

  created_at: string;
  updated_at: string;
};

type AnalyticsEvent = {
  id: number;
  event_name: string;
  visitor_id: string | null;
  session_id: string | null;
  page_path: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  dispositivo: string | null;
  pais: string | null;
  estado: string | null;
  cidade: string | null;
  created_at: string;
};

type AbaPainel =
  | "visao-geral"
  | "leads"
  | "campanhas"
  | "localizacao";

type Periodo = 7 | 15 | 30;

/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const STATUS_OPTIONS: Array<{
  value: LeadStatus;
  label: string;
}> = [
  {
    value: "novo",
    label: "Novo",
  },
  {
    value: "em_atendimento",
    label: "Em atendimento",
  },
  {
    value: "contato_realizado",
    label: "Contato realizado",
  },
  {
    value: "internacao_agendada",
    label: "Internação agendada",
  },
  {
    value: "convertido",
    label: "Convertido",
  },
  {
    value: "sem_resposta",
    label: "Sem resposta",
  },
  {
    value: "descartado",
    label: "Descartado",
  },
];

const MENU: Array<{
  id: AbaPainel;
  label: string;
  descricao: string;
  icon: string;
}> = [
  {
    id: "visao-geral",
    label: "Visão geral",
    descricao: "Resumo da captação",
    icon: "▦",
  },
  {
    id: "leads",
    label: "Leads",
    descricao: "Contatos recebidos",
    icon: "◎",
  },
  {
    id: "campanhas",
    label: "Campanhas",
    descricao: "Origens e anúncios",
    icon: "↗",
  },
  {
    id: "localizacao",
    label: "Localização",
    descricao: "Estados e cidades",
    icon: "⌖",
  },
];

/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function formatarTelefone(telefone: string) {
  const numeros = telefone.replace(/\D/g, "");

  if (numeros.length === 11) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(
      2,
      7
    )}-${numeros.slice(7)}`;
  }

  if (numeros.length === 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(
      2,
      6
    )}-${numeros.slice(6)}`;
  }

  return telefone;
}

function formatarData(data: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(data));
}

function formatarDataCurta(data: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(data);
}

function formatarNumero(numero: number) {
  return new Intl.NumberFormat("pt-BR").format(numero);
}

function obterInicioDoDia(data: Date) {
  const inicio = new Date(data);

  inicio.setHours(0, 0, 0, 0);

  return inicio;
}

function criarDataLocal(data: Date) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function obterStatusLabel(status: LeadStatus) {
  return (
    STATUS_OPTIONS.find((item) => item.value === status)
      ?.label || status
  );
}

function obterStatusClasses(status: LeadStatus) {
  switch (status) {
    case "novo":
      return "border-blue-500/25 bg-blue-500/10 text-blue-300";

    case "em_atendimento":
      return "border-amber-500/25 bg-amber-500/10 text-amber-300";

    case "contato_realizado":
      return "border-cyan-500/25 bg-cyan-500/10 text-cyan-300";

    case "internacao_agendada":
      return "border-purple-500/25 bg-purple-500/10 text-purple-300";

    case "convertido":
      return "border-green-500/25 bg-green-500/10 text-green-300";

    case "sem_resposta":
      return "border-orange-500/25 bg-orange-500/10 text-orange-300";

    case "descartado":
      return "border-red-500/25 bg-red-500/10 text-red-300";

    default:
      return "border-white/10 bg-white/5 text-gray-300";
  }
}

function obterIniciais(nome: string) {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("");
}

function gerarMensagemWhatsApp(lead: Lead) {
  const texto = [
    `Olá, ${lead.nome}.`,
    "",
    "Recebemos sua solicitação de atendimento pelo site da Comunidade Terapêutica Águias de Cristo.",
    "",
    lead.situacao
      ? `Situação informada: ${lead.situacao}.`
      : "",
    "",
    "Como podemos ajudar?",
  ]
    .filter(Boolean)
    .join("\n");

  return encodeURIComponent(texto);
}

/* =========================================================
   COMPONENTES MENORES
========================================================= */

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050706] px-5 text-white">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-white/10 border-t-green-500" />

        <div>
          <p className="font-semibold">
            Carregando painel
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Buscando os dados da captação...
          </p>
        </div>
      </div>
    </main>
  );
}

function MetricCard({
  titulo,
  valor,
  descricao,
  icone,
  destaque = false,
}: {
  titulo: string;
  valor: string;
  descricao: string;
  icone: string;
  destaque?: boolean;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-4 transition hover:-translate-y-0.5 sm:p-5 ${
        destaque
          ? "border-green-500/25 bg-gradient-to-br from-green-500/15 to-green-500/[0.03]"
          : "border-white/10 bg-[#0c0f0d]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-gray-500 sm:text-sm">
            {titulo}
          </p>

          <p className="mt-3 text-2xl font-black text-white sm:text-3xl">
            {valor}
          </p>

          <p className="mt-2 text-xs leading-5 text-gray-500">
            {descricao}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-lg sm:h-11 sm:w-11 ${
            destaque
              ? "border-green-500/30 bg-green-500/15 text-green-400"
              : "border-white/10 bg-white/[0.04] text-gray-400"
          }`}
        >
          {icone}
        </div>
      </div>

      {destaque && (
        <div className="pointer-events-none absolute -bottom-12 -right-12 h-28 w-28 rounded-full bg-green-500/10 blur-3xl" />
      )}
    </article>
  );
}

function EmptyState({
  titulo,
  descricao,
}: {
  titulo: string;
  descricao: string;
}) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-5 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl text-gray-500">
        ◌
      </div>

      <h3 className="mt-4 font-bold text-white">
        {titulo}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
        {descricao}
      </p>
    </div>
  );
}

/* =========================================================
   PÁGINA
========================================================= */

export default function AdminPage() {
  const router = useRouter();

  const [perfil, setPerfil] =
    useState<AdminProfile | null>(null);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [eventos, setEventos] =
    useState<AnalyticsEvent[]>([]);

  const [aba, setAba] =
    useState<AbaPainel>("visao-geral");

  const [periodo, setPeriodo] =
    useState<Periodo>(7);

  const [menuMobileAberto, setMenuMobileAberto] =
    useState(false);

  const [carregando, setCarregando] =
    useState(true);

  const [atualizando, setAtualizando] =
    useState(false);

  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] =
    useState<LeadStatus | "todos">("todos");

  const [leadSelecionado, setLeadSelecionado] =
    useState<Lead | null>(null);

  const [leadParaExcluir, setLeadParaExcluir] =
    useState<{
      id: string;
      nome: string;
    } | null>(null);

  const [excluindoLead, setExcluindoLead] =
    useState(false);

  const carregarDados = useCallback(
    async (mostrarCarregamento = false) => {
      if (mostrarCarregamento) {
        setAtualizando(true);
      }

      setErro("");

      try {
        const supabase =
          createSupabaseBrowserClient();

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace("/admin/login");
          return;
        }

        const {
          data: perfilEncontrado,
          error: perfilError,
        } = await supabase
          .from("admin_profiles")
          .select(
            "id, nome, email, nivel_acesso, ativo"
          )
          .eq("id", user.id)
          .maybeSingle();

        if (
          perfilError ||
          !perfilEncontrado ||
          !perfilEncontrado.ativo
        ) {
          await supabase.auth.signOut();

          router.replace("/admin/login");
          return;
        }

        setPerfil(
          perfilEncontrado as AdminProfile
        );

        const dataInicial = new Date();

        dataInicial.setDate(
          dataInicial.getDate() - 30
        );

        const [leadsResult, eventosResult] =
          await Promise.all([
            supabase
              .from("leads")
              .select(
                `
                  id,
                  nome,
                  telefone,
                  quem_precisa,
                  situacao,
                  mensagem,
                  status,
                  observacoes,
                  pagina_origem,
                  referencia,
                  utm_source,
                  utm_medium,
                  utm_campaign,
                  dispositivo,
                  navegador,
                  sistema_operacional,
                  pais,
                  estado,
                  cidade,
                  created_at,
                  updated_at
                `
              )
              .order("created_at", {
                ascending: false,
              })
              .limit(500),

            supabase
              .from("analytics_events")
              .select(
                `
                  id,
                  event_name,
                  visitor_id,
                  session_id,
                  page_path,
                  utm_source,
                  utm_medium,
                  utm_campaign,
                  dispositivo,
                  pais,
                  estado,
                  cidade,
                  created_at
                `
              )
              .gte(
                "created_at",
                dataInicial.toISOString()
              )
              .order("created_at", {
                ascending: false,
              })
              .limit(10000),
          ]);

        if (leadsResult.error) {
          throw new Error(
            leadsResult.error.message
          );
        }

        if (eventosResult.error) {
          throw new Error(
            eventosResult.error.message
          );
        }

        setLeads(
          (leadsResult.data || []) as Lead[]
        );

        setEventos(
          (eventosResult.data ||
            []) as AnalyticsEvent[]
        );
      } catch (error) {
        console.error(
          "Erro ao carregar painel:",
          error
        );

        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os dados."
        );
      } finally {
        setCarregando(false);
        setAtualizando(false);
      }
    },
    [router]
  );

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  useEffect(() => {
    const supabase =
      createSupabaseBrowserClient();

    const canal = supabase
      .channel("admin-dashboard")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
        },
        () => {
          carregarDados();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [carregarDados]);

  async function sair() {
    const supabase =
      createSupabaseBrowserClient();

    await supabase.auth.signOut();

    router.replace("/admin/login");
    router.refresh();
  }

  async function atualizarStatus(
    leadId: string,
    novoStatus: LeadStatus
  ) {
    const statusAnterior = leads.find(
      (lead) => lead.id === leadId
    )?.status;

    setErro("");

    setLeads((atuais) =>
      atuais.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              status: novoStatus,
              updated_at: new Date().toISOString(),
            }
          : lead
      )
    );

    if (leadSelecionado?.id === leadId) {
      setLeadSelecionado((atual) =>
        atual
          ? {
              ...atual,
              status: novoStatus,
            }
          : atual
      );
    }

    const supabase =
      createSupabaseBrowserClient();

    const { error } = await supabase
      .from("leads")
      .update({
        status: novoStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId);

    if (error) {
      console.error(
        "Erro ao atualizar lead:",
        error
      );

      if (statusAnterior) {
        setLeads((atuais) =>
          atuais.map((lead) =>
            lead.id === leadId
              ? {
                  ...lead,
                  status: statusAnterior,
                }
              : lead
          )
        );

        if (leadSelecionado?.id === leadId) {
          setLeadSelecionado((atual) =>
            atual
              ? {
                  ...atual,
                  status: statusAnterior,
                }
              : atual
          );
        }
      }

      setErro(
        `Não foi possível atualizar o status do lead: ${error.message}`
      );

      return;
    }
  }

  function excluirLead(
    leadId: string,
    nomeLead: string
  ) {
    setLeadParaExcluir({
      id: leadId,
      nome: nomeLead,
    });
  }

  async function confirmarExclusaoLead() {
    if (!leadParaExcluir || excluindoLead) {
      return;
    }

    setExcluindoLead(true);
    setErro("");

    const leadId = leadParaExcluir.id;

    const supabase =
      createSupabaseBrowserClient();

    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", leadId);

    if (error) {
      console.error(
        "Erro ao excluir lead:",
        error
      );

      setErro(
        `Não foi possível excluir o lead: ${error.message}`
      );

      setExcluindoLead(false);
      return;
    }

    setLeads((atuais) =>
      atuais.filter(
        (lead) => lead.id !== leadId
      )
    );

    if (leadSelecionado?.id === leadId) {
      setLeadSelecionado(null);
    }

    setLeadParaExcluir(null);
    setExcluindoLead(false);
  }

  const dadosPeriodo = useMemo(() => {
    const inicio = obterInicioDoDia(
      new Date()
    );

    inicio.setDate(
      inicio.getDate() - (periodo - 1)
    );

    const eventosFiltrados = eventos.filter(
      (evento) =>
        new Date(evento.created_at) >= inicio
    );

    const leadsFiltrados = leads.filter(
      (lead) =>
        new Date(lead.created_at) >= inicio
    );

    return {
      inicio,
      eventos: eventosFiltrados,
      leads: leadsFiltrados,
    };
  }, [eventos, leads, periodo]);

  const metricas = useMemo(() => {
    const visualizacoes =
      dadosPeriodo.eventos.filter(
        (evento) =>
          evento.event_name === "page_view"
      ).length;

    const visitantes = new Set(
      dadosPeriodo.eventos
        .filter(
          (evento) =>
            evento.event_name === "page_view"
        )
        .map(
          (evento) =>
            evento.visitor_id ||
            evento.session_id
        )
        .filter(Boolean)
    ).size;

    const formularios =
      dadosPeriodo.leads.length;

    const whatsapp =
      dadosPeriodo.eventos.filter(
        (evento) =>
          evento.event_name ===
          "whatsapp_click"
      ).length;

    const telefone =
      dadosPeriodo.eventos.filter(
        (evento) =>
          evento.event_name === "phone_click"
      ).length;

    const novos = dadosPeriodo.leads.filter(
      (lead) => lead.status === "novo"
    ).length;

    const convertidos =
      dadosPeriodo.leads.filter(
        (lead) => lead.status === "convertido"
      ).length;

    const conversao =
      visualizacoes > 0
        ? (formularios / visualizacoes) * 100
        : 0;

    return {
      visualizacoes,
      visitantes,
      formularios,
      whatsapp,
      telefone,
      novos,
      convertidos,
      conversao,
    };
  }, [dadosPeriodo]);

  const graficoDias = useMemo(() => {
    const dias: Array<{
      data: string;
      label: string;
      visitas: number;
      leads: number;
    }> = [];

    for (
      let indice = periodo - 1;
      indice >= 0;
      indice--
    ) {
      const data = new Date();

      data.setDate(data.getDate() - indice);

      const chave = criarDataLocal(data);

      const visitas = dadosPeriodo.eventos.filter(
        (evento) =>
          evento.event_name === "page_view" &&
          criarDataLocal(
            new Date(evento.created_at)
          ) === chave
      ).length;

      const leadsDoDia =
        dadosPeriodo.leads.filter(
          (lead) =>
            criarDataLocal(
              new Date(lead.created_at)
            ) === chave
        ).length;

      dias.push({
        data: chave,
        label: formatarDataCurta(data),
        visitas,
        leads: leadsDoDia,
      });
    }

    return dias;
  }, [dadosPeriodo, periodo]);

  const maiorValorGrafico = useMemo(() => {
    return Math.max(
      1,
      ...graficoDias.map((dia) =>
        Math.max(dia.visitas, dia.leads)
      )
    );
  }, [graficoDias]);

  const leadsFiltrados = useMemo(() => {
    const termo = busca
      .trim()
      .toLowerCase();

    return leads.filter((lead) => {
      const correspondeStatus =
        filtroStatus === "todos" ||
        lead.status === filtroStatus;

      if (!correspondeStatus) {
        return false;
      }

      if (!termo) {
        return true;
      }

      return [
        lead.nome,
        lead.telefone,
        lead.situacao,
        lead.quem_precisa,
        lead.cidade,
        lead.estado,
      ]
        .filter(Boolean)
        .some((valor) =>
          String(valor)
            .toLowerCase()
            .includes(termo)
        );
    });
  }, [busca, filtroStatus, leads]);

  const campanhas = useMemo(() => {
    const agrupado = new Map<
      string,
      {
        nome: string;
        visitas: number;
        leads: number;
      }
    >();

    dadosPeriodo.eventos
      .filter(
        (evento) =>
          evento.event_name === "page_view"
      )
      .forEach((evento) => {
        const nome =
          evento.utm_campaign ||
          evento.utm_source ||
          "Acesso direto";

        const atual = agrupado.get(nome) || {
          nome,
          visitas: 0,
          leads: 0,
        };

        atual.visitas += 1;

        agrupado.set(nome, atual);
      });

    dadosPeriodo.leads.forEach((lead) => {
      const nome =
        lead.utm_campaign ||
        lead.utm_source ||
        "Acesso direto";

      const atual = agrupado.get(nome) || {
        nome,
        visitas: 0,
        leads: 0,
      };

      atual.leads += 1;

      agrupado.set(nome, atual);
    });

    return Array.from(agrupado.values())
      .map((item) => ({
        ...item,
        conversao:
          item.visitas > 0
            ? (item.leads / item.visitas) * 100
            : 0,
      }))
      .sort((a, b) => {
        if (b.leads !== a.leads) {
          return b.leads - a.leads;
        }

        return b.visitas - a.visitas;
      });
  }, [dadosPeriodo]);

  const localizacoes = useMemo(() => {
    const agrupado = new Map<
      string,
      {
        local: string;
        estado: string;
        cidade: string;
        visitas: number;
        leads: number;
      }
    >();

    dadosPeriodo.eventos
      .filter(
        (evento) =>
          evento.event_name === "page_view"
      )
      .forEach((evento) => {
        const cidade =
          evento.cidade || "Cidade não identificada";

        const estado =
          evento.estado || "Estado não identificado";

        const chave = `${cidade}-${estado}`;

        const atual = agrupado.get(chave) || {
          local: `${cidade} - ${estado}`,
          cidade,
          estado,
          visitas: 0,
          leads: 0,
        };

        atual.visitas += 1;

        agrupado.set(chave, atual);
      });

    dadosPeriodo.leads.forEach((lead) => {
      const cidade =
        lead.cidade || "Cidade não identificada";

      const estado =
        lead.estado || "Estado não identificado";

      const chave = `${cidade}-${estado}`;

      const atual = agrupado.get(chave) || {
        local: `${cidade} - ${estado}`,
        cidade,
        estado,
        visitas: 0,
        leads: 0,
      };

      atual.leads += 1;

      agrupado.set(chave, atual);
    });

    return Array.from(agrupado.values()).sort(
      (a, b) => {
        if (b.leads !== a.leads) {
          return b.leads - a.leads;
        }

        return b.visitas - a.visitas;
      }
    );
  }, [dadosPeriodo]);

  const dispositivos = useMemo(() => {
    const agrupado = new Map<string, number>();

    dadosPeriodo.eventos
      .filter(
        (evento) =>
          evento.event_name === "page_view"
      )
      .forEach((evento) => {
        const dispositivo =
          evento.dispositivo ||
          "Não identificado";

        agrupado.set(
          dispositivo,
          (agrupado.get(dispositivo) || 0) + 1
        );
      });

    const total = Array.from(
      agrupado.values()
    ).reduce(
      (acumulador, valor) =>
        acumulador + valor,
      0
    );

    return Array.from(agrupado.entries())
      .map(([nome, quantidade]) => ({
        nome,
        quantidade,
        percentual:
          total > 0
            ? (quantidade / total) * 100
            : 0,
      }))
      .sort(
        (a, b) =>
          b.quantidade - a.quantidade
      );
  }, [dadosPeriodo]);

  if (carregando) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen bg-[#060806] text-white">
      {/* OVERLAY MENU MOBILE */}
      {menuMobileAberto && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() =>
            setMenuMobileAberto(false)
          }
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[285px] max-w-[86vw] flex-col border-r border-white/10 bg-[#080b09] transition-transform duration-300 lg:w-[270px] ${
          menuMobileAberto
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <a
            href="/"
            className="min-w-0"
          >
            <p className="truncate text-lg font-black tracking-wide">
              ÁGUIAS
              <span className="text-green-500">
                {" "}
                DE CRISTO
              </span>
            </p>

            <p className="mt-0.5 text-[11px] text-gray-500">
              Central administrativa
            </p>
          </a>

          <button
            type="button"
            onClick={() =>
              setMenuMobileAberto(false)
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white lg:hidden"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-600">
            Gestão da captação
          </p>

          <div className="mt-3 space-y-1">
            {MENU.map((item) => {
              const ativo = aba === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setAba(item.id);
                    setMenuMobileAberto(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                    ativo
                      ? "border-green-500/20 bg-green-500/10 text-white"
                      : "border-transparent text-gray-400 hover:border-white/5 hover:bg-white/[0.03] hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                      ativo
                        ? "bg-green-500/15 text-green-400"
                        : "bg-white/[0.04] text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {item.label}
                    </span>

                    <span className="mt-0.5 block truncate text-[11px] text-gray-600">
                      {item.descricao}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/15 text-sm font-black text-green-400">
                {obterIniciais(
                  perfil?.nome || "Administrador"
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {perfil?.nome}
                </p>

                <p className="truncate text-[11px] text-gray-600">
                  {perfil?.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={sair}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-xs font-semibold text-gray-400 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-300"
            >
              Sair do painel
            </button>
          </div>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <div className="min-h-screen lg:pl-[270px]">
        {/* HEADER */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#060806]/90 backdrop-blur-xl">
          <div className="flex min-h-20 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setMenuMobileAberto(true)
                }
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-xl text-gray-300 lg:hidden"
                aria-label="Abrir menu"
              >
                ☰
              </button>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-black sm:text-xl">
                  {
                    MENU.find(
                      (item) => item.id === aba
                    )?.label
                  }
                </h1>

                <p className="hidden truncate text-xs text-gray-600 sm:block">
                  Acompanhe os resultados da landing page
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <select
                aria-label="Selecionar período"
                value={periodo}
                onChange={(event) =>
                  setPeriodo(
                    Number(
                      event.target.value
                    ) as Periodo
                  )
                }
                className="h-11 rounded-xl border border-white/10 bg-[#0c0f0d] px-3 text-xs text-gray-300 outline-none focus:border-green-500 sm:text-sm"
              >
                <option value={7}>
                  7 dias
                </option>

                <option value={15}>
                  15 dias
                </option>

                <option value={30}>
                  30 dias
                </option>
              </select>

              <button
                type="button"
                onClick={() =>
                  carregarDados(true)
                }
                disabled={atualizando}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-xs font-semibold text-gray-300 transition hover:border-green-500/20 hover:bg-green-500/10 hover:text-green-300 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm"
              >
                <span
                  className={
                    atualizando
                      ? "animate-spin"
                      : ""
                  }
                >
                  ↻
                </span>

                <span className="hidden sm:inline">
                  {atualizando
                    ? "Atualizando"
                    : "Atualizar"}
                </span>
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {erro && (
            <div className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              <p>{erro}</p>

              <button
                type="button"
                onClick={() => setErro("")}
                className="shrink-0 text-lg"
              >
                ×
              </button>
            </div>
          )}

          {/* VISÃO GERAL */}
          {aba === "visao-geral" && (
            <div className="space-y-5 sm:space-y-6">
              <section className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-[#0d130f] to-[#090c0a] p-5 sm:flex-row sm:items-center sm:p-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-green-500">
                    Central de resultados
                  </p>

                  <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                    Olá, {perfil?.nome}
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                    Veja o desempenho da captação, acompanhe
                    novos contatos e identifique quais campanhas
                    estão gerando mais oportunidades.
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />

                  <div>
                    <p className="text-sm font-bold text-green-300">
                      Sistema ativo
                    </p>

                    <p className="text-[11px] text-green-500/70">
                      Captando contatos
                    </p>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-8">
                <MetricCard
                  titulo="Visualizações"
                  valor={formatarNumero(
                    metricas.visualizacoes
                  )}
                  descricao={`Nos últimos ${periodo} dias`}
                  icone="◉"
                  destaque
                />

                <MetricCard
                  titulo="Visitantes"
                  valor={formatarNumero(
                    metricas.visitantes
                  )}
                  descricao="Pessoas identificadas"
                  icone="♙"
                />

                <MetricCard
                  titulo="Leads"
                  valor={formatarNumero(
                    metricas.formularios
                  )}
                  descricao="Formulários recebidos"
                  icone="◎"
                  destaque
                />

                <MetricCard
                  titulo="Conversão"
                  valor={`${metricas.conversao.toFixed(
                    1
                  )}%`}
                  descricao="Visitas que viraram lead"
                  icone="↗"
                />

                <MetricCard
                  titulo="WhatsApp"
                  valor={formatarNumero(
                    metricas.whatsapp
                  )}
                  descricao="Cliques registrados"
                  icone="◍"
                />

                <MetricCard
                  titulo="Ligações"
                  valor={formatarNumero(
                    metricas.telefone
                  )}
                  descricao="Cliques no telefone"
                  icone="☎"
                />

                <MetricCard
                  titulo="Novos"
                  valor={formatarNumero(
                    metricas.novos
                  )}
                  descricao="Aguardando atendimento"
                  icone="●"
                />

                <MetricCard
                  titulo="Convertidos"
                  valor={formatarNumero(
                    metricas.convertidos
                  )}
                  descricao="Marcados como convertidos"
                  icone="✓"
                />
              </section>

              <section className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.7fr)]">
                {/* GRÁFICO */}
                <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d0b]">
                  <div className="flex flex-col justify-between gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-black">
                        Desempenho da captação
                      </h3>

                      <p className="mt-1 text-xs text-gray-600">
                        Visitas e formulários por dia
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                        Visitas
                      </div>

                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                        Leads
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto p-4 sm:p-6">
                    <div
                      className={`flex h-64 items-end gap-2 ${
                        periodo > 15
                          ? "min-w-[900px]"
                          : periodo > 7
                          ? "min-w-[650px]"
                          : "min-w-[500px]"
                      }`}
                    >
                      {graficoDias.map((dia) => {
                        const alturaVisitas =
                          (dia.visitas /
                            maiorValorGrafico) *
                          100;

                        const alturaLeads =
                          (dia.leads /
                            maiorValorGrafico) *
                          100;

                        return (
                          <div
                            key={dia.data}
                            className="flex h-full min-w-0 flex-1 flex-col justify-end"
                          >
                            <div className="group relative flex h-[210px] items-end justify-center gap-1">
                              <div
                                title={`${dia.visitas} visitas`}
                                className="min-h-[3px] w-2.5 rounded-t-md bg-green-500 transition hover:bg-green-400 sm:w-3"
                                style={{
                                  height: `${Math.max(
                                    alturaVisitas,
                                    dia.visitas > 0
                                      ? 3
                                      : 0
                                  )}%`,
                                }}
                              />

                              <div
                                title={`${dia.leads} leads`}
                                className="min-h-[3px] w-2.5 rounded-t-md bg-blue-500 transition hover:bg-blue-400 sm:w-3"
                                style={{
                                  height: `${Math.max(
                                    alturaLeads,
                                    dia.leads > 0
                                      ? 3
                                      : 0
                                  )}%`,
                                }}
                              />

                              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-[#121713] px-3 py-2 text-[10px] shadow-xl group-hover:block">
                                <p className="font-semibold">
                                  {dia.label}
                                </p>

                                <p className="mt-1 text-green-400">
                                  {dia.visitas} visitas
                                </p>

                                <p className="text-blue-400">
                                  {dia.leads} leads
                                </p>
                              </div>
                            </div>

                            <p className="mt-3 truncate text-center text-[9px] text-gray-600 sm:text-[10px]">
                              {dia.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </article>

                {/* DISPOSITIVOS */}
                <article className="rounded-2xl border border-white/10 bg-[#0a0d0b]">
                  <div className="border-b border-white/10 p-5">
                    <h3 className="font-black">
                      Dispositivos
                    </h3>

                    <p className="mt-1 text-xs text-gray-600">
                      Como as pessoas acessam
                    </p>
                  </div>

                  <div className="space-y-5 p-5">
                    {dispositivos.length === 0 ? (
                      <EmptyState
                        titulo="Sem dados"
                        descricao="Os dispositivos aparecerão depois que as visitas forem rastreadas."
                      />
                    ) : (
                      dispositivos.map(
                        (dispositivo) => (
                          <div
                            key={dispositivo.nome}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold">
                                {dispositivo.nome}
                              </p>

                              <p className="text-xs text-gray-500">
                                {dispositivo.quantidade}{" "}
                                ·{" "}
                                {dispositivo.percentual.toFixed(
                                  1
                                )}
                                %
                              </p>
                            </div>

                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
                              <div
                                className="h-full rounded-full bg-green-500"
                                style={{
                                  width: `${dispositivo.percentual}%`,
                                }}
                              />
                            </div>
                          </div>
                        )
                      )
                    )}
                  </div>
                </article>
              </section>

              {/* LEADS RECENTES */}
              <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d0b]">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 p-5">
                  <div>
                    <h3 className="font-black">
                      Leads mais recentes
                    </h3>

                    <p className="mt-1 text-xs text-gray-600">
                      Últimas solicitações recebidas
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAba("leads")}
                    className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-gray-400 transition hover:border-green-500/20 hover:bg-green-500/10 hover:text-green-300"
                  >
                    Ver todos
                  </button>
                </div>

                <div className="divide-y divide-white/5">
                  {leads.slice(0, 6).length === 0 ? (
                    <div className="p-5">
                      <EmptyState
                        titulo="Nenhum lead recebido"
                        descricao="As solicitações enviadas pelo formulário aparecerão aqui."
                      />
                    </div>
                  ) : (
                    leads
                      .slice(0, 6)
                      .map((lead) => (
                        <button
                          key={lead.id}
                          type="button"
                          onClick={() =>
                            setLeadSelecionado(lead)
                          }
                          className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-white/[0.025] sm:px-5"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-sm font-black text-green-400">
                            {obterIniciais(
                              lead.nome
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                              <p className="truncate text-sm font-bold">
                                {lead.nome}
                              </p>

                              <p className="text-[10px] text-gray-600 sm:text-xs">
                                {formatarData(
                                  lead.created_at
                                )}
                              </p>
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                              <p className="text-xs text-gray-500">
                                {formatarTelefone(
                                  lead.telefone
                                )}
                              </p>

                              {lead.situacao && (
                                <p className="truncate text-xs text-gray-600">
                                  {lead.situacao}
                                </p>
                              )}
                            </div>
                          </div>

                          <span
                            className={`hidden shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold sm:inline-flex ${obterStatusClasses(
                              lead.status
                            )}`}
                          >
                            {obterStatusLabel(
                              lead.status
                            )}
                          </span>
                        </button>
                      ))
                  )}
                </div>
              </article>
            </div>
          )}

          {/* LEADS */}
          {aba === "leads" && (
            <div className="space-y-5">
              <section className="rounded-2xl border border-white/10 bg-[#0a0d0b] p-4 sm:p-5">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <h2 className="text-xl font-black">
                      Contatos recebidos
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                      {leadsFiltrados.length} lead(s)
                      encontrado(s)
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="search"
                      value={busca}
                      onChange={(event) =>
                        setBusca(
                          event.target.value
                        )
                      }
                      placeholder="Buscar nome, telefone ou cidade..."
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm outline-none placeholder:text-gray-700 focus:border-green-500 sm:w-72"
                    />

                    <select
                      value={filtroStatus}
                      onChange={(event) =>
                        setFiltroStatus(
                          event.target.value as
                            | LeadStatus
                            | "todos"
                        )
                      }
                      className="h-11 rounded-xl border border-white/10 bg-[#101411] px-3 text-sm text-gray-300 outline-none focus:border-green-500"
                    >
                      <option value="todos">
                        Todos os status
                      </option>

                      {STATUS_OPTIONS.map(
                        (status) => (
                          <option
                            key={status.value}
                            value={status.value}
                          >
                            {status.label}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </section>

              {/* DESKTOP */}
              <section className="hidden overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d0b] md:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px]">
                    <thead className="border-b border-white/10 bg-white/[0.02]">
                      <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-gray-600">
                        <th className="px-5 py-4">
                          Lead
                        </th>

                        <th className="px-5 py-4">
                          Situação
                        </th>

                        <th className="px-5 py-4">
                          Origem
                        </th>

                        <th className="px-5 py-4">
                          Localização
                        </th>

                        <th className="px-5 py-4">
                          Recebido
                        </th>

                        <th className="px-5 py-4">
                          Status
                        </th>

                        <th className="px-5 py-4 text-right">
                          Ações
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/5">
                      {leadsFiltrados.map(
                        (lead) => (
                          <tr
                            key={lead.id}
                            className="transition hover:bg-white/[0.02]"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-xs font-black text-green-400">
                                  {obterIniciais(
                                    lead.nome
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <p className="max-w-48 truncate text-sm font-bold">
                                    {lead.nome}
                                  </p>

                                  <p className="mt-1 text-xs text-gray-600">
                                    {formatarTelefone(
                                      lead.telefone
                                    )}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <p className="max-w-48 truncate text-sm text-gray-300">
                                {lead.situacao ||
                                  "Não informado"}
                              </p>

                              <p className="mt-1 max-w-48 truncate text-xs text-gray-600">
                                {lead.quem_precisa ||
                                  "Não informado"}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="max-w-40 truncate text-sm text-gray-300">
                                {lead.utm_campaign ||
                                  lead.utm_source ||
                                  "Acesso direto"}
                              </p>

                              <p className="mt-1 text-xs text-gray-600">
                                {lead.utm_medium ||
                                  "Sem mídia"}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="max-w-40 truncate text-sm text-gray-300">
                                {lead.cidade ||
                                  "Não identificada"}
                              </p>

                              <p className="mt-1 text-xs text-gray-600">
                                {lead.estado ||
                                  lead.pais ||
                                  "Local não identificado"}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-xs text-gray-400">
                                {formatarData(
                                  lead.created_at
                                )}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <select
                                value={lead.status}
                                onChange={(event) =>
                                  atualizarStatus(
                                    lead.id,
                                    event.target
                                      .value as LeadStatus
                                  )
                                }
                                className={`rounded-lg border px-2.5 py-2 text-xs font-semibold outline-none ${obterStatusClasses(
                                  lead.status
                                )}`}
                              >
                                {STATUS_OPTIONS.map(
                                  (status) => (
                                    <option
                                      key={
                                        status.value
                                      }
                                      value={
                                        status.value
                                      }
                                      className="bg-[#121713] text-white"
                                    >
                                      {status.label}
                                    </option>
                                  )
                                )}
                              </select>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <a
                                  href={`https://wa.me/55${lead.telefone.replace(
                                    /\D/g,
                                    ""
                                  )}?text=${gerarMensagemWhatsApp(
                                    lead
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs font-semibold text-green-300 transition hover:bg-green-500/20"
                                >
                                  WhatsApp
                                </a>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setLeadSelecionado(
                                      lead
                                    )
                                  }
                                  className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-gray-400 transition hover:bg-white/5 hover:text-white"
                                >
                                  Ver
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    excluirLead(
                                      lead.id,
                                      lead.nome
                                    )
                                  }
                                  className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-200"
                                >
                                  Excluir
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {leadsFiltrados.length === 0 && (
                  <div className="p-5">
                    <EmptyState
                      titulo="Nenhum lead encontrado"
                      descricao="Tente mudar os filtros ou o texto da pesquisa."
                    />
                  </div>
                )}
              </section>

              {/* MOBILE */}
              <section className="space-y-3 md:hidden">
                {leadsFiltrados.map((lead) => (
                  <article
                    key={lead.id}
                    className="rounded-2xl border border-white/10 bg-[#0a0d0b] p-4"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setLeadSelecionado(lead)
                      }
                      className="flex w-full items-start gap-3 text-left"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-sm font-black text-green-400">
                        {obterIniciais(lead.nome)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold">
                          {lead.nome}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {formatarTelefone(
                            lead.telefone
                          )}
                        </p>

                        <p className="mt-1 truncate text-xs text-gray-600">
                          {lead.situacao ||
                            "Situação não informada"}
                        </p>
                      </div>
                    </button>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/5 pt-4 text-xs">
                      <div>
                        <p className="text-gray-700">
                          Origem
                        </p>

                        <p className="mt-1 truncate text-gray-400">
                          {lead.utm_campaign ||
                            lead.utm_source ||
                            "Acesso direto"}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-700">
                          Localização
                        </p>

                        <p className="mt-1 truncate text-gray-400">
                          {lead.cidade ||
                            lead.estado ||
                            "Não identificada"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3">
                      <select
                        value={lead.status}
                        onChange={(event) =>
                          atualizarStatus(
                            lead.id,
                            event.target
                              .value as LeadStatus
                          )
                        }
                        className={`h-11 min-w-0 flex-1 rounded-xl border px-3 text-xs font-semibold outline-none ${obterStatusClasses(
                          lead.status
                        )}`}
                      >
                        {STATUS_OPTIONS.map(
                          (status) => (
                            <option
                              key={status.value}
                              value={status.value}
                              className="bg-[#121713] text-white"
                            >
                              {status.label}
                            </option>
                          )
                        )}
                      </select>

                      <div className="grid grid-cols-2 gap-3">
                        <a
                          href={`https://wa.me/55${lead.telefone.replace(
                            /\D/g,
                            ""
                          )}?text=${gerarMensagemWhatsApp(
                            lead
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-11 items-center justify-center rounded-xl bg-green-600 px-3 text-center text-xs font-black transition hover:bg-green-500"
                        >
                          WhatsApp
                        </a>

                        <button
                          type="button"
                          onClick={() =>
                            excluirLead(
                              lead.id,
                              lead.nome
                            )
                          }
                          className="flex h-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-xs font-bold text-red-300 transition hover:bg-red-500/20"
                        >
                          Excluir lead
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

                {leadsFiltrados.length === 0 && (
                  <EmptyState
                    titulo="Nenhum lead encontrado"
                    descricao="Tente mudar os filtros ou o texto da pesquisa."
                  />
                )}
              </section>
            </div>
          )}

          {/* CAMPANHAS */}
          {aba === "campanhas" && (
            <div className="space-y-5">
              <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  titulo="Campanhas"
                  valor={formatarNumero(
                    campanhas.length
                  )}
                  descricao="Origens identificadas"
                  icone="↗"
                />

                <MetricCard
                  titulo="Visitas"
                  valor={formatarNumero(
                    metricas.visualizacoes
                  )}
                  descricao={`Nos últimos ${periodo} dias`}
                  icone="◉"
                  destaque
                />

                <MetricCard
                  titulo="Leads"
                  valor={formatarNumero(
                    metricas.formularios
                  )}
                  descricao="Contatos gerados"
                  icone="◎"
                />

                <MetricCard
                  titulo="Conversão geral"
                  valor={`${metricas.conversao.toFixed(
                    1
                  )}%`}
                  descricao="Desempenho da página"
                  icone="✓"
                />
              </section>

              <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d0b]">
                <div className="border-b border-white/10 p-5">
                  <h2 className="font-black">
                    Desempenho por campanha
                  </h2>

                  <p className="mt-1 text-xs text-gray-600">
                    UTMs e origens identificadas nos acessos
                  </p>
                </div>

                {campanhas.length === 0 ? (
                  <div className="p-5">
                    <EmptyState
                      titulo="Nenhuma campanha identificada"
                      descricao="Adicione parâmetros UTM aos anúncios para identificar cada campanha."
                    />
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {campanhas.map(
                      (campanha, indice) => (
                        <div
                          key={campanha.nome}
                          className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_100px_100px_110px] sm:items-center sm:px-5"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm font-black text-gray-500">
                            {indice + 1}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold">
                              {campanha.nome}
                            </p>

                            <p className="mt-1 text-xs text-gray-600">
                              Campanha ou origem
                            </p>
                          </div>

                          <div className="col-start-2 flex items-center justify-between text-xs sm:col-start-auto sm:block">
                            <span className="text-gray-600 sm:block">
                              Visitas
                            </span>

                            <strong className="sm:mt-1 sm:block sm:text-sm">
                              {campanha.visitas}
                            </strong>
                          </div>

                          <div className="col-start-2 flex items-center justify-between text-xs sm:col-start-auto sm:block">
                            <span className="text-gray-600 sm:block">
                              Leads
                            </span>

                            <strong className="text-green-400 sm:mt-1 sm:block sm:text-sm">
                              {campanha.leads}
                            </strong>
                          </div>

                          <div className="col-start-2 flex items-center justify-between text-xs sm:col-start-auto sm:block">
                            <span className="text-gray-600 sm:block">
                              Conversão
                            </span>

                            <strong className="sm:mt-1 sm:block sm:text-sm">
                              {campanha.conversao.toFixed(
                                1
                              )}
                              %
                            </strong>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* LOCALIZAÇÃO */}
          {aba === "localizacao" && (
            <div className="space-y-5">
              <section className="rounded-2xl border border-white/10 bg-[#0a0d0b] p-5">
                <h2 className="text-xl font-black">
                  Origem geográfica
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  A localização é aproximada e depende dos
                  cabeçalhos enviados pela plataforma de
                  hospedagem. Em ambiente local ela pode aparecer
                  como não identificada.
                </p>
              </section>

              <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d0b]">
                <div className="grid grid-cols-3 border-b border-white/10 bg-white/[0.02] px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-600 sm:px-5">
                  <span>Localização</span>
                  <span className="text-center">
                    Visitas
                  </span>
                  <span className="text-right">
                    Leads
                  </span>
                </div>

                {localizacoes.length === 0 ? (
                  <div className="p-5">
                    <EmptyState
                      titulo="Nenhuma localização identificada"
                      descricao="Os dados aparecerão depois que visitantes reais acessarem a página publicada."
                    />
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {localizacoes.map(
                      (localizacao) => (
                        <div
                          key={localizacao.local}
                          className="grid grid-cols-3 items-center px-4 py-4 sm:px-5"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold">
                              {localizacao.cidade}
                            </p>

                            <p className="mt-1 truncate text-xs text-gray-600">
                              {localizacao.estado}
                            </p>
                          </div>

                          <p className="text-center text-sm text-gray-300">
                            {formatarNumero(
                              localizacao.visitas
                            )}
                          </p>

                          <p className="text-right text-sm font-bold text-green-400">
                            {formatarNumero(
                              localizacao.leads
                            )}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DO LEAD */}
      {leadSelecionado && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <button
            type="button"
            aria-label="Fechar detalhes"
            onClick={() =>
              setLeadSelecionado(null)
            }
            className="absolute inset-0"
          />

          <section className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-[26px] border border-white/10 bg-[#0b0f0c] shadow-2xl sm:max-w-2xl sm:rounded-[26px]">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-[#0b0f0c]/95 px-5 py-4 backdrop-blur-xl">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-green-500">
                  Detalhes do lead
                </p>

                <h2 className="mt-1 truncate text-xl font-black">
                  {leadSelecionado.nome}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setLeadSelecionado(null)
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-xl text-gray-400 hover:bg-white/5 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-xs text-gray-600">
                    Telefone
                  </p>

                  <p className="mt-2 font-bold">
                    {formatarTelefone(
                      leadSelecionado.telefone
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-xs text-gray-600">
                    Recebido em
                  </p>

                  <p className="mt-2 font-bold">
                    {formatarData(
                      leadSelecionado.created_at
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-xs text-gray-600">
                    Quem precisa de ajuda
                  </p>

                  <p className="mt-2 font-bold">
                    {leadSelecionado.quem_precisa ||
                      "Não informado"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-xs text-gray-600">
                    Situação
                  </p>

                  <p className="mt-2 font-bold">
                    {leadSelecionado.situacao ||
                      "Não informada"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-xs text-gray-600">
                    Origem
                  </p>

                  <p className="mt-2 font-bold">
                    {leadSelecionado.utm_campaign ||
                      leadSelecionado.utm_source ||
                      "Acesso direto"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-xs text-gray-600">
                    Localização aproximada
                  </p>

                  <p className="mt-2 font-bold">
                    {[
                      leadSelecionado.cidade,
                      leadSelecionado.estado,
                    ]
                      .filter(Boolean)
                      .join(" - ") ||
                      "Não identificada"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                <p className="text-xs text-gray-600">
                  Mensagem enviada
                </p>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-300">
                  {leadSelecionado.mensagem ||
                    "Nenhuma mensagem foi adicionada."}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Status do atendimento
                </label>

                <select
                  value={leadSelecionado.status}
                  onChange={(event) =>
                    atualizarStatus(
                      leadSelecionado.id,
                      event.target
                        .value as LeadStatus
                    )
                  }
                  className={`h-12 w-full rounded-xl border px-4 text-sm font-semibold outline-none ${obterStatusClasses(
                    leadSelecionado.status
                  )}`}
                >
                  {STATUS_OPTIONS.map(
                    (status) => (
                      <option
                        key={status.value}
                        value={status.value}
                        className="bg-[#121713] text-white"
                      >
                        {status.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a
                  href={`https://wa.me/55${leadSelecionado.telefone.replace(
                    /\D/g,
                    ""
                  )}?text=${gerarMensagemWhatsApp(
                    leadSelecionado
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center justify-center rounded-xl bg-green-600 px-4 text-center text-sm font-black transition hover:bg-green-500"
                >
                  Chamar no WhatsApp
                </a>

                <a
                  href={`tel:${leadSelecionado.telefone.replace(
                    /\D/g,
                    ""
                  )}`}
                  className="flex min-h-12 items-center justify-center rounded-xl border border-white/10 px-4 text-center text-sm font-bold text-gray-300 transition hover:border-green-500/20 hover:bg-green-500/10 hover:text-green-300"
                >
                  Fazer ligação
                </a>

                <button
                  type="button"
                  onClick={() =>
                    excluirLead(
                      leadSelecionado.id,
                      leadSelecionado.nome
                    )
                  }
                  className="flex min-h-12 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/10 px-4 text-center text-sm font-bold text-red-300 transition hover:border-red-500/40 hover:bg-red-500/20"
                >
                  Excluir este lead
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setLeadSelecionado(null)
                  }
                  className="flex min-h-12 items-center justify-center rounded-xl border border-white/10 px-4 text-center text-sm font-bold text-gray-400 transition hover:bg-white/5 hover:text-white"
                >
                  Fechar
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {leadParaExcluir && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !excluindoLead
            ) {
              setLeadParaExcluir(null);
            }
          }}
        >
          <div className="relative w-full max-w-[440px] overflow-hidden rounded-3xl border border-white/10 bg-[#0b0e0c] shadow-2xl shadow-black/60">
            
            {/* brilho superior */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-red-500/10 to-transparent" />

            <div className="relative p-6 sm:p-7">
              
              {/* ícone + fechar */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-7 w-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 7h12M10 11v6M14 11v6M9 7V4h6v3M8 7l1 13h6l1-13"
                    />
                  </svg>
                </div>

                <button
                  type="button"
                  disabled={excluindoLead}
                  onClick={() =>
                    setLeadParaExcluir(null)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-lg text-gray-500 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Fechar"
                >
                  ×
                </button>
              </div>

              {/* conteúdo */}
              <div className="mt-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-red-400">
                  Excluir lead
                </p>

                <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
                  Tem certeza que deseja excluir?
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Você está prestes a excluir permanentemente o
                  contato abaixo.
                </p>
              </div>

              {/* lead */}
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-sm font-black text-red-300">
                  {obterIniciais(
                    leadParaExcluir.nome
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] text-gray-600">
                    Lead selecionado
                  </p>

                  <p className="mt-0.5 truncate font-bold text-white">
                    {leadParaExcluir.nome}
                  </p>
                </div>
              </div>

              {/* aviso */}
              <div className="mt-4 flex gap-3 rounded-2xl border border-red-500/10 bg-red-500/[0.05] p-4">
                <div className="mt-0.5 shrink-0 text-red-400">
                  ⚠
                </div>

                <p className="text-xs leading-5 text-red-200/70">
                  Essa ação é definitiva. Depois de excluir,
                  os dados deste lead não poderão ser
                  recuperados pelo painel.
                </p>
              </div>

              {/* botões */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={excluindoLead}
                  onClick={() =>
                    setLeadParaExcluir(null)
                  }
                  className="order-2 flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] px-4 text-sm font-bold text-gray-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:order-1"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={excluindoLead}
                  onClick={
                    confirmarExclusaoLead
                  }
                  className="order-1 flex h-12 items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-600 px-4 text-sm font-black text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60 sm:order-2"
                >
                  {excluindoLead ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Excluindo...
                    </>
                  ) : (
                    <>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 7h12M10 11v6M14 11v6M9 7V4h6v3M8 7l1 13h6l1-13"
                        />
                      </svg>

                      Excluir permanentemente
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}