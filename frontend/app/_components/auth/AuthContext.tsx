"use client";

import { createContext, useContext } from "react";
import type { AuthUser } from "./types";

type AuthContextValue = {
  user: AuthUser | null;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
});

export function AuthProvider({
  children,
  user,
}: AuthContextValue & { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
