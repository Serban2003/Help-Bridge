import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainNavbar from "./components/MainNavbar";
import Footer from "./components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from "./models/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HelpBridge",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} `}>
        <AuthProvider>
        <MainNavbar />
        
        <main>{children}</main>
        </AuthProvider>
        <Footer/>
      </body>
    </html>
  );
}
