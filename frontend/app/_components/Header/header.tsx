"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Clock,
  Home,
  LogOut,
  Pill,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { AuthUser } from "../auth/types";

const baseNavItems = [
  { label: "Početna", href: "/api/v1/home", icon: Home },
  { label: "Pretraga", href: "/api/v1/medications", icon: Pill },
  { label: "Dežurne apoteke", href: "/api/v1/pharmacies/duty", icon: Clock },
  { label: "Notifikacije", href: "/api/v1/notifications", icon: Bell },
];

type HeaderProps = {
  user?: AuthUser | null;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onRegisterClick?: () => void;
  logoutLoading?: boolean;
};

export function Header({
  user,
  onLoginClick,
  onLogoutClick,
  onRegisterClick,
  logoutLoading,
}: HeaderProps) {
  const pathname = usePathname();
  const navItems =
    user?.role === "admin"
      ? [
          ...baseNavItems,
          { label: "Admin", href: "/api/v1/admin", icon: ShieldCheck },
        ]
      : baseNavItems;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link href="/api/v1/home" className="flex min-w-0 items-center gap-2">
          <Pill className="h-5 w-5 shrink-0 text-blue-500" />
          <span className="truncate text-lg font-bold text-gray-900 sm:text-xl">
            PharmaTrack
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-base font-medium transition ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {user ? (
          <div className="flex min-w-0 items-center gap-2">
            <div className="hidden min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 sm:flex">
              <UserRound className="h-4 w-4 shrink-0 text-blue-600" />
              <span className="max-w-[8rem] truncate">{user.fullName}</span>
            </div>

            <button
              type="button"
              onClick={onLogoutClick}
              disabled={logoutLoading}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">
                {logoutLoading ? "Odjava..." : "Odjava"}
              </span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLoginClick}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-600 sm:px-3.5 sm:text-sm"
            >
              Prijava
            </button>
            <button
              type="button"
              onClick={onRegisterClick}
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700 sm:px-3.5 sm:text-sm"
            >
              Registracija
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
