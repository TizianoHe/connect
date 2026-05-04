import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Pricing — Connect" };

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
        <h1 className="text-3xl font-semibold text-neutral-900 mb-4">Pricing</h1>
        <p className="text-neutral-500 leading-relaxed mb-4">
          <strong className="text-neutral-900">Free during early access.</strong> Listing
          your business on Connect is completely free while we&apos;re in early access.
        </p>
        <p className="text-neutral-500 leading-relaxed">
          Subscription plans are coming soon. We&apos;ll introduce optional paid tiers
          with enhanced visibility and features — early adopters will receive
          special pricing when they launch.
        </p>
      </main>

      <Footer />
    </div>
  );
}
