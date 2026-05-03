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
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Aktuelnosti iz svijeta zdravlja
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              Vijesti se preuzimaju preko backend servisa i osvjezavaju jednom
              dnevno, bez direktnih poziva korisnika prema spoljnom API-ju.
            </p>
          </div>
        </div>

        {news.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {news.map((item) => (
              <article
                key={item.articleId}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-600">
                    {item.category ?? "Zdravlje"}
                  </span>
                  <span className="text-slate-400">
                    {formatPublishedDate(item.publishedAt)}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-semibold leading-8 text-slate-900">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                    {item.description}
                  </p>
                )}

                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
                >
                  <ExternalLink className="h-4 w-4" />
                  {item.source ? `Otvori na ${item.source}` : "Otvori originalnu vijest"}
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/80 p-6 text-sm leading-7 text-slate-600">
            Vijesti trenutno nijesu dostupne. Nakon prvog uspjesnog backend
            sinhronizovanja pojavice se ovdje automatski.
          </div>
        )}
      </div>
    </section>
  );
}
