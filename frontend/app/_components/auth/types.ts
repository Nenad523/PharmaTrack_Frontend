export type AuthUser = {
  id: number;
  fullName: string;
  email: string;
  role?: string;
  pharmacy_id?: number | null;
};

type RawAuthUser = {
  id?: number | string;
  fullName?: unknown;
  email?: unknown;
  role?: unknown;
  pharmacy_id?: unknown;
};

export function normalizeAuthUser(value: unknown): AuthUser | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const user = value as RawAuthUser;
  const id = Number(user.id);

  if (
    !Number.isFinite(id) ||
    typeof user.fullName !== "string" ||
    typeof user.email !== "string"
  ) {
    return null;
  }

  return {
    id,
    fullName: user.fullName,
    email: user.email,
    role: typeof user.role === "string" ? user.role : undefined,
    pharmacy_id:
      typeof user.pharmacy_id === "number" || user.pharmacy_id === null
        ? user.pharmacy_id
        : undefined,
  };
}
