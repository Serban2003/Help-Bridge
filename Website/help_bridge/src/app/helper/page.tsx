import { Suspense } from "react";
import HelperPage from "./HelperPage"; // Move logic to its own client component

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <HelperPage />
    </Suspense>
  );
}