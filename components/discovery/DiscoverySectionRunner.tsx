"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, ArrowLeft, CheckCircle2 } from "lucide-react";
import type { DiscoverySection } from "@/lib/discovery/types";
import { getQuestionsBySection, isQuestionVisible } from "@/lib/discovery/questions/index";
import { discoverySections } from "@/lib/discovery/sections";
import { useDiscoveryState, discoveryActions } from "@/lib/discovery/store";
import { computeSectionProgress } from "@/lib/discovery/progress";
import { DiscoveryQuestionCard } from "./DiscoveryQuestionCard";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { DiscoveryProgressBar } from "./DiscoveryProgressBar";

export function DiscoverySectionRunner({ section }: { section: DiscoverySection }) {
  const router = useRouter();
  const state = useDiscoveryState();
  const questions = useMemo(
    () => getQuestionsBySection(section.id).filter((q) => isQuestionVisible(q, state.answers)),
    [section.id, state.answers]
  );
  const [renderedSectionId, setRenderedSectionId] = useState(section.id);
  const [index, setIndex] = useState(0);

  if (section.id !== renderedSectionId) {
    setRenderedSectionId(section.id);
    setIndex(0);
  }

  const currentIndex = Math.min(index, Math.max(questions.length - 1, 0));
  const question = questions[currentIndex];
  const answer = question ? state.answers[question.id] : undefined;
  const isLast = currentIndex === questions.length - 1;

  const sectionProgress = computeSectionProgress(section.id, state.answers, state.confirmedSections);
  const nextSection = discoverySections.find((s) => s.order === section.order + 1);

  function goNext() {
    if (isLast) {
      discoveryActions.confirmSection(section.id, true);
      if (nextSection) router.push(`/app/relevamiento/${nextSection.slug}`);
      else router.push("/app/relevamiento");
      return;
    }
    setIndex((i) => Math.min(i + 1, questions.length - 1));
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
        <button
          type="button"
          onClick={() => discoveryActions.setMeetingMode(!state.meetingMode)}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
            state.meetingMode ? "border-petrol-500 bg-petrol-50 text-petrol-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          {state.meetingMode ? "Modo reunión activo" : "Iniciar modo reunión"}
        </button>
      </div>

      {!state.meetingMode && <p className="text-xs text-slate-400">Objetivo de la sección: {section.objective}</p>}

      <DiscoveryProgressBar percent={sectionProgress.percent} label={`Progreso de esta sección: ${sectionProgress.answered}/${sectionProgress.total}`} />

      <DiscoveryQuestionCard
        key={question.id}
        question={question}
        answer={answer}
        meetingMode={state.meetingMode}
        onChangeValue={(value, otherText) => discoveryActions.answerQuestion(question.id, value, otherText)}
        onMarkUnknown={() => discoveryActions.markUnknown(question.id)}
        onNote={(text) => discoveryActions.setNote(question.id, text)}
      />

      <DiscoveryNavigation
        currentIndex={currentIndex}
        total={questions.length}
        isLast={isLast}
        onPrev={() => setIndex((i) => Math.max(i - 1, 0))}
        onNext={goNext}
        onSkip={() => setIndex((i) => Math.min(i + 1, questions.length - 1))}
        onExit={() => router.push("/app/relevamiento")}
      />

      {sectionProgress.status === "confirmada" && (
        <div className="flex items-center gap-1.5 rounded-lg bg-opgreen-50 px-3 py-2 text-xs text-opgreen-700 ring-1 ring-inset ring-opgreen-100">
          <CheckCircle2 className="h-3.5 w-3.5" /> Sección confirmada.
        </div>
      )}
    </div>
  );
}
