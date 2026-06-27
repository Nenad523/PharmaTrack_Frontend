"use client";

import { useEffect, useState } from "react";
import {
  createDuty,
  createPharmacy,
  createScheduleException,
  createWorkingHours,
  deleteDuty,
  deletePharmacy,
  deleteScheduleException,
  deleteWorkingHours,
  getCities,
  getDutySchedules,
  getPharmacyById,
  getScheduleExceptions,
  getWorkingHours,
  searchPharmacies,
  updatePharmacy,
  updateScheduleException,
  updateWorkingHours,
} from "./pharmacy_api";
import { uploadPharmacyImage, removePharmacyImage } from "./admin_api";
import { PharmacyImageUploadPanel } from "./pharmacy_image_upload_panel";
import { AdminNotice } from "./admin_notice";
import { DutyManager } from "./duty_manager";
import { PharmacyEditor } from "./pharmacy_editor";
import { PharmacySearchPanel } from "./pharmacy_search_panel";
import { ScheduleExceptionsManager } from "./schedule_exceptions_manager";
import { WorkingHoursManager } from "./working_hours_manager";
import type {
  City,
  DutyEntry,
  DutyPayload,
  PharmacyDetails,
  PharmacyNotice,
  PharmacyPayload,
  PharmacySearchResult,
  ScheduleExceptionEntry,
  ScheduleExceptionPayload,
  WorkingHoursEntry,
  WorkingHoursPayload,
} from "./pharmacy_types";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Došlo je do neočekivane greške.";
}

