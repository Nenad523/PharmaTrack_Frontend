import { Pill } from "lucide-react";


export default function SearchBarTitleText() {
    return (
        <div className="mb-8 flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-600 shadow-sm">
                    <Pill className="h-7 w-7" />
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Pretraga ljekova
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
                    Pronađite dostupne ljekove, odaberite 
                    željenu dozu i nastavite ka
                    pretrazi apoteka širom Crne Gore.
                </p>
            </div>
        </div>
    );
}