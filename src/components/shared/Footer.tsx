import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

const productLinks = [
  { label: "Browse businesses", href: "/browse" },
  { label: "List your business", href: "/signup" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
];

const companyLinks = [
  { label: "About us", href: "/about" },
  { label: "Contact us", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Imprint", href: "/imprint" },
];

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="text-sm text-neutral-500 leading-relaxed">
              A clean directory connecting SMEs with clients who need them.
            </p>
            <p className="text-xs text-neutral-400">Made in St. Gallen, Switzerland</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 mb-4">Product</h4>
            <ul className="flex flex-col gap-2.5">
              {productLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 mb-4">Company</h4>
            <ul className="flex flex-col gap-2.5">
              {companyLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 mb-4">Legal</h4>
            <ul className="flex flex-col gap-2.5">
              {legalLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} Connect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
