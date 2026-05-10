import { Pill } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:py-8">
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Pill className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-bold text-gray-900">PharmaTrack</span>
            </div>
            <p className="text-xs leading-6 text-gray-600">
              Brzo pronađite ljekove u apotekama širom Crne Gore. Ažurirani
              podaci o dostupnosti i dežurnim apotekama.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:contents">
            <div>
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-900 md:mb-3 md:text-xs">
                Servisi
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-600 md:space-y-2">
                <li>Pretraga ljekova</li>
                <li>Dežurne apoteke</li>
                <li>Mapa apoteka</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-900 md:mb-3 md:text-xs">
                Kontakt
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-600 md:space-y-2">
                <li>info@pharmatrack.me</li>
                <li>+382 20 123 456</li>
                <li>Podgorica, Crna Gora</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-gray-200 pt-4 md:mt-6">
          <p className="text-center text-[10px] text-gray-500">
            © {new Date().getFullYear()} PharmaTrack. Sva prava zadržana.
          </p>
        </div>
      </div>
    </footer>
  );
}
