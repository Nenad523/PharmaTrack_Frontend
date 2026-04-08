"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Home, Pill } from "lucide-react";

const navItems = [
  { label: "Početna", href: "/api/v1/home", icon: Home },
  { label: "Pretraga", href: "/api/v1/medications", icon: Pill },
  { label: "Dežurne apoteke", href: "/api/v1/pharmacies/duty", icon: Clock },
];

export function Header() {  
  const pathname = usePathname();

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/api/v1/home" className="flex items-center gap-2">
          <Pill className="w-5 h-5 text-blue-500" />
          <span className="text-xl font-bold text-gray-900">
            PharmaTrack
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
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

      </div>
    </header>
  );
}