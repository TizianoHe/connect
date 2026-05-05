import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-sm text-neutral-500 leading-relaxed">
              A clean directory connecting SMEs with clients who need them.
            </p>
            <p className="text-xs text-neutral-400">Made in St. Gallen, Switzerland</p>
          </div>

          {/* Product */}
          <div>
            <p className="text-sm font-semibold text-neutral-900 mb-4">Product</p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/browse" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  Browse businesses
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  List your business
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-sm font-semibold text-neutral-900 mb-4">Company</p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/about" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-sm font-semibold text-neutral-900 mb-4">Legal</p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/privacy" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/imprint" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  Imprint
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} Spotted. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
