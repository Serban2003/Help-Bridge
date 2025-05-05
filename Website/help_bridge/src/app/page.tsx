"use client";

import styles from "./page.module.css";
import Banner from "./components/Banner";
import MissionSection from "./components/MissionSection";
import OfferSection from "./components/OffersSection";
import WhyChooseUsSection from "./components/WhyChooseUsSection";

export default function Home() {
  return (
    <div className={styles.page}>
      <Banner
          imageUrl="/images/consulting_banner.jpeg"
          title="Expert advice made easy - book, connect, grow"
          buttonText="Book a consultation"
          onClick={() => console.log("CTA clicked!")}
        />
      <main className={styles.main}>
        <div className="px-md-5 px-2">
        <p className="fs-1 fw-bold mb-2 text-center">About HelpBridge</p>
        <p className="fs-5 text-muted text-center">Connecting you with trusted financial, psychological, and IT consultants!</p>
        </div>
        <MissionSection/>
        <OfferSection/>
        <WhyChooseUsSection/>
      </main>
    </div>
  );
}
