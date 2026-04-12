"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, Search } from "lucide-react";

const navItems = [
  { label: "Početna", href: "/api/v1/home", icon: Home },
  { label: "Pretraga", href: "/api/v1/medications", icon: Search },
  { label: "Dežurne", href: "/api/v1/pharmacies/duty", icon: Clock },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 backdrop-blur-sm">
      
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "text-blue-600 bg-blue-100"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

    </nav>
  );
}
