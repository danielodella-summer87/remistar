"use client";

import { useState } from "react";
import { Plus, X, ChevronUp, ChevronDown } from "lucide-react";
import type { DiscoveryAnswerValue, DiscoveryQuestion } from "@/lib/discovery/types";

const chipBase =
  "cursor-pointer select-none rounded-lg border px-3 py-2 text-sm transition-colors";
const chipInactive = "border-slate-200 bg-white text-slate-700 hover:border-petrol-300 hover:bg-petrol-50";
const chipActive = "border-petrol-500 bg-petrol-50 text-petrol-800 font-medium";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-petrol-400 focus:outline-none focus:ring-2 focus:ring-petrol-100";

interface Props {
  question: DiscoveryQuestion;
  value: DiscoveryAnswerValue;
  otherText?: string;
  onChange: (value: DiscoveryAnswerValue, otherText?: string) => void;
}

function asStringArray(value: DiscoveryAnswerValue): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

export function DiscoveryAnswerRenderer({ question, value, otherText, onChange }: Props) {
  switch (question.type) {
    case "unica":
      return <SingleChoice question={question} value={value as string | undefined} otherText={otherText} onChange={onChange} />;
    case "multiple":
    case "condicional":
      return (
        <MultipleChoice question={question} value={asStringArray(value)} otherText={otherText} onChange={onChange} />
      );
    case "si_no_nose":
      return <YesNoUnknown value={value as string | undefined} onChange={onChange} />;
    case "escala":
      return <ScaleInput question={question} value={value as number | undefined} onChange={onChange} />;
    case "ranking":
      return <RankingInput question={question} value={asStringArray(value)} onChange={onChange} />;
    case "matriz":
      return <MatrixInput question={question} value={(value as Record<string, Record<string, boolean>>) ?? {}} onChange={onChange} />;
    case "numero":
      return (
        <input
          type="number"
          className={inputClass}
          value={typeof value === "number" ? value : ""}
          onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
          placeholder={question.placeholder}
        />
      );
    case "moneda":
      return (
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
          <input
            type="number"
            className={`${inputClass} pl-7`}
            value={typeof value === "number" ? value : ""}
            onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
            placeholder={question.placeholder}
          />
        </div>
      );
    case "fecha":
      return (
        <input
          type="date"
          className={inputClass}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value || undefined)}
        />
      );
    case "texto_corto":
      return (
        <input
          type="text"
          className={inputClass}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
        />
      );
    case "texto_largo":
      return (
        <textarea
          className={`${inputClass} min-h-[100px] resize-y`}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
        />
      );
    case "lista_dinamica":
      return <DynamicList value={asStringArray(value)} placeholder={question.placeholder} onChange={onChange} />;
    case "escenario":
      return <ScenarioInput question={question} value={value as string | undefined} onChange={onChange} />;
    default:
      return null;
  }
}

