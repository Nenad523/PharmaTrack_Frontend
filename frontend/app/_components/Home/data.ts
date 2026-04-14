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
      href?: never;
    };

export const quickActions: QuickAction[] = [
  {
    title: "Pretraga ljekova",
    description: "Pronađite ljekove u apotekama širom Crne Gore.",
    icon: Search,
    href: "/api/v1/medications",
  },
  {
    title: "Dežurne apoteke",
    description: "Pogledajte raspored dežurnih apoteka po gradu.",
    icon: Clock3,
    href: "/api/v1/pharmacies/duty",
  },
  {
    title: "Notifikacije",
    description: "Primajte obavještenja o dostupnosti ljekova.",
    icon: Bell,
    locked: true,
  },
  {
    title: "Pretraga po simptomima",
    description: "Pronađite odgovarajuće ljekove prema simptomima.",
    icon: Stethoscope,
    locked: true,
  },
];

export const features = [
  {
    title: "Pretraga ljekova",
    description:
      "Pretražite bazu podataka ljekova dostupnih u Crnoj Gori po nazivu, dozi ili aktivnoj supstanci.",
    icon: Search,
  },
  {
    title: "Lokacije apoteka",
    description:
      "Pronađite najbliže apoteke koje imaju traženi lijek na zalihama sa kontakt informacijama.",
    icon: MapPin,
  },
  {
    title: "Dežurne apoteke",
    description:
      "Provjerite koje apoteke su dežurne danas ili bilo koji dan u mjesecu putem kalendara.",
    icon: Clock3,
  },
  {
    title: "Pouzdani podaci",
    description:
      "Podaci se redovno ažuriraju u saradnji sa apotekama i nadležnim institucijama.",
    icon: ShieldCheck,
  },
];

export const news = [
  {
    category: "Globalno zdravlje",
    date: "27. mar 2026",
    title: "SZO upozorava na porast otpornosti bakterija na antibiotike",
    description:
      "Svjetska zdravstvena organizacija objavila novi izvještaj o antimikrobnoj rezistenciji koja prijeti globalnom zdravlju.",
    source: "WHO",
  },
  {
    category: "Istraživanja",
    date: "25. mar 2026",
    title:
      "Nova studija: Vitamin D značajno smanjuje rizik od respiratornih infekcija",
    description:
      "Istraživači sa Univerziteta u Oslu potvrdili preventivno djelovanje vitamina D tokom zimskih mjeseci.",
    source: "The Lancet",
  },
  {
    category: "Farmacija",
    date: "24. mar 2026",
    title:
      "Evropska agencija za ljekove odobrila novu terapiju za dijabetes tipa 2",
    description:
      "EMA je izdala pozitivno mišljenje za inovativni lijek koji kombinuje dva mehanizma djelovanja.",
    source: "EMA",
  },
  {
    category: "Lokalno",
    date: "22. mar 2026",
    title: "Crna Gora uvodi digitalne recepte od jula 2026",
    description:
      "Ministarstvo zdravlja najavljuje prelazak na elektronski sistem propisivanja ljekova.",
    source: "Vijesti",
  },
];
