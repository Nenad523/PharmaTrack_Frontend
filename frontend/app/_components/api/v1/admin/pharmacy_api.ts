import { apiUrl } from "@/lib/api";
import { clearCachedCsrfToken, getCsrfToken } from "../../../auth/api";
import type {
  City,
  DutyEntry,
  DutyPayload,
  PharmacyDetails,
  PharmacyPayload,
  PharmacySearchResult,
  ScheduleExceptionEntry,
  ScheduleExceptionPayload,
  WorkingHoursEntry,
  WorkingHoursPayload,
} from "./pharmacy_types";

async function responseMessage(response: Response) {
  try {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = (await response.json()) as {
        error?: { message?: string | string[] };
        message?: string | string[];
      };
      const message = data.error?.message ?? data.message;
      if (Array.isArray(message)) return message.join(", ");
      return message || "Zahtjev nije uspio.";
    }
    return (await response.text()) || "Zahtjev nije uspio.";
  } catch {
    return "Zahtjev nije uspio.";
  }
}

async function adminRequest<T>(
  path: string,
  options: RequestInit & { json?: unknown } = {}
): Promise<T> {
  const method = options.method ?? "GET";
  const isSafeMethod = method === "GET" || method === "HEAD";

  const send = async (forceFreshToken = false) => {
    const headers = new Headers(options.headers);
    if (options.json !== undefined) headers.set("Content-Type", "application/json");
    if (!isSafeMethod) headers.set("X-CSRF-Token", await getCsrfToken(forceFreshToken));

    return fetch(apiUrl(path), {
      ...options,
      method,
      credentials: "include",
      headers,
      body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
    });
  };

  let response = await send();

  if (!response.ok) {
    const message = await responseMessage(response);
    if (!isSafeMethod && message.includes("CSRF token")) {
      clearCachedCsrfToken();
      response = await send(true);
      if (response.ok) return response.json() as Promise<T>;
      throw new Error(await responseMessage(response));
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

// ─── Pharmacies ─────────────────────────────────────────────────────────────

export async function searchPharmacies(name: string): Promise<PharmacySearchResult[]> {
  const data = await adminRequest<{ success: boolean; data: PharmacySearchResult[] }>(
    `/api/v1/admin/pharmacies?name=${encodeURIComponent(name)}`
  );
  return Array.isArray(data.data) ? data.data : [];
}

export async function getPharmacyById(id: number): Promise<PharmacyDetails> {
  const data = await adminRequest<{ success: boolean; data: PharmacyDetails }>(
    `/api/v1/admin/pharmacies/${id}`
  );
  return data.data;
}

export async function createPharmacy(payload: PharmacyPayload) {
  return adminRequest<{ success: boolean; id: number }>("/api/v1/admin/pharmacies", {
    method: "POST",
    json: payload,
  });
}

export async function updatePharmacy(id: number, payload: Partial<PharmacyPayload>) {
  return adminRequest<{ success: boolean }>(`/api/v1/admin/pharmacies/${id}`, {
    method: "PUT",
    json: payload,
  });
}

export async function deletePharmacy(id: number) {
  return adminRequest<{ success: boolean }>(`/api/v1/admin/pharmacies/${id}`, {
    method: "DELETE",
  });
}

// ─── Working Hours ───────────────────────────────────────────────────────────

export async function getWorkingHours(pharmacyId: number): Promise<WorkingHoursEntry[]> {
  const data = await adminRequest<{ success: boolean; data: WorkingHoursEntry[] }>(
    `/api/v1/admin/pharmacies/${pharmacyId}/working-hours`
  );
  return Array.isArray(data.data) ? data.data : [];
}

export async function createWorkingHours(pharmacyId: number, payload: WorkingHoursPayload) {
  return adminRequest<{ success: boolean; id: number }>(
    `/api/v1/admin/pharmacies/${pharmacyId}/working-hours`,
    { method: "POST", json: payload }
  );
}

export async function updateWorkingHours(
  pharmacyId: number,
  whId: number,
  payload: Partial<WorkingHoursPayload>
) {
  return adminRequest<{ success: boolean }>(
    `/api/v1/admin/pharmacies/${pharmacyId}/working-hours/${whId}`,
    { method: "PUT", json: payload }
  );
}

export async function deleteWorkingHours(pharmacyId: number, whId: number) {
  return adminRequest<{ success: boolean }>(
    `/api/v1/admin/pharmacies/${pharmacyId}/working-hours/${whId}`,
    { method: "DELETE" }
  );
}

// ─── Duty ────────────────────────────────────────────────────────────────────

export async function getDutySchedules(pharmacyId: number): Promise<DutyEntry[]> {
  const data = await adminRequest<{ success: boolean; data: DutyEntry[] }>(
    `/api/v1/admin/pharmacies/${pharmacyId}/duty`
  );
  return Array.isArray(data.data) ? data.data : [];
}

export async function createDuty(pharmacyId: number, payload: DutyPayload) {
  return adminRequest<{ success: boolean; id: number }>(
    `/api/v1/admin/pharmacies/${pharmacyId}/duty`,
    { method: "POST", json: payload }
  );
}

export async function deleteDuty(pharmacyId: number, dutyId: number) {
  return adminRequest<{ success: boolean }>(
    `/api/v1/admin/pharmacies/${pharmacyId}/duty/${dutyId}`,
    { method: "DELETE" }
  );
}

// ─── Schedule Exceptions ─────────────────────────────────────────────────────

export async function getScheduleExceptions(pharmacyId: number): Promise<ScheduleExceptionEntry[]> {
  const data = await adminRequest<{ success: boolean; data: ScheduleExceptionEntry[] }>(
    `/api/v1/admin/pharmacies/${pharmacyId}/schedule-exceptions`
  );
  return Array.isArray(data.data) ? data.data : [];
}

export async function createScheduleException(
  pharmacyId: number,
  payload: ScheduleExceptionPayload
) {
  return adminRequest<{ success: boolean; id: number }>(
    `/api/v1/admin/pharmacies/${pharmacyId}/schedule-exceptions`,
    { method: "POST", json: payload }
  );
}

export async function updateScheduleException(
  pharmacyId: number,
  exId: number,
  payload: Partial<ScheduleExceptionPayload>
) {
  return adminRequest<{ success: boolean }>(
    `/api/v1/admin/pharmacies/${pharmacyId}/schedule-exceptions/${exId}`,
    { method: "PUT", json: payload }
  );
}

export async function deleteScheduleException(pharmacyId: number, exId: number) {
  return adminRequest<{ success: boolean }>(
    `/api/v1/admin/pharmacies/${pharmacyId}/schedule-exceptions/${exId}`,
    { method: "DELETE" }
  );
}

// ─── Cities ──────────────────────────────────────────────────────────────────

export async function getCities(): Promise<City[]> {
  const response = await fetch(apiUrl("/api/v1/cities"));
  if (!response.ok) throw new Error("Greška pri dohvatanju gradova.");
  const data = (await response.json()) as { data?: City[] } | City[];
  if (Array.isArray(data)) return data;
  return Array.isArray(data.data) ? data.data : [];
}
