"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type FormState = {
  nome: string;
  telefone: string;
  quemPrecisa: string;
  situacao: string;
  mensagem: string;
};

const initialForm: FormState = {
  nome: "",
  telefone: "",
  quemPrecisa: "",
  situacao: "",
  mensagem: "",
};

function formatPhone(value: string) {
  const numbers = value.replace(/\D/g, "").slice(0, 11);

  if (numbers.length <= 2) {
    return numbers;
  }

  if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }

  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(
      2,
      6
    )}-${numbers.slice(6)}`;
  }

  return `(${numbers.slice(0, 2)}) ${numbers.slice(
    2,
    7
  )}-${numbers.slice(7)}`;
}

function generateId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 12)}`;
}

function getStoredId(key: string, prefix: string) {
  const current = localStorage.getItem(key);

  if (current) {
    return current;
  }

  const generated = generateId(prefix);

  localStorage.setItem(key, generated);

  return generated;
}

export default function LeadForm() {
  const router = useRouter();

  const [form, setForm] =
    useState<FormState>(initialForm);

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [visitorId, setVisitorId] =
    useState("");

  const [sessionId, setSessionId] =
    useState("");

  const [formStarted, setFormStarted] =
    useState(false);

  useEffect(() => {
    setVisitorId(
      getStoredId(
        "aguias_visitor_id",
        "visitor"
      )
    );

    const sessionKey =
      "aguias_session_id";

    const existingSession =
      sessionStorage.getItem(sessionKey);

    if (existingSession) {
      setSessionId(existingSession);
      return;
    }

    const newSession =
      generateId("session");

    sessionStorage.setItem(
      sessionKey,
      newSession
    );

    setSessionId(newSession);
  }, []);

  function updateField(
    field: keyof FormState,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function registerFormStart() {
    if (formStarted) {
      return;
    }

    setFormStarted(true);

    window.trackAguiasEvent?.(
      "form_start",
      {
        elementId: "formulario",
        elementText:
          "Formulário de atendimento",
      }
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const cleanPhone =
      form.telefone.replace(/\D/g, "");

    if (form.nome.trim().length < 2) {
      setErrorMessage(
        "Informe seu nome."
      );

      return;
    }

    if (cleanPhone.length < 10) {
      setErrorMessage(
        "Informe um telefone válido com DDD."
      );

      return;
    }

    if (!form.quemPrecisa) {
      setErrorMessage(
        "Selecione quem precisa de ajuda."
      );

      return;
    }

    if (!form.situacao) {
      setErrorMessage(
        "Selecione qual é a situação."
      );

      return;
    }

    setLoading(true);

    try {
      const params =
        new URLSearchParams(
          window.location.search
        );

      const response =
        await fetch("/api/leads", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            nome: form.nome,
            telefone: cleanPhone,
            quemPrecisa:
              form.quemPrecisa,
            situacao: form.situacao,
            mensagem: form.mensagem,

            visitorId,
            sessionId,

            paginaOrigem:
              window.location.pathname,

            referencia:
              document.referrer || null,

            utmSource:
              params.get("utm_source"),

            utmMedium:
              params.get("utm_medium"),

            utmCampaign:
              params.get(
                "utm_campaign"
              ),

            utmContent:
              params.get("utm_content"),

            utmTerm:
              params.get("utm_term"),

            gclid:
              params.get("gclid"),

            fbclid:
              params.get("fbclid"),
          }),
        });

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Não foi possível enviar seus dados."
        );
      }

      sessionStorage.setItem(
        "aguias_ultimo_lead_nome",
        form.nome.trim()
      );

      setSuccessMessage(
        "Solicitação recebida. Redirecionando..."
      );

      setForm(initialForm);
      setFormStarted(false);

      router.push("/obrigado");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível enviar sua solicitação.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      id="formulario"
      className="mx-auto w-full max-w-xl rounded-3xl border border-blue-400/20 bg-black/60 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.75)] backdrop-blur-2xl md:p-8 lg:max-w-none"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-300">
        <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />

        Equipe disponível agora
      </div>

      <h2 className="mt-5 text-2xl font-black text-white md:text-3xl">
        Solicite atendimento imediato
      </h2>

      <p className="mt-3 text-sm text-gray-400 md:text-base">
        Preencha os dados abaixo. O atendimento é confidencial.
      </p>

      <form
        onSubmit={handleSubmit}
        onFocus={registerFormStart}
        onChange={registerFormStart}
        className="mt-7 space-y-4"
      >
        <div>
          <label
            htmlFor="nome"
            className="mb-2 block text-sm text-gray-300"
          >
            Seu nome
          </label>

          <input
            id="nome"
            name="nome"
            type="text"
            autoComplete="name"
            placeholder="Digite seu nome"
            value={form.nome}
            onChange={(event) =>
              updateField(
                "nome",
                event.target.value
              )
            }
            className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        <div>
          <label
            htmlFor="telefone"
            className="mb-2 block text-sm text-gray-300"
          >
            WhatsApp ou telefone
          </label>

          <input
            id="telefone"
            name="telefone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(62) 99999-9999"
            value={form.telefone}
            onChange={(event) =>
              updateField(
                "telefone",
                formatPhone(
                  event.target.value
                )
              )
            }
            className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="quemPrecisa"
              className="mb-2 block text-sm text-gray-300"
            >
              Quem precisa de ajuda?
            </label>

            <select
              id="quemPrecisa"
              name="quemPrecisa"
              value={form.quemPrecisa}
              onChange={(event) =>
                updateField(
                  "quemPrecisa",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-4 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            >
              <option value="">
                Selecione
              </option>

              <option value="Eu">
                Eu
              </option>

              <option value="Meu filho">
                Meu filho
              </option>

              <option value="Meu marido">
                Meu marido
              </option>

              <option value="Minha esposa">
                Minha esposa
              </option>

              <option value="Meu pai">
                Meu pai
              </option>

              <option value="Minha mãe">
                Minha mãe
              </option>

              <option value="Outro familiar">
                Outro familiar
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="situacao"
              className="mb-2 block text-sm text-gray-300"
            >
              Qual é a situação?
            </label>

            <select
              id="situacao"
              name="situacao"
              value={form.situacao}
              onChange={(event) =>
                updateField(
                  "situacao",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-4 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            >
              <option value="">
                Selecione
              </option>

              <option value="Dependência de álcool">
                Dependência de álcool
              </option>

              <option value="Dependência de crack">
                Dependência de crack
              </option>

              <option value="Dependência de cocaína">
                Dependência de cocaína
              </option>

              <option value="Dependência de maconha">
                Dependência de maconha
              </option>

              <option value="Dependência de medicamentos">
                Dependência de medicamentos
              </option>

              <option value="Recaídas frequentes">
                Recaídas frequentes
              </option>

              <option value="Outra situação">
                Outra situação
              </option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="mensagem"
            className="mb-2 block text-sm text-gray-300"
          >
            Conte um pouco da situação
          </label>

          <textarea
            id="mensagem"
            name="mensagem"
            rows={3}
            placeholder="Essa informação ajuda nossa equipe a compreender o caso."
            value={form.mensagem}
            onChange={(event) =>
              updateField(
                "mensagem",
                event.target.value
              )
            }
            className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.07] px-4 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-blue-300"
          >
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-4 text-base font-black text-white shadow-[0_15px_45px_rgba(37,99,235,0.30)] transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-900 md:py-5 md:text-lg"
        >
          {loading
            ? "Enviando solicitação..."
            : "Receber Atendimento Agora"}
        </button>

        <div className="flex items-start gap-3 pt-1 text-xs leading-5 text-gray-500">
          <span className="mt-0.5 text-blue-400">
            ●
          </span>

          <p>
            Seus dados serão utilizados somente para o atendimento e tratados
            com confidencialidade.
          </p>
        </div>
      </form>
    </div>
  );
}