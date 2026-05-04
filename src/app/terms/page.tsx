import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Terms of Service — Connect" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">List your business</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-10 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to home
        </Link>

        {/* Placeholder notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-10">
          <p className="text-sm font-semibold text-amber-800 mb-1">Draft — not ready for launch</p>
          <p className="text-sm text-amber-700">
            This page needs real Terms of Service before the site goes live.
            Replace this placeholder with terms that cover user accounts,
            business listings, acceptable use, and governing law (Swiss law).
          </p>
        </div>

        <h1 className="text-3xl font-semibold text-neutral-900 mb-4">Terms of Service</h1>
        <p className="text-neutral-500 leading-relaxed">
          Full terms of service content to be written before launch.
        </p>
      </main>

      <Footer />
    </div>
  );
}
