"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import type { City, PharmacyDetails, PharmacyPayload } from "./pharmacy_types";

type Props = {
  selectedPharmacy: PharmacyDetails | null;
  cities: City[];
  isBusy: boolean;
  onCreatePharmacy: (payload: PharmacyPayload) => void;
  onUpdatePharmacy: (payload: Partial<PharmacyPayload>) => void;
  onDeletePharmacy: () => void;
};

const empty = { name: "", address: "", latitude: "", longitude: "", city_id: "" };

export function PharmacyEditor({
  selectedPharmacy,
  cities,
  isBusy,
  onCreatePharmacy,
  onUpdatePharmacy,
  onDeletePharmacy,
}: Props) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (selectedPharmacy) {
      setForm({
        name: selectedPharmacy.name,
        address: selectedPharmacy.address,
        latitude: String(selectedPharmacy.latitude),
        longitude: String(selectedPharmacy.longitude),
        city_id: String(selectedPharmacy.city_id),
      });
    } else {
      setForm(empty);
    }
  }, [selectedPharmacy]);

  const set = (field: keyof typeof empty, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const buildPayload = (): PharmacyPayload | null => {
    const lat = parseFloat(form.latitude);
    const lng = parseFloat(form.longitude);
    const cityId = parseInt(form.city_id, 10);

    if (!form.name.trim() || !form.address.trim() || isNaN(lat) || isNaN(lng) || isNaN(cityId))
      return null;

    return {
      name: form.name.trim(),
      address: form.address.trim(),
      latitude: lat,
      longitude: lng,
      city_id: cityId,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildPayload();
    if (!payload) return;
    if (selectedPharmacy) {
      onUpdatePharmacy(payload);
    } else {
      onCreatePharmacy(payload);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 disabled:bg-slate-50 disabled:text-slate-400";
  const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-1 text-base font-semibold text-slate-900">
        {selectedPharmacy ? "Izmjena apoteke" : "Nova apoteka"}
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        {selectedPharmacy
          ? `Izmjena podataka za: ${selectedPharmacy.name}`
          : "Osnovni podaci koji se čuvaju direktno na apoteci."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className={labelClass}>Naziv</label>
          <input
            className={inputClass}
            placeholder="Apoteka Zdravlje"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            disabled={isBusy}
            minLength={3}
          />
        </div>

        <div>
          <label className={labelClass}>Adresa</label>
          <input
            className={inputClass}
            placeholder="Bulevar Svetog Petra 12, Podgorica"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            disabled={isBusy}
            minLength={5}
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Geografska širina</label>
            <input
              className={inputClass}
              placeholder="42.4413"
              value={form.latitude}
              onChange={(e) => set("latitude", e.target.value)}
              disabled={isBusy}
              type="number"
              step="any"
            />
          </div>
          <div>
            <label className={labelClass}>Geografska dužina</label>
            <input
              className={inputClass}
              placeholder="19.2629"
              value={form.longitude}
              onChange={(e) => set("longitude", e.target.value)}
              disabled={isBusy}
              type="number"
              step="any"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Grad</label>
          <select
            className={inputClass}
            value={form.city_id}
            onChange={(e) => set("city_id", e.target.value)}
            disabled={isBusy || cities.length === 0}
          >
            <option value="">— Izaberi grad —</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={isBusy}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {selectedPharmacy ? "Sačuvaj izmjene" : "+ Kreiraj apoteku"}
          </button>

          {selectedPharmacy && (
            <button
              type="button"
              onClick={onDeletePharmacy}
              disabled={isBusy}
              className="rounded-lg border border-rose-200 px-3 py-2 text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
              title="Obriši apoteku"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
