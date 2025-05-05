"use client";

import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import HelperCard from "../components/HelperCard"; // ajustează calea dacă e nevoie

const helpers = [
  { name: "Alice", category: "IT", rating: 5, imageUrl: "/images/default_avatar.svg" },
  { name: "Bob", category: "Financial", rating: 4, imageUrl: "/images/default_avatar.svg" },
  { name: "Cara", category: "Psychological", rating: 5, imageUrl: "/images/default_avatar.svg" },
  { name: "David", category: "IT", rating: 3, imageUrl: "/images/default_avatar.svg" }
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const filteredHelpers = helpers.filter(h => h.category === category);

  return (
    <div className={styles.wrapper}>
      <img
        src="/images/helpers_page.svg"
        alt="Illustration"
        className={styles.illustration}
      />

      <h1 className={styles.title}>Find the Right Expert for You</h1>
      <h2 className={styles.subtitle}>Choose Your Helper</h2>

      <div className={styles.grid}>
        {filteredHelpers.length > 0 ? (
          filteredHelpers.map((h, idx) => (
            <HelperCard
              key={idx}
              name={h.name}
              category={h.category}
              rating={h.rating}
              imageUrl={h.imageUrl}
            />
          ))
        ) : (
          <>
            <div className={styles.card}>Helpers will appear here</div>
            <div className={styles.card}></div>
          </>
        )}
      </div>
    </div>
  );
}
