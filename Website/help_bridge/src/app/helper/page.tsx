import { Suspense } from "react";
import HelperPage from "./HelperPage"; // Move logic to its own client component

// This file is a wrapper for the HelperPage component to enable Suspense
export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <HelperPage />
    </Suspense>
  );
}