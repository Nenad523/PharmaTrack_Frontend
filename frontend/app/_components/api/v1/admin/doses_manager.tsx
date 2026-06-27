"use client";

import { FormEvent, useState } from "react";
import { Plus, X } from "lucide-react";
import type { MedicationDetails, MedicationDose } from "./types";

type DosesManagerProps = {
  medication: MedicationDetails | null;
  doses: MedicationDose[];
  isBusy: boolean;
  onCreateDoses: (strengths: string[]) => Promise<void>;
  onDeleteDose: (doseId: number) => Promise<void>;
  onUpdateDose: (doseId: number, is_refundable: boolean) => Promise<void>;
};

export function DosesManager({
  medication,
  doses,
  isBusy,
  onCreateDoses,
  onDeleteDose,
  onUpdateDose,
}: DosesManagerProps) {
  const [strengths, setStrengths] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = strengths
      .split(/[\n,]/)
      .map((value) => value.trim())
      .filter(Boolean);

    if (values.length === 0) return;

    await onCreateDoses(values);
    setStrengths("");
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <h2 className="text-base font-bold text-slate-950">Doze</h2>
        <p className="mt-1 text-sm text-slate-500">
          Dodavanje više jačina odjednom za izabrani lijek.
        </p>
      </div>

      {!medication ? (
        <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500">
          Izaberi lijek da upravljaš dozama.
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            {doses.length === 0 && (
              <span className="text-sm text-slate-500">Nema unesenih doza.</span>
            )}

            {doses.map((dose) => (
              <span
                key={dose.id}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm font-semibold text-slate-700"
              >
                {dose.strength}
                <button
                  type="button"
                  onClick={() => onUpdateDose(dose.id, !dose.is_refundable)}
                  disabled={isBusy}
                  title={dose.is_refundable ? "RFZO: refundabilno" : "RFZO: nije refundabilno"}
                  className={`rounded px-1.5 py-0.5 text-[11px] font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    dose.is_refundable
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  RFZO
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteDose(dose.id)}
                  disabled={isBusy}
                  className="rounded p-0.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Ukloni dozu ${dose.strength}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={submit} className="mt-4 space-y-3">
            <textarea
              value={strengths}
              onChange={(event) => setStrengths(event.target.value)}
              rows={3}
              placeholder="500mg, 1000mg"
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="submit"
              disabled={isBusy || strengths.trim().length === 0}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-blue-200 px-4 text-sm font-bold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              Dodaj doze
            </button>
          </form>
        </>
      )}
    </section>
  );
}
