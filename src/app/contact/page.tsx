import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/shared/Footer";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Kontakt",
  description: "Fragen, Hinweise oder ein Unternehmen vorschlagen. Schreiben Sie uns.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <SiteHeader />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-accent transition-colors mb-10 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Zurück zur Startseite
        </Link>

        <h1 className="text-4xl text-neutral-900 tracking-tight mb-3">Kontakt</h1>
        <p className="text-lg text-neutral-600 leading-relaxed mb-10">
          Eine Frage, ein Hinweis, oder ein Unternehmen, das hierher gehört?
          Schreiben Sie uns. Wir lesen jede Nachricht und antworten so schnell
          wie möglich.
        </p>

        <ContactForm />
      </main>

      <Footer />
    </div>
  );
}
