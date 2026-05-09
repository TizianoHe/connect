import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";

export const metadata = { title: "About — Spotted" };

export default function AboutPage() {
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

        <h1 className="text-3xl font-semibold text-neutral-900 mb-12">About Spotted</h1>

        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">The shift</h2>
            <p className="text-neutral-500 leading-relaxed">
              Finding a good local business online has gotten harder, not easier. Over the last few years, digital discovery has become dominated by paid visibility and algorithmically optimised content. Everything has started to look the same. As a result, the family-run print shop, the local accountant, or the photographer two streets away can quietly disappear behind businesses that are simply better at playing the system. When visibility rewards optimisation more than trust, good businesses become difficult to find.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">What Spotted is</h2>
            <p className="text-neutral-500 leading-relaxed">
              Spotted is a platform for Swiss SMEs to present who they are, what they do, and how people can reach them. Businesses create a profile that shows their work, their services, and who they actually are. Clients can browse by category and location, discover businesses that fit their needs, and contact them directly. Spotted is not an advertising platform, a marketplace, or a system built around paid reach. It&apos;s a place for businesses to present themselves clearly — once, properly, on their own terms.
            </p>
            <p className="text-neutral-500 leading-relaxed mt-4">
              Every profile is reviewed before it appears on the platform — for clarity and quality, not for marketing polish.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">What we believe</h2>
            <p className="text-neutral-500 leading-relaxed">
              We believe that digital visibility should reflect the quality of a business, not just the quality of its marketing. A good local business should be discoverable because of its work, its reputation, and the trust it creates — not because it publishes the most content or spends the most on ads. We also believe clients are increasingly exhausted by online noise and endless polished recommendations that all feel the same. People aren&apos;t looking for more options. They&apos;re looking for clarity, and for businesses they can actually trust.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">Where we are</h2>
            <p className="text-neutral-500 leading-relaxed">
              Spotted is starting in St. Gallen and is currently available in early access for businesses. During this phase, profiles are free while the platform grows and develops together with the businesses using it. Built by people who believe Switzerland&apos;s local businesses deserve a more credible and human way to be discovered online.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
