"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { ImageUp, Trash2 } from "lucide-react";
import type { PharmacyDetails } from "./pharmacy_types";

type PharmacyImageUploadPanelProps = {
  pharmacy: PharmacyDetails | null;
  isBusy: boolean;
  onUploadImage: (file: File) => Promise<void>;
  onRemoveImage: () => Promise<void>;
};

export function PharmacyImageUploadPanel({
  pharmacy,
  isBusy,
  onUploadImage,
  onRemoveImage,
}: PharmacyImageUploadPanelProps) {
  const [file, setFile] = useState<File | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;
    await onUploadImage(file);
    setFile(null);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <h2 className="text-base font-bold text-slate-950">Slika apoteke</h2>
        <p className="mt-1 text-sm text-slate-500">
          Upload slike za izabranu apoteku.
        </p>
      </div>

      {!pharmacy ? (
        <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500">
          Izaberi apoteku prije upload-a slike.
        </p>
      ) : (
        <>
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            {pharmacy.img_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pharmacy.img_url}
                alt={pharmacy.name}
                className="h-40 w-full object-cover"
              />
            ) : (
              <div className="grid h-40 place-items-center text-sm font-medium text-slate-500">
                Slika nije dodata.
              </div>
            )}
          </div>

          <form onSubmit={submit} className="mt-4 space-y-3">
            {pharmacy.img_url && (
              <button
                type="button"
                disabled={isBusy}
                onClick={onRemoveImage}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                Ukloni sliku
              </button>
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={onFileChange}
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-bold file:text-slate-700 hover:file:bg-slate-200"
            />
            <button
              type="submit"
              disabled={isBusy || !file}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-blue-200 px-4 text-sm font-bold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ImageUp className="h-4 w-4" />
              Upload slike
            </button>
          </form>
        </>
      )}
    </section>
  );
}
