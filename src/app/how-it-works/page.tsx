import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";

export const metadata = { title: "How it works — Spotted" };

export default function HowItWorksPage() {
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

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-10 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to home
        </Link>

        <h1 className="text-3xl font-semibold text-neutral-900 mb-4">How Spotted works</h1>
        <p className="text-neutral-500 leading-relaxed mb-12 max-w-2xl">
          Spotted is a directory of Swiss small businesses where clients can browse, discover, and contact them directly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">For businesses</h2>
            <div className="space-y-7">
              <div>
                <p className="font-medium text-neutral-900 mb-1">1. Create your profile</p>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Sign up for free and build a profile that shows your work, your services, and who you are. No templates, no marketing speak — just a clear, honest presentation of what you do.
                </p>
              </div>
              <div>
                <p className="font-medium text-neutral-900 mb-1">2. Get found by the right clients</p>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Your profile appears when clients browse your category or search for what you offer. Clients see businesses based on relevance, not on who paid for visibility.
                </p>
              </div>
              <div>
                <p className="font-medium text-neutral-900 mb-1">3. Receive direct enquiries</p>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  When a client wants to work with you, they contact you directly. There&apos;s no middleman, no commission, and no algorithm deciding who gets seen.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">For clients</h2>
            <div className="space-y-7">
              <div>
                <p className="font-medium text-neutral-900 mb-1">1. Browse local businesses</p>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Search by category, location, or keyword to discover Swiss businesses near you.
                </p>
              </div>
              <div>
                <p className="font-medium text-neutral-900 mb-1">2. Read real profiles</p>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Each profile gives you a clear picture of what a business does, what they&apos;re best at, and how they work — so you can decide who fits your needs.
                </p>
              </div>
              <div>
                <p className="font-medium text-neutral-900 mb-1">3. Reach out directly</p>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Contact the business of your choice straight from their profile. No bidding, no auctions, no platform fees.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-10 border-t border-neutral-100 max-w-2xl">
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">Why this works</h2>
          <p className="text-neutral-500 leading-relaxed">
            Spotted doesn&apos;t run on ads, paid placements, or commission fees. The platform is currently free during early access. Our goal is to build a directory that&apos;s worth trusting — for the businesses listed and the clients who use it.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
