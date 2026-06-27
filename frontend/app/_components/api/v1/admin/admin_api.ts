import { apiUrl } from "@/lib/api";
import { clearCachedCsrfToken, getCsrfToken } from "../../../auth/api";
import type {
  ActiveIngredient,
  IngredientsResponse,
  MedicationDetails,
  MedicationDetailsResponse,
  MedicationDosesResponse,
  MedicationPayload,
  MedicationSearchResponse,
  MedicationSearchResult,
} from "./types";

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

    if (options.json !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    if (!isSafeMethod) {
      headers.set("X-CSRF-Token", await getCsrfToken(forceFreshToken));
    }

    return fetch(apiUrl(path), {
      ...options,
      method,
      credentials: "include",
      headers,
      body:
        options.json !== undefined ? JSON.stringify(options.json) : options.body,
    });
  };

  let response = await send();

  if (!response.ok) {
    const message = await responseMessage(response);

    if (!isSafeMethod && message.includes("CSRF token")) {
      clearCachedCsrfToken();
      response = await send(true);

      if (response.ok) {
        return response.json() as Promise<T>;
      }

      throw new Error(await responseMessage(response));
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function searchMedications(query: string) {
  const response = await fetch(
    apiUrl(`/api/v1/medication/search?name=${encodeURIComponent(query)}`)
  );

  if (!response.ok) {
    throw new Error(await responseMessage(response));
  }

  const data = (await response.json()) as MedicationSearchResponse;
  return Array.isArray(data.data) ? data.data : [];
}

export async function getMedicationDetails(id: number) {
  const response = await fetch(apiUrl(`/api/v1/medication/${id}`));

  if (!response.ok) {
    throw new Error(await responseMessage(response));
  }

  const data = (await response.json()) as MedicationDetailsResponse;
  return {
    ...data.data,
    activeIngredients: Array.isArray(data.data.activeIngredients)
      ? data.data.activeIngredients
      : [],
  } satisfies MedicationDetails;
}

export async function getMedicationDoses(id: number) {
  const response = await fetch(apiUrl(`/api/v1/medication/${id}/doses`));

  if (!response.ok) {
    throw new Error(await responseMessage(response));
  }

  const data = (await response.json()) as MedicationDosesResponse;
  return Array.isArray(data.data) ? data.data : [];
}

export async function getIngredients() {
  const data = await adminRequest<IngredientsResponse>("/api/v1/admin/ingredients");
  return Array.isArray(data.data) ? data.data : [];
}

export async function createMedication(payload: MedicationPayload) {
  return adminRequest<{ success: boolean; id: number }>("/api/v1/admin/medications", {
    method: "POST",
    json: payload,
  });
}

export async function updateMedication(id: number, payload: MedicationPayload) {
  return adminRequest<{ success: boolean }>(`/api/v1/admin/medications/${id}`, {
    method: "PUT",
    json: payload,
  });
}

export async function deleteMedication(id: number) {
  return adminRequest<{ success: boolean }>(`/api/v1/admin/medications/${id}`, {
    method: "DELETE",
  });
}

export async function createIngredient(name: string) {
  return adminRequest<{ success: boolean; id: number }>("/api/v1/admin/ingredients", {
    method: "POST",
    json: { name },
  });
}

export async function linkIngredients(
  medicationId: number,
  ingredientIds: number[]
) {
  return adminRequest<{ success: boolean }>(
    `/api/v1/admin/medications/${medicationId}/ingredients`,
    {
      method: "POST",
      json: { ingredientIds },
    }
  );
}

export async function unlinkIngredient(
  medicationId: number,
  ingredientId: number
) {
  return adminRequest<{ success: boolean }>(
    `/api/v1/admin/medications/${medicationId}/ingredients/${ingredientId}`,
    { method: "DELETE" }
  );
}

export async function createDoses(medicationId: number, strengths: string[]) {
  return adminRequest<{ success: boolean }>(
    `/api/v1/admin/medications/${medicationId}/doses`,
    {
      method: "POST",
      json: { strengths },
    }
  );
}

export async function deleteDose(medicationId: number, doseId: number) {
  return adminRequest<{ success: boolean }>(
    `/api/v1/admin/medications/${medicationId}/doses/${doseId}`,
    { method: "DELETE" }
  );
}

export async function updateDose(medicationId: number, doseId: number, is_refundable: boolean) {
  return adminRequest<{ success: boolean }>(
    `/api/v1/admin/medications/${medicationId}/doses/${doseId}`,
    { method: "PATCH", json: { is_refundable } }
  );
}

export async function uploadMedicationImage(
  medicationName: string,
  file: File
) {
  const formData = new FormData();
  formData.append("medicationName", medicationName);
  formData.append("file", file);

  const response = await fetch(apiUrl("/api/v1/upload/medication-image"), {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await responseMessage(response));
  }

  return response.json() as Promise<{
    medicationId: number;
    medicationName: string;
    imageUrl: string;
  }>;
}

export function ingredientOptions(
  ingredients: ActiveIngredient[],
  medication: MedicationDetails | null
) {
  const linkedIds = new Set(
    medication?.activeIngredients.map((ingredient) => ingredient.id) ?? []
  );

  return ingredients.filter((ingredient) => !linkedIds.has(ingredient.id));
}

export function normalizeMedicationResult(
  medication: MedicationSearchResult
): MedicationSearchResult {
  return {
    ...medication,
    description: medication.description ?? "",
  };
}

export function parseListInput(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
