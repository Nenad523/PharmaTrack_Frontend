"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Home, Pill } from "lucide-react";

const navItems = [
  { label: "Početna", href: "/api/v1/home", icon: Home },
  { label: "Pretraga", href: "/api/v1/medications", icon: Pill },
  { label: "Dežurne apoteke", href: "/api/v1/pharmacies/duty", icon: Clock },
];

type HeaderProps = {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
};

export function Header({ onLoginClick, onRegisterClick }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link href="/api/v1/home" className="flex items-center gap-2">
          <Pill className="w-5 h-5 text-blue-500" />
          <span className="text-xl font-bold text-gray-900">
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-base font-medium transition ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:text-black hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoginClick}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-600 cursor-pointer"
          >
            Prijava
          </button>
          <button
            type="button"
            onClick={onRegisterClick}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 cursor-pointer"
          >
            Registracija
          </button>
        </div>
      </div>
    </header>
  );
}
