export default function HomePromoVideo() {
  const videoUrl = process.env.NEXT_PUBLIC_HOME_PROMO_VIDEO_URL;

  if (!videoUrl) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Pogledajte PharmaTrack u akciji
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Kratak prikaz kako aplikacija pomaže korisnicima da brže pronađu
            informacije o ljekovima i apotekama.
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <video
          className="home-promo-video aspect-video w-full bg-slate-950 object-cover"
          controls
          playsInline
          poster="/poster.png"
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
          Vaš pregledač ne podržava prikaz video sadržaja.
        </video>
      </div>
    </section>
  );
}
