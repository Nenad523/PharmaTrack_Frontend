"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Home, Search } from "lucide-react";

const navItems = [
  { label: "Početna", href: "/api/v1/home", icon: Home },
  { label: "Pretraga", href: "/api/v1/medications", icon: Search },
  { label: "Dežurne", href: "/api/v1/pharmacies/duty", icon: Clock },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 pb-[max(0.35rem,env(safe-area-inset-bottom))] backdrop-blur-sm md:hidden">
      <div className="mx-auto flex h-15 max-w-md items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[82px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:text-slate-900"
              }`}
            >
              <item.icon className="h-4.5 w-4.5" />
              <span className="text-[11px] font-semibold leading-4">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
