"use client";

import { useState } from "react";
import { Trash2, Pencil, Check, X } from "lucide-react";
import type { PharmacyDetails, WorkingHoursEntry, WorkingHoursPayload } from "./pharmacy_types";

const DAYS = [
  { value: "Monday", label: "Ponedjeljak" },
  { value: "Tuesday", label: "Utorak" },
  { value: "Wednesday", label: "Srijeda" },
  { value: "Thursday", label: "Četvrtak" },
  { value: "Friday", label: "Petak" },
  { value: "Saturday", label: "Subota" },
  { value: "Sunday", label: "Nedjelja" },
];

const DAY_LABEL: Record<string, string> = Object.fromEntries(
  DAYS.map((d) => [d.value.toLowerCase(), d.label])
);

function dayLabel(raw: string) {
  return DAY_LABEL[raw.toLowerCase()] ?? raw;
}

function timeInput(value: string, onChange: (v: string) => void, disabled: boolean) {
  return (
    <input
      type="time"
      value={value.slice(0, 5)}
      onChange={(e) => onChange(e.target.value + ":00")}
      disabled={disabled}
      className="rounded border border-slate-200 px-2 py-1 text-sm text-slate-800 [color-scheme:light] outline-none focus:border-blue-400 disabled:bg-slate-50"
    />
  );
}

type Props = {
  pharmacy: PharmacyDetails | null;
  workingHours: WorkingHoursEntry[];
  isBusy: boolean;
  onAdd: (payload: WorkingHoursPayload) => void;
  onUpdate: (whId: number, payload: Partial<WorkingHoursPayload>) => void;
  onDelete: (whId: number) => void;
};

export function WorkingHoursManager({
  pharmacy,
  workingHours,
  isBusy,
  onAdd,
  onUpdate,
  onDelete,
}: Props) {
  const [newDay, setNewDay] = useState("Monday");
  const [newOpen, setNewOpen] = useState("08:00:00");
  const [newClose, setNewClose] = useState("20:00:00");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState("");
  const [editClose, setEditClose] = useState("");

  const startEdit = (wh: WorkingHoursEntry) => {
    setEditingId(wh.id);
    setEditOpen(wh.open_time);
    setEditClose(wh.close_time);
  };

  const cancelEdit = () => setEditingId(null);

  const confirmEdit = (whId: number) => {
    onUpdate(whId, { open_time: editOpen, close_time: editClose });
    setEditingId(null);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ day_of_week: newDay, open_time: newOpen, close_time: newClose });
  };

  const inputClass =
    "rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 disabled:bg-slate-50";

  if (!pharmacy) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-slate-900">Radno vrijeme</h2>
        <p className="text-xs text-slate-400">Izaberi apoteku da upravljaš radnim vremenom.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-1 text-base font-semibold text-slate-900">Radno vrijeme</h2>
      <p className="mb-3 text-xs text-slate-500">{pharmacy.name}</p>

      {workingHours.length > 0 ? (
        <ul className="mb-4 space-y-1">
          {workingHours.map((wh) =>
            editingId === wh.id ? (
              <li key={wh.id} className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                <span className="w-28 text-sm font-medium text-slate-700">{dayLabel(wh.day_of_week)}</span>
                {timeInput(editOpen, setEditOpen, isBusy)}
                <span className="text-slate-400">–</span>
                {timeInput(editClose, setEditClose, isBusy)}
                <button
                  type="button"
                  onClick={() => confirmEdit(wh.id)}
                  disabled={isBusy}
                  className="ml-auto rounded p-1 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ) : (
              <li
                key={wh.id}
                className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-sm"
              >
                <span className="w-28 font-medium text-slate-700">{dayLabel(wh.day_of_week)}</span>
                <span className="text-slate-500">
                  {wh.open_time.slice(0, 5)} – {wh.close_time.slice(0, 5)}
                </span>
                <button
                  type="button"
                  onClick={() => startEdit(wh)}
                  disabled={isBusy}
                  className="ml-auto rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600 disabled:opacity-40"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(wh.id)}
                  disabled={isBusy}
                  className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            )
          )}
        </ul>
      ) : (
        <p className="mb-4 text-xs text-slate-400">Nema unesenog radnog vremena.</p>
      )}

      <form onSubmit={handleAdd} className="space-y-2 border-t border-slate-100 pt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Dodaj dan</p>
        <select
          className={inputClass + " w-full"}
          value={newDay}
          onChange={(e) => setNewDay(e.target.value)}
          disabled={isBusy}
        >
          {DAYS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          {timeInput(newOpen, setNewOpen, isBusy)}
          <span className="text-slate-400">–</span>
          {timeInput(newClose, setNewClose, isBusy)}
          <button
            type="submit"
            disabled={isBusy}
            className="ml-auto rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            + Dodaj
          </button>
        </div>
      </form>
    </div>
  );
}
