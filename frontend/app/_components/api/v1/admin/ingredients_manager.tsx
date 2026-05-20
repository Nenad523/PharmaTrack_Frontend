"use client";

import { FormEvent, useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { ingredientOptions } from "./admin_api";
import type { ActiveIngredient, MedicationDetails } from "./types";

type IngredientsManagerProps = {
  medication: MedicationDetails | null;
  ingredients: ActiveIngredient[];
  isBusy: boolean;
  onCreateIngredient: (name: string) => Promise<void>;
  onLinkIngredients: (ingredientIds: number[]) => Promise<void>;
  onUnlinkIngredient: (ingredientId: number) => Promise<void>;
};

export function IngredientsManager({
  medication,
  ingredients,
  isBusy,
  onCreateIngredient,
  onLinkIngredients,
  onUnlinkIngredient,
}: IngredientsManagerProps) {
  const [newIngredientName, setNewIngredientName] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const availableIngredients = useMemo(
    () => ingredientOptions(ingredients, medication),
    [ingredients, medication]
  );

  const submitNewIngredient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newIngredientName.trim();

    if (!name) return;

    await onCreateIngredient(name);
    setNewIngredientName("");
  };

  const submitLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedIds.length === 0) return;

    await onLinkIngredients(selectedIds);
    setSelectedIds([]);
  };

  const toggleIngredient = (ingredientId: number) => {
    setSelectedIds((current) =>
      current.includes(ingredientId)
        ? current.filter((id) => id !== ingredientId)
        : [...current, ingredientId]
    );
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <h2 className="text-base font-bold text-slate-950">
          Aktivne supstance
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Kreiranje supstanci i povezivanje sa izabranim lijekom.
        </p>
      </div>

      <form onSubmit={submitNewIngredient} className="mt-4 flex gap-2">
        <input
          value={newIngredientName}
          onChange={(event) => setNewIngredientName(event.target.value)}
          minLength={2}
          maxLength={100}
          placeholder="Nova aktivna supstanca"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="submit"
          disabled={isBusy || newIngredientName.trim().length < 2}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-emerald-200 px-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          Dodaj
        </button>
      </form>

      {!medication ? (
        <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500">
          Izaberi lijek da dodaš ili ukloniš supstance.
        </p>
      ) : (
        <>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Povezane supstance
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {medication.activeIngredients.length === 0 && (
                <span className="text-sm text-slate-500">
                  Nema povezanih supstanci.
                </span>
              )}

              {medication.activeIngredients.map((ingredient) => (
                <span
                  key={ingredient.id}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm font-semibold text-slate-700"
                >
                  {ingredient.name}
                  <button
                    type="button"
                    onClick={() => onUnlinkIngredient(ingredient.id)}
                    disabled={isBusy}
                    className="rounded p-0.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={`Ukloni supstancu ${ingredient.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <form onSubmit={submitLink} className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Dodaj iz liste
            </p>
            <div className="mt-2 max-h-44 overflow-auto rounded-lg border border-slate-200 p-2">
              {availableIngredients.length === 0 && (
                <p className="px-2 py-3 text-sm text-slate-500">
                  Sve dostupne supstance su već povezane.
                </p>
              )}

              {availableIngredients.map((ingredient) => (
                <label
                  key={ingredient.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(ingredient.id)}
                    onChange={() => toggleIngredient(ingredient.id)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  <span>{ingredient.name}</span>
                </label>
              ))}
            </div>
            <button
              type="submit"
              disabled={isBusy || selectedIds.length === 0}
              className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg border border-blue-200 px-4 text-sm font-bold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              Poveži supstance
            </button>
          </form>
        </>
      )}
    </section>
  );
}
