"use client";

import { FormEvent, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import type { MedicationDetails, MedicationPayload } from "./types";

type MedicationEditorProps = {
  selectedMedication: MedicationDetails | null;
  isBusy: boolean;
  onCreateMedication: (payload: MedicationPayload) => Promise<void>;
  onUpdateMedication: (payload: MedicationPayload) => Promise<void>;
  onDeleteMedication: () => Promise<void>;
};

const emptyForm = {
  name: "",
  description: "",
};

export function MedicationEditor({
  selectedMedication,
  isBusy,
  onCreateMedication,
  onUpdateMedication,
  onDeleteMedication,
}: MedicationEditorProps) {
  const [form, setForm] = useState(() => {
    if (selectedMedication) {
      return {
        name: selectedMedication.name,
        description: selectedMedication.description ?? "",
      };
    }

    return emptyForm;
  });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
    };

    if (!payload.name) return;

    if (selectedMedication) {
      await onUpdateMedication(payload);
      return;
    }

    await onCreateMedication(payload);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-950">
            {selectedMedication ? "Izmjena lijeka" : "Novi lijek"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Osnovni podaci koji se čuvaju direktno na lijeku.
          </p>
        </div>
        {selectedMedication && (
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
            ID {selectedMedication.id}
          </span>
        )}
      </div>

      <form onSubmit={submit} className="mt-4 space-y-3">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Naziv
          </span>
          <input
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            minLength={3}
            maxLength={100}
            required
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            placeholder="Paracetamol Galenika"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Opis
          </span>
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            maxLength={1000}
            rows={5}
            className="mt-1 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            placeholder="Opis lijeka, namjena i osnovne napomene."
          />
        </label>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="submit"
            disabled={isBusy}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {selectedMedication ? (
              <Save className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {selectedMedication ? "Sačuvaj izmjene" : "Kreiraj lijek"}
          </button>

          {selectedMedication && (
            <button
              type="button"
              onClick={onDeleteMedication}
              disabled={isBusy}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-rose-200 px-4 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              Obriši
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
