"use client";

import { useEffect, useState } from "react";
import { Activity, ShieldCheck } from "lucide-react";
import { useAuth } from "../../../auth/AuthContext";
import {
  createDoses,
  createIngredient,
  createMedication,
  deleteDose,
  deleteMedication,
  getIngredients,
  getMedicationDetails,
  getMedicationDoses,
  linkIngredients,
  normalizeMedicationResult,
  searchMedications,
  unlinkIngredient,
  updateMedication,
  uploadMedicationImage,
} from "./admin_api";
import { AdminNotice } from "./admin_notice";
import { DosesManager } from "./doses_manager";
import { ImageUploadPanel } from "./image_upload_panel";
import { IngredientsManager } from "./ingredients_manager";
import { MedicationEditor } from "./medication_editor";
import { MedicationSearchPanel } from "./medication_search_panel";
import type {
  ActiveIngredient,
  AdminNotice as AdminNoticeType,
  MedicationDetails,
  MedicationDose,
  MedicationPayload,
  MedicationSearchResult,
} from "./types";

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Došlo je do neočekivane greške.";
}

export default function AdminPanel() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [notice, setNotice] = useState<AdminNoticeType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<MedicationSearchResult[]>([]);
  const [selectedMedication, setSelectedMedication] =
    useState<MedicationDetails | null>(null);
  const [selectedDoses, setSelectedDoses] = useState<MedicationDose[]>([]);
  const [ingredients, setIngredients] = useState<ActiveIngredient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const refreshIngredients = async () => {
    setIngredients(await getIngredients());
  };

  const refreshMedication = async (medicationId: number) => {
    const [details, doses] = await Promise.all([
      getMedicationDetails(medicationId),
      getMedicationDoses(medicationId),
    ]);

    setSelectedMedication(details);
    setSelectedDoses(doses);
  };

  const runAction = async (
    action: () => Promise<void>,
    successMessage: string
  ) => {
    setIsBusy(true);
    setNotice(null);

    try {
      await action();
      setNotice({ type: "success", message: successMessage });
    } catch (error) {
      setNotice({ type: "error", message: getErrorMessage(error) });
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;

    refreshIngredients().catch((error) => {
      setNotice({ type: "error", message: getErrorMessage(error) });
    });
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;

    const trimmedSearch = searchTerm.trim();

    if (trimmedSearch.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);

      try {
        const results = await searchMedications(trimmedSearch);

        if (!controller.signal.aborted) {
          setSearchResults(results.map(normalizeMedicationResult));
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setSearchResults([]);
          setNotice({ type: "error", message: getErrorMessage(error) });
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [isAdmin, searchTerm]);

  const selectMedication = async (medicationId: number) => {
    setIsSelecting(true);
    setNotice(null);

    try {
      await refreshMedication(medicationId);
    } catch (error) {
      setNotice({ type: "error", message: getErrorMessage(error) });
    } finally {
      setIsSelecting(false);
    }
  };

  const handleCreateMedication = async (payload: MedicationPayload) => {
    await runAction(async () => {
      const result = await createMedication(payload);
      setSearchTerm(payload.name);
      await refreshMedication(result.id);
    }, "Lijek je kreiran.");
  };

  const handleUpdateMedication = async (payload: MedicationPayload) => {
    if (!selectedMedication) return;

    await runAction(async () => {
      await updateMedication(selectedMedication.id, payload);
      await refreshMedication(selectedMedication.id);
      setSearchTerm(payload.name);
    }, "Izmjene su sačuvane.");
  };

  const handleDeleteMedication = async () => {
    if (!selectedMedication) return;

    const confirmed = window.confirm(
      `Obrisati lijek "${selectedMedication.name}"?`
    );

    if (!confirmed) return;

    await runAction(async () => {
      await deleteMedication(selectedMedication.id);
      setSearchResults((current) =>
        current.filter((item) => item.id !== selectedMedication.id)
      );
      setSelectedMedication(null);
      setSelectedDoses([]);
    }, "Lijek je obrisan.");
  };

  const handleCreateIngredient = async (name: string) => {
    await runAction(async () => {
      await createIngredient(name);
      await refreshIngredients();
    }, "Aktivna supstanca je dodata.");
  };

  const handleLinkIngredients = async (ingredientIds: number[]) => {
    if (!selectedMedication) return;

    await runAction(async () => {
      await linkIngredients(selectedMedication.id, ingredientIds);
      await refreshMedication(selectedMedication.id);
    }, "Supstance su povezane sa lijekom.");
  };

  const handleUnlinkIngredient = async (ingredientId: number) => {
    if (!selectedMedication) return;

    await runAction(async () => {
      await unlinkIngredient(selectedMedication.id, ingredientId);
      await refreshMedication(selectedMedication.id);
    }, "Supstanca je uklonjena sa lijeka.");
  };

  const handleCreateDoses = async (strengths: string[]) => {
    if (!selectedMedication) return;

    await runAction(async () => {
      await createDoses(selectedMedication.id, strengths);
      await refreshMedication(selectedMedication.id);
    }, "Doze su dodate.");
  };

  const handleDeleteDose = async (doseId: number) => {
    if (!selectedMedication) return;

    await runAction(async () => {
      await deleteDose(selectedMedication.id, doseId);
      await refreshMedication(selectedMedication.id);
    }, "Doza je obrisana.");
  };

  const handleUploadImage = async (file: File) => {
    if (!selectedMedication) return;

    await runAction(async () => {
      await uploadMedicationImage(selectedMedication.name, file);
      await refreshMedication(selectedMedication.id);
    }, "Slika lijeka je uploadovana.");
  };

  if (!isAdmin) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-950">Admin panel</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Panel je dostupan nakon prijave admin nalogom.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-blue-700">
              <ShieldCheck className="h-4 w-4" />
              Admin panel
            </div>
            <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
              Upravljanje lijekovima
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm">
            <Activity className="h-4 w-4 text-emerald-600" />
            {selectedMedication
              ? `Izabran: ${selectedMedication.name}`
              : "Nema izabranog lijeka"}
          </div>
        </div>

        <div className="mb-4">
          <AdminNotice notice={notice} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(280px,360px)_1fr]">
          <MedicationSearchPanel
            searchTerm={searchTerm}
            results={searchResults}
            selectedMedication={selectedMedication}
            isSearching={isSearching || isSelecting}
            onSearchChange={setSearchTerm}
            onSelectMedication={selectMedication}
          />

          <div className="grid gap-4 xl:grid-cols-2">
            <MedicationEditor
              key={selectedMedication?.id ?? "new-medication"}
              selectedMedication={selectedMedication}
              isBusy={isBusy}
              onCreateMedication={handleCreateMedication}
              onUpdateMedication={handleUpdateMedication}
              onDeleteMedication={handleDeleteMedication}
            />
            <ImageUploadPanel
              medication={selectedMedication}
              isBusy={isBusy}
              onUploadImage={handleUploadImage}
            />
            <IngredientsManager
              medication={selectedMedication}
              ingredients={ingredients}
              isBusy={isBusy}
              onCreateIngredient={handleCreateIngredient}
              onLinkIngredients={handleLinkIngredients}
              onUnlinkIngredient={handleUnlinkIngredient}
            />
            <DosesManager
              medication={selectedMedication}
              doses={selectedDoses}
              isBusy={isBusy}
              onCreateDoses={handleCreateDoses}
              onDeleteDose={handleDeleteDose}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
