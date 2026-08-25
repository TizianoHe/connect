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

/**
 * The title template is what keeps every page tab reading "Kontakt | Spotted"
 * without each page repeating the brand name. Page files set a bare title.
 */
export const metadata: Metadata = {
  title: {
    default: "Spotted. Unternehmen, die man kennen sollte.",
    template: "%s | Spotted",
  },
  description:
    "Schweizer KMU finden. Jedes Profil wird geprüft, bevor es online geht, damit auch kleinere Unternehmen online gefunden werden.",
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
