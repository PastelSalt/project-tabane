import type { Metadata } from "next";
import { JetBrains_Mono, Nunito } from "next/font/google";
import { Header } from "@/components/shell";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tabane",
    template: "%s · Tabane",
  },
  description: "Moeko Works' private library of reusable UI/UX and backend concepts.",
  // Private site: search engines must skip every page
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${nunito.variable} ${jetbrains.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        {children}
      </body>
    </html>
  );
}
