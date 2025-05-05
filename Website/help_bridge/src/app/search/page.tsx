import { Suspense } from "react";
import SearchPage from "./SearchPage"; // Move logic to its own client component

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchPage />
    </Suspense>
  );
}