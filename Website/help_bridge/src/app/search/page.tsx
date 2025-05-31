import { Suspense } from "react";
import SearchPage from "./SearchPage"; // Move logic to its own client component

// This file is a wrapper for the SearchPage component to enable Suspense
export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchPage />
    </Suspense>
  );
}