export function PharmacyPanel() {
  const [notice, setNotice] = useState<PharmacyNotice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<PharmacySearchResult[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyDetails | null>(null);
  const [workingHours, setWorkingHours] = useState<WorkingHoursEntry[]>([]);
  const [duties, setDuties] = useState<DutyEntry[]>([]);
  const [exceptions, setExceptions] = useState<ScheduleExceptionEntry[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    getCities()
      .then(setCities)
      .catch((error) => setNotice({ type: "error", message: getErrorMessage(error) }));
  }, []);

  useEffect(() => {
    const trimmed = searchTerm.trim();

    if (trimmed.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchPharmacies(trimmed);
        if (!controller.signal.aborted) setSearchResults(results);
      } catch (error) {
        if (!controller.signal.aborted) {
          setSearchResults([]);
          setNotice({ type: "error", message: getErrorMessage(error) });
        }
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const refreshPharmacyData = async (pharmacyId: number) => {
    const [details, wh, duty, ex] = await Promise.all([
      getPharmacyById(pharmacyId),
      getWorkingHours(pharmacyId),
      getDutySchedules(pharmacyId),
      getScheduleExceptions(pharmacyId),
    ]);
    setSelectedPharmacy(details);
    setWorkingHours(wh);
    setDuties(duty);
    setExceptions(ex);
  };

  const selectPharmacy = async (pharmacyId: number) => {
    setIsSelecting(true);
    setNotice(null);
    try {
      await refreshPharmacyData(pharmacyId);
    } catch (error) {
      setNotice({ type: "error", message: getErrorMessage(error) });
    } finally {
      setIsSelecting(false);
    }
  };

  const runAction = async (action: () => Promise<void>, successMessage: string) => {
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

  const handleCreatePharmacy = async (payload: PharmacyPayload) => {
    await runAction(async () => {
      const result = await createPharmacy(payload);
      setSearchTerm(payload.name);
      await refreshPharmacyData(result.id);
    }, "Apoteka je kreirana.");
  };

  const handleUpdatePharmacy = async (payload: Partial<PharmacyPayload>) => {
    if (!selectedPharmacy) return;
    await runAction(async () => {
      await updatePharmacy(selectedPharmacy.id, payload);
      await refreshPharmacyData(selectedPharmacy.id);
    }, "Izmjene su sačuvane.");
  };

  const handleDeletePharmacy = async () => {
    if (!selectedPharmacy) return;
    const confirmed = window.confirm(`Obrisati apoteku "${selectedPharmacy.name}"?`);
    if (!confirmed) return;
    await runAction(async () => {
      await deletePharmacy(selectedPharmacy.id);
      setSearchResults((prev) => prev.filter((p) => p.id !== selectedPharmacy.id));
      setSelectedPharmacy(null);
      setWorkingHours([]);
      setDuties([]);
      setExceptions([]);
    }, "Apoteka je obrisana.");
  };

  const handleAddWorkingHours = async (payload: WorkingHoursPayload) => {
    if (!selectedPharmacy) return;
    await runAction(async () => {
      await createWorkingHours(selectedPharmacy.id, payload);
      setWorkingHours(await getWorkingHours(selectedPharmacy.id));
    }, "Radno vrijeme je dodato.");
  };

  const handleUpdateWorkingHours = async (
    whId: number,
    payload: Partial<WorkingHoursPayload>
  ) => {
    if (!selectedPharmacy) return;
    await runAction(async () => {
      await updateWorkingHours(selectedPharmacy.id, whId, payload);
      setWorkingHours(await getWorkingHours(selectedPharmacy.id));
    }, "Radno vrijeme je izmijenjeno.");
  };

  const handleDeleteWorkingHours = async (whId: number) => {
    if (!selectedPharmacy) return;
    await runAction(async () => {
      await deleteWorkingHours(selectedPharmacy.id, whId);
      setWorkingHours((prev) => prev.filter((wh) => wh.id !== whId));
    }, "Radno vrijeme je obrisano.");
  };

  const handleAddDuty = async (payload: DutyPayload) => {
    if (!selectedPharmacy) return;
    await runAction(async () => {
      await createDuty(selectedPharmacy.id, payload);
      setDuties(await getDutySchedules(selectedPharmacy.id));
    }, "Dežurstvo je dodato.");
  };

  const handleDeleteDuty = async (dutyId: number) => {
    if (!selectedPharmacy) return;
    await runAction(async () => {
      await deleteDuty(selectedPharmacy.id, dutyId);
      setDuties((prev) => prev.filter((d) => d.id !== dutyId));
    }, "Dežurstvo je obrisano.");
  };

  const handleAddException = async (payload: ScheduleExceptionPayload) => {
    if (!selectedPharmacy) return;
    await runAction(async () => {
      await createScheduleException(selectedPharmacy.id, payload);
      setExceptions(await getScheduleExceptions(selectedPharmacy.id));
    }, "Izuzetak je dodat.");
  };

  const handleUpdateException = async (
    exId: number,
    payload: Partial<ScheduleExceptionPayload>
  ) => {
    if (!selectedPharmacy) return;
    await runAction(async () => {
      await updateScheduleException(selectedPharmacy.id, exId, payload);
      setExceptions(await getScheduleExceptions(selectedPharmacy.id));
    }, "Izuzetak je izmijenjen.");
  };

  const handleUploadImage = async (file: File) => {
    if (!selectedPharmacy) return;
    await runAction(async () => {
      await uploadPharmacyImage(selectedPharmacy.id, file);
      await refreshPharmacyData(selectedPharmacy.id);
    }, "Slika apoteke je uploadovana.");
  };

  const handleRemoveImage = async () => {
    if (!selectedPharmacy) return;
    await runAction(async () => {
      await removePharmacyImage(selectedPharmacy.id);
      await refreshPharmacyData(selectedPharmacy.id);
    }, "Slika apoteke je uklonjena.");
  };

  const handleDeleteException = async (exId: number) => {
    if (!selectedPharmacy) return;
    await runAction(async () => {
      await deleteScheduleException(selectedPharmacy.id, exId);
      setExceptions((prev) => prev.filter((e) => e.id !== exId));
    }, "Izuzetak je obrisan.");
  };

  return (
    <div>
      <div className="mb-4">
        <AdminNotice notice={notice} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
        <PharmacySearchPanel
          searchTerm={searchTerm}
          results={searchResults}
          selectedPharmacy={selectedPharmacy}
          isSearching={isSearching || isSelecting}
          onSearchChange={setSearchTerm}
          onSelectPharmacy={selectPharmacy}
        />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <PharmacyEditor
            key={selectedPharmacy?.id ?? "new-pharmacy"}
            selectedPharmacy={selectedPharmacy}
            cities={cities}
            isBusy={isBusy || isSelecting}
            onCreatePharmacy={handleCreatePharmacy}
            onUpdatePharmacy={handleUpdatePharmacy}
            onDeletePharmacy={handleDeletePharmacy}
          />
          <WorkingHoursManager
            pharmacy={selectedPharmacy}
            workingHours={workingHours}
            isBusy={isBusy || isSelecting}
            onAdd={handleAddWorkingHours}
            onUpdate={handleUpdateWorkingHours}
            onDelete={handleDeleteWorkingHours}
          />
          <DutyManager
            pharmacy={selectedPharmacy}
            duties={duties}
            isBusy={isBusy || isSelecting}
            onAdd={handleAddDuty}
            onDelete={handleDeleteDuty}
          />
          <ScheduleExceptionsManager
            pharmacy={selectedPharmacy}
            exceptions={exceptions}
            isBusy={isBusy || isSelecting}
            onAdd={handleAddException}
            onUpdate={handleUpdateException}
            onDelete={handleDeleteException}
          />
          <PharmacyImageUploadPanel
            pharmacy={selectedPharmacy}
            isBusy={isBusy || isSelecting}
            onUploadImage={handleUploadImage}
            onRemoveImage={handleRemoveImage}
          />
        </div>
      </div>
    </div>
  );
}
