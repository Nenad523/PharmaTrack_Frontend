import Link from "next/link";
import { quickActions } from "./data";

export default function HomeQuickActions() {
  return (
    <section className="mx-auto grid max-w-6xl gap-4 px-6 md:grid-cols-2 xl:grid-cols-4">
      {quickActions.map((action) => {
        const Icon = action.icon;

        if (action.locked) {
          return (
            <div
              key={action.title}
              className="rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <Icon className="h-5 w-5 text-slate-400" />
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                  Potrebna prijava
                </span>
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-900">
                {action.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {action.description}
              </p>
            </div>
          );
        }

        return (
          <Link
            key={action.title}
            href={action.href}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
          >
            <Icon className="h-5 w-5 text-blue-600" />
            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              {action.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {action.description}
            </p>
          </Link>
        );
      })}
    </section>
  );
}
