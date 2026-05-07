import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Pricing — Spotted" };

export default function PricingPage() {
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

        <h1 className="text-3xl font-semibold text-neutral-900 mb-12">Pricing</h1>

        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">Free during early access</h2>
            <p className="text-neutral-500 leading-relaxed">
              Spotted is currently in early access, and listing your business is completely free. There are no fees, no commissions, and no paid placements that bury other businesses.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">What&apos;s coming later</h2>
            <p className="text-neutral-500 leading-relaxed">
              In the future, Spotted will introduce optional subscription plans for businesses who want additional features. Pricing details will be communicated well in advance, and any changes will be announced directly to all current users before they take effect.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">What stays free, always</h2>
            <p className="text-neutral-500 leading-relaxed">
              Browsing Spotted will always be free for clients. There will never be hidden fees, paywalls, or pay-to-contact systems on the client side.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
