"use client";

import Link from "next/link";
import { useAuth } from "../auth/AuthContext";
import { quickActions } from "./data";

export default function HomeQuickActions() {
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);
  const activeCardClassName =
    "cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6";

  return (
    <section className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 sm:px-6 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
      {quickActions.map((action) => {
        const Icon = action.icon;
        const isLocked = action.locked && !isLoggedIn;

        if (isLocked) {
          return (
            <div
              key={action.title}
              className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm sm:p-6"
            >
              <div className="flex items-start justify-between gap-2">
                <Icon className="h-4 w-4 text-slate-400 sm:h-5 sm:w-5" />
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 sm:px-2.5 sm:py-1 sm:text-[11px]">
                  Prijava
                </span>
              </div>
              <h2 className="mt-3 text-base font-semibold leading-5 text-slate-900 sm:mt-5 sm:text-lg">
                {action.title}
              </h2>
              <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
                {action.description}
              </p>
            </div>
          );
        }

        if (action.locked) {
          if (action.href) {
            return (
              <Link
                key={action.title}
                href={action.href}
                className={activeCardClassName}
              >
                <Icon className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                <h2 className="mt-3 text-base font-semibold leading-5 text-slate-900 sm:mt-5 sm:text-lg">
                  {action.title}
                </h2>
                <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
                  {action.description}
                </p>
              </Link>
            );
          }

          return (
            <article
              key={action.title}
              className={activeCardClassName}
            >
              <Icon className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
              <h2 className="mt-3 text-base font-semibold leading-5 text-slate-900 sm:mt-5 sm:text-lg">
                {action.title}
              </h2>
              <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
                {action.description}
              </p>
            </article>
          );
        }

        return (
          <Link
            key={action.title}
            href={action.href}
            className={activeCardClassName}
          >
            <Icon className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
            <h2 className="mt-3 text-base font-semibold leading-5 text-slate-900 sm:mt-5 sm:text-lg">
              {action.title}
            </h2>
            <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
              {action.description}
            </p>
          </Link>
        );
      })}
    </section>
  );
}
