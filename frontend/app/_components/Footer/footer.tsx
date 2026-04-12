import { Pill } from "lucide-react";

export default function Footer() {
  return (
    <footer className="hidden md:block mt-auto border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Pill className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-bold text-gray-900">PharmaTrack</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Brzo pronađite ljekove u apotekama širom Crne Gore. Ažurirani podaci o dostupnosti i dežurnim apotekama.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wider">Servisi</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>Pretraga ljekova</li>
              <li>Dežurne apoteke</li>
              <li>Mapa apoteka</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wider">Kontakt</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>info@pharmatrack.me</li>
              <li>+382 20 123 456</li>
              <li>Podgorica, Crna Gora</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-6 pt-4">
          <p className="text-[10px] text-gray-500 text-center">
            © {new Date().getFullYear()} PharmaTrack. Sva prava zadržana.
          </p>
        </div>
      </div>
    </footer>
  );
}
