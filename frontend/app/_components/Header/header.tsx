"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const shouldHideNotifications = user?.role === "admin";
  const visibleBaseNavItems = shouldHideNotifications
    ? baseNavItems.filter((item) => item.href !== "/api/v1/notifications")
    : baseNavItems;
  const navItems =
    user?.role === "admin"
      ? [
          ...visibleBaseNavItems,
          { label: "Admin", href: "/api/v1/admin", icon: ShieldCheck },
        ]
      : visibleBaseNavItems;

  const nameParts = useMemo(
    () => user?.fullName.trim().split(/\s+/).filter(Boolean) ?? [],
    [user?.fullName]
  );
  const initials = useMemo(() => {
    if (nameParts.length === 0) return "PT";

    return nameParts
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [nameParts]);
  const firstName = nameParts[0] ?? user?.fullName ?? "";
  const lastName =
    nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Nije dostupno";

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("touchstart", handlePointerDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isMobileMenuOpen]);

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
            <div ref={mobileMenuRef} className="relative sm:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white pl-2 pr-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                aria-expanded={isMobileMenuOpen}
                aria-haspopup="menu"
                aria-label="Profil meni"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {initials}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition ${
                    isMobileMenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {isMobileMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+0.6rem)] z-50 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_45px_-20px_rgba(15,23,42,0.35)]">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      Prijavljeni korisnik
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {firstName}
                      </p>
                      <p className="text-sm text-slate-600">{lastName}</p>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLogoutClick?.();
                      }}
                      disabled={logoutLoading}
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <LogOut className="h-4 w-4" />
                      {logoutLoading ? "Odjava..." : "Odjava"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 sm:flex">
              <UserRound className="h-4 w-4 shrink-0 text-blue-600" />
              <span className="max-w-[8rem] truncate">{user.fullName}</span>
            </div>

            <button
              type="button"
              onClick={onLogoutClick}
              disabled={logoutLoading}
              className="hidden h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60 sm:inline-flex"
            >
              <LogOut className="h-4 w-4" />
              <span>{logoutLoading ? "Odjava..." : "Odjava"}</span>
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
