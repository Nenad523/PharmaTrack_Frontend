export default function HomePromoVideo() {
  const videoUrl = process.env.NEXT_PUBLIC_HOME_PROMO_VIDEO_URL;

  if (!videoUrl) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-16">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Pogledajte PharmaTrack u akciji
          </h2>
          <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-600 sm:text-sm md:text-base md:leading-7">
            Kratak prikaz kako aplikacija pomaže korisnicima da brže pronađu
            informacije o ljekovima i apotekama.
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:mt-8 md:rounded-2xl">
        <video
          className="home-promo-video aspect-[4/3] w-full bg-slate-950 object-cover sm:aspect-video"
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
