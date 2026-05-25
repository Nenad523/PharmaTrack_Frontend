"use client";

import { useState } from "react";
import { Trash2, Pencil, Check, X } from "lucide-react";
import type { PharmacyDetails, ScheduleExceptionEntry, ScheduleExceptionPayload } from "./pharmacy_types";

const REASONS = [
  { value: "holiday", label: "Državni praznik" },
  { value: "special_hours", label: "Posebno radno vrijeme" },
  { value: "closure", label: "Zatvoreno" },
];

const emptyForm: ScheduleExceptionPayload = {
  exception_date: "",
  name: "",
  open_time: "",
  close_time: "",
  is_closed: false,
  reason: "holiday",
};

type EditState = ScheduleExceptionPayload;

type Props = {
  pharmacy: PharmacyDetails | null;
  exceptions: ScheduleExceptionEntry[];
  isBusy: boolean;
  onAdd: (payload: ScheduleExceptionPayload) => void;
  onUpdate: (exId: number, payload: Partial<ScheduleExceptionPayload>) => void;
  onDelete: (exId: number) => void;
};

export function ScheduleExceptionsManager({
  pharmacy,
  exceptions,
  isBusy,
  onAdd,
  onUpdate,
  onDelete,
}: Props) {
  const [form, setForm] = useState<ScheduleExceptionPayload>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editState, setEditState] = useState<EditState>(emptyForm);

  const setField = <K extends keyof ScheduleExceptionPayload>(
    field: K,
    value: ScheduleExceptionPayload[K]
  ) => setForm((prev) => ({ ...prev, [field]: value }));

  const setEditField = <K extends keyof EditState>(field: K, value: EditState[K]) =>
    setEditState((prev) => ({ ...prev, [field]: value }));

  const startEdit = (ex: ScheduleExceptionEntry) => {
    setEditingId(ex.id);
    setEditState({
      exception_date: ex.exception_date,
      name: ex.name,
      open_time: ex.open_time ?? "",
      close_time: ex.close_time ?? "",
      is_closed: ex.is_closed,
      reason: ex.reason,
    });
  };

  const cancelEdit = () => setEditingId(null);

  const confirmEdit = (exId: number) => {
    const payload: Partial<ScheduleExceptionPayload> = {
      exception_date: editState.exception_date,
      name: editState.name,
      is_closed: editState.is_closed,
      reason: editState.reason,
    };
    if (editState.open_time) payload.open_time = editState.open_time;
    if (editState.close_time) payload.close_time = editState.close_time;
    onUpdate(exId, payload);
    setEditingId(null);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.exception_date || !form.name) return;
    const payload: ScheduleExceptionPayload = {
      exception_date: form.exception_date,
      name: form.name,
      is_closed: form.is_closed,
      reason: form.reason,
    };
    if (form.open_time) payload.open_time = form.open_time + ":00";
    if (form.close_time) payload.close_time = form.close_time + ":00";
    onAdd(payload);
    setForm(emptyForm);
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 disabled:bg-slate-50";
  const labelClass = "mb-0.5 block text-xs text-slate-500";

  if (!pharmacy) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-slate-900">Izuzeci rasporeda</h2>
        <p className="text-xs text-slate-400">Izaberi apoteku da upravljaš izuzecima.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-1 text-base font-semibold text-slate-900">Izuzeci rasporeda</h2>
      <p className="mb-3 text-xs text-slate-500">Praznici, posebne smjene, zatvoreno — {pharmacy.name}</p>

      {exceptions.length > 0 ? (
        <ul className="mb-4 space-y-1">
          {exceptions.map((ex) =>
            editingId === ex.id ? (
              <li key={ex.id} className="rounded-lg border border-blue-200 bg-blue-50 p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClass}>Datum</label>
                    <input type="date" className={inputClass} value={editState.exception_date}
                      onChange={(e) => setEditField("exception_date", e.target.value)} disabled={isBusy} />
                  </div>
                  <div>
                    <label className={labelClass}>Naziv</label>
                    <input type="text" className={inputClass} value={editState.name}
                      onChange={(e) => setEditField("name", e.target.value)} disabled={isBusy} />
                  </div>
                  <div>
                    <label className={labelClass}>Razlog</label>
                    <select className={inputClass} value={editState.reason}
                      onChange={(e) => setEditField("reason", e.target.value)} disabled={isBusy}>
                      {REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <label className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-700">
                      <input type="checkbox" checked={editState.is_closed}
                        onChange={(e) => setEditField("is_closed", e.target.checked)}
                        disabled={isBusy} className="rounded" />
                      Zatvoreno
                    </label>
                  </div>
                  {!editState.is_closed && (
                    <>
                      <div>
                        <label className={labelClass}>Otvaranje</label>
                        <input type="time" className={inputClass} value={(editState.open_time ?? "").slice(0, 5)}
                          onChange={(e) => setEditField("open_time", e.target.value)} disabled={isBusy} />
                      </div>
                      <div>
                        <label className={labelClass}>Zatvaranje</label>
                        <input type="time" className={inputClass} value={(editState.close_time ?? "").slice(0, 5)}
                          onChange={(e) => setEditField("close_time", e.target.value)} disabled={isBusy} />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => confirmEdit(ex.id)} disabled={isBusy}
                    className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                    <Check className="h-3.5 w-3.5" /> Sačuvaj
                  </button>
                  <button type="button" onClick={cancelEdit}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                    <X className="h-3.5 w-3.5" /> Odustani
                  </button>
                </div>
              </li>
            ) : (
              <li key={ex.id} className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-sm">
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-slate-700">{ex.exception_date}</span>
                  <span className="mx-2 text-slate-300">|</span>
                  <span className="text-slate-600">{ex.name}</span>
                  {ex.is_closed ? (
                    <span className="ml-2 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">Zatvoreno</span>
                  ) : ex.open_time ? (
                    <span className="ml-2 text-xs text-slate-400">
                      {ex.open_time.slice(0, 5)} – {ex.close_time?.slice(0, 5)}
                    </span>
                  ) : null}
                </div>
                <button type="button" onClick={() => startEdit(ex)} disabled={isBusy}
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600 disabled:opacity-40">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => onDelete(ex.id)} disabled={isBusy}
                  className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            )
          )}
        </ul>
      ) : (
        <p className="mb-4 text-xs text-slate-400">Nema unesenih izuzetaka.</p>
      )}

      <form onSubmit={handleAdd} className="space-y-2 border-t border-slate-100 pt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Dodaj izuzetak</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelClass}>Datum</label>
            <input type="date" className={inputClass} value={form.exception_date}
              onChange={(e) => setField("exception_date", e.target.value)} disabled={isBusy} />
          </div>
          <div>
            <label className={labelClass}>Naziv (npr. Nova Godina)</label>
            <input type="text" className={inputClass} placeholder="Nova Godina" value={form.name}
              onChange={(e) => setField("name", e.target.value)} disabled={isBusy} />
          </div>
          <div>
            <label className={labelClass}>Razlog</label>
            <select className={inputClass} value={form.reason}
              onChange={(e) => setField("reason", e.target.value)} disabled={isBusy}>
              {REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-700">
              <input type="checkbox" checked={form.is_closed}
                onChange={(e) => setField("is_closed", e.target.checked)}
                disabled={isBusy} className="rounded" />
              Zatvoreno cijeli dan
            </label>
          </div>
          {!form.is_closed && (
            <>
              <div>
                <label className={labelClass}>Otvaranje</label>
                <input type="time" className={inputClass} value={form.open_time ?? ""}
                  onChange={(e) => setField("open_time", e.target.value)} disabled={isBusy} />
              </div>
              <div>
                <label className={labelClass}>Zatvaranje</label>
                <input type="time" className={inputClass} value={form.close_time ?? ""}
                  onChange={(e) => setField("close_time", e.target.value)} disabled={isBusy} />
              </div>
            </>
          )}
        </div>
        <button
          type="submit"
          disabled={isBusy || !form.exception_date || !form.name}
          className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          + Dodaj izuzetak
        </button>
      </form>
    </div>
  );
}
