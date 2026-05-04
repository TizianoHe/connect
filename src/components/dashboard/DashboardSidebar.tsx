"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Search,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, active: true },
  { href: "/onboarding/step-1", label: "My Profile", icon: User, active: true },
  { href: "/browse", label: "Browse", icon: Search, active: true },
  { href: "/settings", label: "Settings", icon: Settings, active: false },
];

interface DashboardSidebarProps {
  userEmail?: string;
  businessName?: string;
}

export function DashboardSidebar({ userEmail, businessName }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex flex-col h-full w-60 border-r border-neutral-200 bg-white px-4 py-6">
      <div className="mb-8">
        <Logo />
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ href, label, icon: Icon, active }) => {
          const isCurrent = pathname === href;
          if (!active) {
            return (
              <span
                key={href}
                title="Coming soon"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-300 cursor-not-allowed"
              >
                <Icon size={16} />
                {label}
              </span>
            );
          }
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                isCurrent
                  ? "bg-neutral-100 text-neutral-900 font-medium"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-neutral-100 pt-4">
        <div className="px-3 py-2 mb-2">
          {businessName && (
            <p className="text-sm font-medium text-neutral-900 truncate">{businessName}</p>
          )}
          {userEmail && (
            <p className="text-xs text-neutral-400 truncate">{userEmail}</p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 w-full transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
