"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, ArrowLeft, ListOrdered, X } from "lucide-react";
import type { DiscoverySection } from "@/lib/discovery/types";
import { getQuestionsBySection, isQuestionVisible } from "@/lib/discovery/questions/index";
import { discoverySections } from "@/lib/discovery/sections";
import { useDiscoveryState, discoveryActions, flushDiscoveryChanges, isHydratedDiscoveryState } from "@/lib/discovery/store";
import { syncAnswerToSupabase } from "@/lib/discovery/sync";
import { computeSectionProgress } from "@/lib/discovery/progress";
import { computeContradictions } from "@/lib/discovery/rules";
import { DiscoveryQuestionCard } from "./DiscoveryQuestionCard";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { DiscoveryProgressBar } from "./DiscoveryProgressBar";
import { DiscoveryQuestionIndex } from "./DiscoveryQuestionIndex";
import { DiscoverySectionStatusBanner } from "./DiscoverySectionStatusBanner";
import { DiscoverySyncBadge } from "./DiscoverySyncBadge";

function resolveTargetIndex(preferredId: string | undefined, questions: { id: string }[]): number {
  if (!preferredId) return -1;
  return questions.findIndex((q) => q.id === preferredId);
}

export function DiscoverySectionRunner({ section, initialQuestionId }: { section: DiscoverySection; initialQuestionId?: string }) {
  const router = useRouter();
  const state = useDiscoveryState();
  const questions = useMemo(
    () => getQuestionsBySection(section.id).filter((q) => isQuestionVisible(q, state.answers)),
    [section.id, state.answers]
  );
  // Al entrar sin un ?pregunta= explícito, retoma la última pregunta de esta sección que quedó registrada.
  const resumeQuestionId = state.currentSectionSlug === section.slug ? state.currentQuestionId : undefined;
  const entryKey = `${section.id}:${initialQuestionId ?? ""}`;
  const [consumedEntryKey, setConsumedEntryKey] = useState(entryKey);
  const [index, setIndex] = useState(() => {
    const targetIndex = resolveTargetIndex(initialQuestionId ?? resumeQuestionId, questions);
    return targetIndex >= 0 ? targetIndex : 0;
  });
  // La primera pasada de hidratación usa un snapshot vacío (para no romper el hidratado), así que si el
  // destino es una pregunta condicional (visible solo por una respuesta ya guardada) todavía no aparece en
  // `questions` y el índice de arriba puede quedar mal. Se corrige una única vez, apenas llega el snapshot real.
  const [resolvedForHydration, setResolvedForHydration] = useState(false);

  if (entryKey !== consumedEntryKey) {
    setConsumedEntryKey(entryKey);
    setResolvedForHydration(true);
    const targetIndex = resolveTargetIndex(initialQuestionId ?? resumeQuestionId, questions);
    setIndex(targetIndex >= 0 ? targetIndex : 0);
  } else if (!resolvedForHydration && isHydratedDiscoveryState(state)) {
    setResolvedForHydration(true);
    const targetIndex = resolveTargetIndex(initialQuestionId ?? resumeQuestionId, questions);
    if (targetIndex >= 0) setIndex(targetIndex);
  }

  const currentIndex = Math.min(index, Math.max(questions.length - 1, 0));
  const question = questions[currentIndex];
  const answer = question ? state.answers[question.id] : undefined;
  const isLast = currentIndex === questions.length - 1;

  // Registra la posición apenas se resuelve una nueva entrada (deep link o cambio de sección),
  // sincronizando el store externo con el índice ya calculado — no en cada respuesta, solo al entrar.
  useEffect(() => {
    const current = questions[currentIndex];
    if (current) discoveryActions.setPosition(section.slug, current.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryKey]);

  // Red de seguridad para cierre/recarga de pestaña (evento nativo, no depende de que React llegue a desmontar)
  // y para cualquier salida por navegación interna (limpieza al desmontar el componente).
  useEffect(() => {
    window.addEventListener("pagehide", flushDiscoveryChanges);
    window.addEventListener("beforeunload", flushDiscoveryChanges);
    return () => {
      window.removeEventListener("pagehide", flushDiscoveryChanges);
      window.removeEventListener("beforeunload", flushDiscoveryChanges);
      flushDiscoveryChanges();
    };
  }, []);

  const sectionProgress = computeSectionProgress(section.id, state.answers, state.confirmedSections, state.reopenedSections);
  const nextSection = discoverySections.find((s) => s.order === section.order + 1);
  const contradictionQuestionIds = useMemo(() => {
    const ids = new Set<string>();
    for (const c of computeContradictions(state.answers)) {
      if (c.detected) c.questionIds.forEach((id) => ids.add(id));
    }
    return ids;
  }, [state.answers]);
  const [showMeetingIndex, setShowMeetingIndex] = useState(false);

  function goToIndex(newIndex: number) {
    const clamped = Math.min(Math.max(newIndex, 0), Math.max(questions.length - 1, 0));
    // Autoguardado central antes de saltar: en la práctica ya está todo persistido (cada respuesta se
    // guarda al cambiar), pero se ejecuta igual como red de seguridad explícita, sin lógica nueva.
    flushDiscoveryChanges();
    // Sincroniza con Supabase recién al avanzar (no por cada tecla): la pregunta que se deja atrás
    // ya tiene su respuesta final en localStorage en este punto. Nunca bloquea la navegación.
    const leavingQuestion = questions[currentIndex];
    if (leavingQuestion) void syncAnswerToSupabase(leavingQuestion.id);
    setIndex(clamped);
    const target = questions[clamped];
    if (target) {
      discoveryActions.setPosition(section.slug, target.id);
      // Mantiene la URL sincronizada con la posición real (sin disparar una navegación de Next.js),
      // para que una recarga manual retome exactamente esta pregunta y no la del deep link con el que
      // se entró originalmente a la sección.
      window.history.replaceState(null, "", `/app/relevamiento/${section.slug}?pregunta=${target.id}`);
    }
    setShowMeetingIndex(false);
  }

  function goNext() {
    if (isLast) {
      discoveryActions.confirmSection(section.id, true);
      flushDiscoveryChanges();
      const leavingQuestion = questions[currentIndex];
      if (leavingQuestion) void syncAnswerToSupabase(leavingQuestion.id);
      if (nextSection) router.push(`/app/relevamiento/${nextSection.slug}`);
      else router.push("/app/relevamiento");
      return;
    }
    goToIndex(currentIndex + 1);
  }

  function handleExit() {
    flushDiscoveryChanges();
    const leavingQuestion = questions[currentIndex];
    if (leavingQuestion) void syncAnswerToSupabase(leavingQuestion.id);
    router.push("/app/relevamiento");
  }

  if (!question) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
        Esta sección no tiene preguntas visibles en este momento.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/app/relevamiento" className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700">
            <ArrowLeft className="h-3.5 w-3.5" /> Volver al relevamiento
          </Link>
          <h1 className="mt-1 text-lg font-semibold text-slate-900">{section.title}</h1>
          <p className="text-sm text-slate-500">{section.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {state.meetingMode && (
            <span className="inline-flex items-center gap-1 rounded-full bg-petrol-50 px-2.5 py-1 text-[11px] font-medium text-petrol-700 ring-1 ring-inset ring-petrol-200">
              Consulta activa
            </span>
          )}
          <DiscoverySyncBadge status={state.syncStatus ?? "idle"} />
          <button
            type="button"
            onClick={() => discoveryActions.setMeetingMode(!state.meetingMode)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
              state.meetingMode ? "border-petrol-500 bg-petrol-50 text-petrol-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            {state.meetingMode ? "Salir de la consulta" : "Iniciar consulta"}
          </button>
        </div>
      </div>

      {!state.meetingMode && <p className="text-xs text-slate-400">Objetivo de la sección: {section.objective}</p>}

      <DiscoveryProgressBar percent={sectionProgress.percent} label={`${sectionProgress.answered} de ${sectionProgress.total} preguntas respondidas`} />

      {!state.meetingMode && (
        <DiscoveryQuestionIndex
          questions={questions}
          answers={state.answers}
          currentQuestionId={question.id}
          contradictionQuestionIds={contradictionQuestionIds}
          onJump={goToIndex}
        />
      )}

      {state.meetingMode && (
        <div>
          <button
            type="button"
            onClick={() => setShowMeetingIndex((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            {showMeetingIndex ? <X className="h-3.5 w-3.5" /> : <ListOrdered className="h-3.5 w-3.5" />}
            {showMeetingIndex ? "Cerrar índice de preguntas" : "Ver índice de preguntas"}
          </button>
          {showMeetingIndex && (
            <div className="mt-2">
              <DiscoveryQuestionIndex
                questions={questions}
                answers={state.answers}
                currentQuestionId={question.id}
                contradictionQuestionIds={contradictionQuestionIds}
                onJump={goToIndex}
              />
            </div>
          )}
        </div>
      )}

      <DiscoveryQuestionCard
        key={question.id}
        question={question}
        answer={answer}
        meetingMode={state.meetingMode}
        onChangeValue={(value, otherText) => discoveryActions.answerQuestion(question.id, value, otherText)}
        onMarkUnknown={() => discoveryActions.markUnknown(question.id)}
        onMarkForReview={() => discoveryActions.markForReview(question.id)}
        onClearReview={() => discoveryActions.setStatus(question.id, "respondida")}
        onNote={(text) => discoveryActions.setNote(question.id, text)}
      />

      <DiscoveryNavigation
        currentIndex={currentIndex}
        total={questions.length}
        isLast={isLast}
        onPrev={() => goToIndex(currentIndex - 1)}
        onNext={goNext}
        onSkip={() => goToIndex(currentIndex + 1)}
        onExit={handleExit}
      />

      <DiscoverySectionStatusBanner
        status={sectionProgress.status}
        reopenedAt={sectionProgress.reopenedAt}
        onReopen={() => discoveryActions.reopenSection(section.id)}
        onConfirmAgain={() => discoveryActions.confirmSection(section.id, true)}
        onMarkListaParaRevisar={() => discoveryActions.confirmSection(section.id, false)}
      />
    </div>
  );
}
