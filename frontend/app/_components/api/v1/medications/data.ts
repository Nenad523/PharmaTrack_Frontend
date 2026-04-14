import { Medicine } from "./types";

export const popularMedicines = [
  "Paracetamol",
  "Ibuprofen",
  "Amoksicilin",
  "Aspirin",
  "Brufen",
  "Andol",
  "Panklav",
];

export const medicines: Medicine[] = [
  {
    id: 1,
    name: "Paracetamol",
    description:
      "Analgetik i antipiretik za ublažavanje bola i snižavanje temperature.",
    doses: ["Sve", "500 mg", "1000 mg", "1500 mg"],
    activeSubstance: "Paracetamol",
    warning:
      "Ne prelaziti preporučenu dnevnu dozu. Koristiti oprezno kod bolesti jetre.",
  },
  {
    id: 2,
    name: "Paracetamol Extra",
    description: "Paracetamol sa kofeinom za pojačano djelovanje protiv bola.",
    doses: ["Sve", "500 mg"],
    activeSubstance: "Paracetamol + kofein",
    warning:
      "Sadrži kofein. Izbjegavati kasno uveče i kod osjetljivosti na stimulanse.",
  },
  {
    id: 3,
    name: "Ibuprofen",
    description: "Nesteroidni antiinflamatorni lijek za bol i upale.",
    doses: ["Sve", "200 mg", "400 mg"],
    activeSubstance: "Ibuprofen",
    warning:
      "Ne preporučuje se osobama sa čirom na želucu bez savjeta ljekara.",
  },
  {
    id: 4,
    name: "Brufen",
    description: "Lijek za ublažavanje bolova, upala i povišene temperature.",
    doses: ["Sve", "200 mg", "400 mg", "600 mg"],
    activeSubstance: "Ibuprofen",
    warning:
      "Koristiti oprezno kod problema sa želucem, bubrezima i pritiskom.",
  },
];
