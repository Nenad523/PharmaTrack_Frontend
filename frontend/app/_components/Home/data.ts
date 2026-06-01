import {
  Bell,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

export type QuickAction =
  | {
      title: string;
      description: string;
      icon: typeof Search;
      href: string;
      locked?: false;
    }
  | {
      title: string;
      description: string;
      icon: typeof Search;
      locked: true;
      href?: string;
    };

export const quickActions: QuickAction[] = [
  {
    title: "Pretraga ljekova",
    description: "Pronadjite ljekove u apotekama sirom Crne Gore.",
    icon: Search,
    href: "/api/v1/medications",
  },
  {
    title: "Dezurne apoteke",
    description: "Pogledajte raspored dezurnih apoteka po gradu.",
    icon: Clock3,
    href: "/api/v1/pharmacies/duty",
  },
  {
    title: "Notifikacije",
    description: "Primajte obavjestenja o dostupnosti ljekova.",
    icon: Bell,
    locked: true,
    href: "/api/v1/notifications",
  },
  {
    title: "Pretraga po simptomima",
    description: "Pronadjite odgovarajuce ljekove prema simptomima.",
    icon: Stethoscope,
    locked: true,
    href: "/api/v1/medications?mode=symptom",
  },
];

export const features = [
  {
    title: "Pretraga ljekova",
    description:
      "Pretrazite bazu podataka ljekova dostupnih u Crnoj Gori po nazivu, dozi ili aktivnoj supstanci.",
    icon: Search,
  },
  {
    title: "Lokacije apoteka",
    description:
      "Pronadjite najblize apoteke koje imaju trazeni lijek na zalihama sa kontakt informacijama.",
    icon: MapPin,
  },
  {
    title: "Dezurne apoteke",
    description:
      "Provjerite koje apoteke su dezurne danas ili bilo koji dan u mjesecu putem kalendara.",
    icon: Clock3,
  },
  {
    title: "Pouzdani podaci",
    description:
      "Podaci se redovno azuriraju u saradnji sa apotekama i nadleznim institucijama.",
    icon: ShieldCheck,
  },
];
