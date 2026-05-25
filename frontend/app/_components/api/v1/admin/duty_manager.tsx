"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { DutyEntry, DutyPayload, PharmacyDetails } from "./pharmacy_types";

function toDisplayDatetime(raw: string) {
  return raw.replace("T", " ").slice(0, 16).replace(" ", " ").replace("T", " ");
}

type Props = {
  pharmacy: PharmacyDetails | null;
  duties: DutyEntry[];
  isBusy: boolean;
  onAdd: (payload: DutyPayload) => void;
  onDelete: (dutyId: number) => void;
};

const emptyForm = { start_date: "", start_time: "00:00", end_date: "", end_time: "08:00" };

export function DutyManager({ pharmacy, duties, isBusy, onAdd, onDelete }: Props) {
  const [form, setForm] = useState(emptyForm);

  const set = (field: keyof typeof emptyForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.start_date || !form.end_date) return;
    onAdd({
      start_datetime: `${form.start_date} ${form.start_time}:00`,
      end_datetime: `${form.end_date} ${form.end_time}:00`,
    });
    setForm(emptyForm);
  };

  const inputClass =
    "rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 disabled:bg-slate-50";

  if (!pharmacy) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-slate-900">Dežurstva</h2>
        <p className="text-xs text-slate-400">Izaberi apoteku da upravljaš dežurstvima.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-1 text-base font-semibold text-slate-900">Dežurstva</h2>
      <p className="mb-3 text-xs text-slate-500">{pharmacy.name}</p>

      {duties.length > 0 ? (
        <ul className="mb-4 space-y-1">
          {duties.map((d) => (
            <li
              key={d.id}
              className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-sm"
            >
              <div className="flex-1">
                <span className="text-slate-700">
                  {toDisplayDatetime(d.start_datetime)}
                </span>
                <span className="mx-2 text-slate-400">→</span>
                <span className="text-slate-700">
                  {toDisplayDatetime(d.end_datetime)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onDelete(d.id)}
                disabled={isBusy}
                className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-4 text-xs text-slate-400">Nema unesenih dežurstava.</p>
      )}

      <form onSubmit={handleAdd} className="space-y-2 border-t border-slate-100 pt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Dodaj dežurstvo</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-xs text-slate-500">Početak — datum</label>
            <input
              type="date"
              className={inputClass + " w-full"}
              value={form.start_date}
              onChange={(e) => set("start_date", e.target.value)}
              disabled={isBusy}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Početak — vrijeme</label>
            <input
              type="time"
              className={inputClass + " w-full"}
              value={form.start_time}
              onChange={(e) => set("start_time", e.target.value)}
              disabled={isBusy}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Kraj — datum</label>
            <input
              type="date"
              className={inputClass + " w-full"}
              value={form.end_date}
              onChange={(e) => set("end_date", e.target.value)}
              disabled={isBusy}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Kraj — vrijeme</label>
            <input
              type="time"
              className={inputClass + " w-full"}
              value={form.end_time}
              onChange={(e) => set("end_time", e.target.value)}
              disabled={isBusy}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isBusy || !form.start_date || !form.end_date}
          className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          + Dodaj dežurstvo
        </button>
      </form>
    </div>
  );
}
