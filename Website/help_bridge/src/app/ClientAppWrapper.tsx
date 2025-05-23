"use client";

import { useAuth } from "./models/AuthContext";
import MainNavbar from "./components/MainNavbar";
import Footer from "./components/Footer";
import { GlobalSpinner } from "./components/GlobalSpinner";

export default function ClientAppWrapper({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <GlobalSpinner />
    );
  }

  return (
    <>
      <MainNavbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
