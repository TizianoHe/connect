import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
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

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-600 text-sm px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Now in early access
          </div>
          <h1 className="text-5xl sm:text-6xl font-semibold text-neutral-900 tracking-tight leading-[1.1] mb-6">
            Connect your business
            <br />
            <span className="text-neutral-400">with clients who need you</span>
          </h1>
          <p className="text-lg text-neutral-500 mb-10 max-w-lg mx-auto leading-relaxed">
            A clean, searchable directory of SMEs. Build your profile once, get
            discovered by clients looking for exactly what you offer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto px-8">
                List your business — it&apos;s free
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                Find a service
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Feature strip */}
      <section className="border-t border-neutral-100 py-16">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            {
              title: "Build your profile",
              body: "Company name, description, services, location, and contact — all in one place.",
            },
            {
              title: "Get discovered",
              body: "Clients search and filter by service category and location to find the right fit.",
            },
            {
              title: "No commissions",
              body: "Connect directly with clients. We don't take a cut of your contracts.",
            },
          ].map(({ title, body }) => (
            <div key={title}>
              <h3 className="font-semibold text-neutral-900 mb-2">{title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-neutral-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Logo />
          <p className="text-xs text-neutral-400">© {new Date().getFullYear()} Connect</p>
        </div>
      </footer>
    </div>
  );
}
