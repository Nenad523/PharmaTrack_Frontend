import { apiUrl } from "@/lib/api";
import { clearCachedCsrfToken, getCsrfToken } from "../../../auth/api";

export type NotificationItem = {
  id: number;
  dose_id: number;
  medication_name: string;
  strength: string;
  is_notified: number;
  created_at: string;
};

type NotificationsResponse = {
  success?: boolean;
  data?: NotificationItem[];
  count?: number;
  message?: string | string[];
};

async function responseMessage(response: Response) {
  try {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = (await response.json()) as {
        error?: { message?: string | string[] };
        message?: string | string[];
      };
      const message = data.error?.message ?? data.message;

      if (Array.isArray(message)) {
        return message.join(", ");
      }

      return message || "Zahtjev nije uspio.";
    }

    return (await response.text()) || "Zahtjev nije uspio.";
  } catch {
    return "Zahtjev nije uspio.";
  }
}

async function notificationsRequest<T>(
  path: string,
  options: RequestInit & { json?: unknown } = {}
) {
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
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function getMyNotifications() {
  const data = await notificationsRequest<NotificationsResponse>(
    "/api/v1/notifications"
  );

  return Array.isArray(data.data) ? data.data : [];
}

export async function deleteNotification(notificationId: number) {
  return notificationsRequest<{ success: boolean }>(
    `/api/v1/notifications/${notificationId}`,
    {
      method: "DELETE",
    }
  );
}

export async function subscribeToNotifications(doseIds: number[]) {
  const uniqueDoseIds = Array.from(
    new Set(doseIds.filter((doseId) => Number.isInteger(doseId) && doseId > 0))
  );

  const results = await Promise.allSettled(
    uniqueDoseIds.map((doseId) =>
      notificationsRequest<{ success: boolean; id: number }>(
        "/api/v1/notifications",
        {
          method: "POST",
          json: { dose_id: doseId },
        }
      )
    )
  );

  const successfulCount = results.filter(
    (result) => result.status === "fulfilled"
  ).length;
  const failedMessages = results.flatMap((result) => {
    if (result.status === "fulfilled") {
      return [];
    }

    return [
      result.reason instanceof Error
        ? result.reason.message
        : "Pretplata nije uspjela.",
    ];
  });

  return {
    successfulCount,
    failedMessages,
  };
}
