import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

/**
 * Plus Jakarta Sans is the closest widely-available match to the reference:
 * a geometric grotesque that stays tight and confident at heavy weights,
 * which is what the display type on the home page depends on.
 */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spotted — Unternehmen, die man kennen sollte",
  description:
    "Eine kuratierte Auswahl von Schweizer KMU. Jedes Unternehmen wird vor der Aufnahme persönlich geprüft.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
