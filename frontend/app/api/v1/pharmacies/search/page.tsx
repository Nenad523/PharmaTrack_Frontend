import { Suspense } from "react";
import PharmacySearchPage from "@/app/_components/api/v1/pharmacies/search/pharmacy_search_page";

export default function Page() {
  return (
    <Suspense>
      <PharmacySearchPage />
    </Suspense>
  );
}
