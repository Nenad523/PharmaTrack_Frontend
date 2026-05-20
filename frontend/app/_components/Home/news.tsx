import { ExternalLink } from "lucide-react";
import { apiUrl } from "@/lib/api";

type NewsItem = {
  articleId: string;
  title: string;
  description: string | null;
  link: string;
  imageUrl: string | null;
  source: string | null;
  sourceUrl: string | null;
  category: string | null;
  language: string | null;
  country: string | null;
  publishedAt: string;
};

type NewsApiResponse = {
  data?: NewsItem[];
};

const formatPublishedDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("sr-Latn-ME", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const loadNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await fetch(apiUrl("/api/v1/news?limit=4"), {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as NewsApiResponse;
    return Array.isArray(payload.data) ? payload.data : [];
  } catch {
    return [];
  }
};

export default async function HomeNews() {
  const news = await loadNews();

  return (
    <section className="border-t border-slate-200/70 bg-white/70">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Aktuelnosti iz svijeta zdravlja
            </h2>
          </div>
        </div>

        {news.length > 0 ? (
          <div className="mt-4 grid gap-2.5 md:mt-8 md:grid-cols-2 md:gap-5">
            {news.map((item, index) => (
              <article
                key={item.articleId}
                className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${
                  index > 1 ? "hidden md:block" : ""
                }`}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-28 w-full object-cover sm:h-44 md:h-44"
                  />
                )}

                <div className="p-3.5 sm:p-5 md:p-5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] sm:gap-3 sm:text-xs">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-600 sm:px-3">
                      {item.category ?? "Zdravlje"}
                    </span>
                    <span className="text-slate-400">
                      {formatPublishedDate(item.publishedAt)}
                    </span>
                  </div>

                  <h3 className="mt-2.5 text-base font-semibold leading-5 text-slate-900 md:mt-3 md:text-lg md:leading-7">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors hover:text-blue-600"
                    >
                      {item.title}
                    </a>
                  </h3>

                  {item.description && (
                    <p className="mt-1.5 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6 md:mt-2 md:text-sm md:leading-6">
                      {item.description}
                    </p>
                  )}

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-blue-600 sm:text-sm md:mt-4"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {item.source
                      ? `Otvori na ${item.source}`
                      : "Otvori originalnu vijest"}
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white/80 p-5 text-sm leading-6 text-slate-600 md:mt-8 md:p-6 md:leading-7">
            Vijesti trenutno nijesu dostupne. Nakon prvog uspjesnog backend
            sinhronizovanja pojavice se ovdje automatski.
          </div>
        )}
      </div>
    </section>
  );
}