function SingleChoice({ question, value, otherText, onChange }: Props & { value: string | undefined }) {
  const isOther = value === "otro";
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {question.options?.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`${chipBase} ${value === option.value ? chipActive : chipInactive}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
        {question.allowOther && (
          <button
            type="button"
            className={`${chipBase} ${isOther ? chipActive : chipInactive}`}
            onClick={() => onChange("otro")}
          >
            Otro
          </button>
        )}
      </div>
      {question.allowOther && isOther && (
        <input
          type="text"
          className={inputClass}
          placeholder="Especificá..."
          value={otherText ?? ""}
          onChange={(e) => onChange(value, e.target.value)}
        />
      )}
    </div>
  );
}

function MultipleChoice({ question, value, otherText, onChange }: Props & { value: string[] }) {
  const isOtherChecked = value.includes("otro");
  function toggle(optionValue: string) {
    const next = value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue];
    onChange(next, otherText);
  }
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {question.options?.map((option) => {
          const active = value.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              className={`${chipBase} ${active ? chipActive : chipInactive}`}
              onClick={() => toggle(option.value)}
              aria-pressed={active}
            >
              {option.label}
            </button>
          );
        })}
        {question.allowOther && (
          <button
            type="button"
            className={`${chipBase} ${isOtherChecked ? chipActive : chipInactive}`}
            onClick={() => toggle("otro")}
          >
            Otro
          </button>
        )}
      </div>
      {question.allowOther && isOtherChecked && (
        <input
          type="text"
          className={inputClass}
          placeholder="Especificá..."
          value={otherText ?? ""}
          onChange={(e) => onChange(value, e.target.value)}
        />
      )}
    </div>
  );
}

function YesNoUnknown({ value, onChange }: { value: string | undefined; onChange: (v: DiscoveryAnswerValue) => void }) {
  const options = [
    { value: "si", label: "Sí" },
    { value: "no", label: "No" },
    { value: "no_se", label: "No sé todavía" },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`${chipBase} ${value === option.value ? chipActive : chipInactive}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ScaleInput({ question, value, onChange }: { question: DiscoveryQuestion; value: number | undefined; onChange: (v: DiscoveryAnswerValue) => void }) {
  const min = question.scaleMin ?? 1;
  const max = question.scaleMax ?? 5;
  const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div>
      <div className="flex items-center gap-2">
        {range.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors ${
              value === n ? "border-opgreen-500 bg-opgreen-500 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-opgreen-300"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      {question.scaleLabels && (
        <div className="mt-1.5 flex justify-between text-[11px] text-slate-500">
          <span>{question.scaleLabels[0]}</span>
          <span>{question.scaleLabels[1]}</span>
        </div>
      )}
    </div>
  );
}

function RankingInput({ question, value, onChange }: { question: DiscoveryQuestion; value: string[]; onChange: (v: DiscoveryAnswerValue) => void }) {
  const ranked = value.length > 0 ? value : [];
  const remaining = (question.options ?? []).filter((o) => !ranked.includes(o.value));

  function addToRanking(optionValue: string) {
    onChange([...ranked, optionValue]);
  }
  function move(index: number, direction: -1 | 1) {
    const next = [...ranked];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }
  function remove(index: number) {
    const next = ranked.filter((_, i) => i !== index);
    onChange(next);
  }

  const labelOf = (v: string) => question.options?.find((o) => o.value === v)?.label ?? v;

  return (
    <div className="space-y-3">
      {ranked.length > 0 && (
        <ol className="space-y-1.5">
          {ranked.map((v, index) => (
            <li key={v} className="flex items-center gap-2 rounded-lg border border-petrol-200 bg-petrol-50 px-3 py-2 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-petrol-700 text-xs font-semibold text-white">
                {index + 1}
              </span>
              <span className="flex-1 text-petrol-900">{labelOf(v)}</span>
              <button type="button" onClick={() => move(index, -1)} className="text-petrol-500 hover:text-petrol-800" aria-label="Subir">
                <ChevronUp className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => move(index, 1)} className="text-petrol-500 hover:text-petrol-800" aria-label="Bajar">
                <ChevronDown className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => remove(index)} className="text-slate-400 hover:text-red-600" aria-label="Quitar">
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ol>
      )}
      {remaining.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs text-slate-500">Tocá para agregar a la lista ordenada:</p>
          <div className="flex flex-wrap gap-2">
            {remaining.map((option) => (
              <button key={option.value} type="button" onClick={() => addToRanking(option.value)} className={`${chipBase} ${chipInactive}`}>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MatrixInput({
  question,
  value,
  onChange,
}: {
  question: DiscoveryQuestion;
  value: Record<string, Record<string, boolean>>;
  onChange: (v: DiscoveryAnswerValue) => void;
}) {
  const rows = question.matrixRows ?? [];
  const cols = question.matrixCols ?? [];
  const singleSelect = Boolean(question.matrixSingleSelectPerRow);

  function toggleCell(rowValue: string, colValue: string) {
    const rowState = value[rowValue] ?? {};
    let nextRow: Record<string, boolean>;
    if (singleSelect) {
      nextRow = Object.fromEntries(cols.map((c) => [c.value, c.value === colValue]));
    } else {
      nextRow = { ...rowState, [colValue]: !rowState[colValue] };
    }
    onChange({ ...value, [rowValue]: nextRow });
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50">
            <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold text-slate-500" />
            {cols.map((col) => (
              <th key={col.value} className="border-b border-slate-200 px-3 py-2 text-center text-xs font-semibold text-slate-500">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.value} className="border-b border-slate-100 last:border-b-0">
              <td className="px-3 py-2 text-sm font-medium text-slate-700">{row.label}</td>
              {cols.map((col) => {
                const checked = Boolean(value[row.value]?.[col.value]);
                return (
                  <td key={col.value} className="px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => toggleCell(row.value, col.value)}
                      aria-pressed={checked}
                      className={`h-5 w-5 rounded${singleSelect ? "-full" : ""} border-2 transition-colors ${
                        checked ? "border-opgreen-500 bg-opgreen-500" : "border-slate-300 bg-white"
                      }`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DynamicList({ value, placeholder, onChange }: { value: string[]; placeholder?: string; onChange: (v: DiscoveryAnswerValue) => void }) {
  const [draft, setDraft] = useState("");

  function add() {
    if (!draft.trim()) return;
    onChange([...value, draft.trim()]);
    setDraft("");
  }
  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <ul className="space-y-1.5">
          {value.map((item, index) => (
            <li key={`${item}-${index}`} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
              <span className="flex-1">{item}</span>
              <button type="button" onClick={() => remove(index)} className="text-slate-400 hover:text-red-600" aria-label="Quitar">
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          className={inputClass}
          placeholder={placeholder ?? "Agregar..."}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          onClick={add}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-petrol-300 bg-petrol-50 px-3 py-2 text-sm font-medium text-petrol-700 hover:bg-petrol-100"
        >
          <Plus className="h-4 w-4" />
          Agregar
        </button>
      </div>
    </div>
  );
}

function ScenarioInput({ question, value, onChange }: { question: DiscoveryQuestion; value: string | undefined; onChange: (v: DiscoveryAnswerValue) => void }) {
  if (!question.scenario) return null;
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">{question.scenario.situation}</div>
      <div className="flex flex-wrap gap-2">
        {question.scenario.options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`${chipBase} ${value === option.value ? chipActive : chipInactive}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
