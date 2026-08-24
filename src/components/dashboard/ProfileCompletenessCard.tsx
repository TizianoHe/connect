import Link from "next/link";
import { Check, AlertCircle } from "lucide-react";
import type { SMEProfile } from "@/types";
import { cn } from "@/lib/utils";

interface ProfileCompletenessCardProps {
  profile: SMEProfile;
  hasPhoto: boolean;
}

export function ProfileCompletenessCard({
  profile,
  hasPhoto,
}: ProfileCompletenessCardProps) {
  const categoryIds = (profile.category_ids as string[] | null) ?? [];
  const hasContact =
    !!profile.phone?.trim() ||
    !!profile.email_public?.trim() ||
    !!profile.website_url?.trim();

  const checks = [
    {
      label: "Business name",
      done: !!profile.business_name && profile.business_name.trim().length >= 2,
      href: "/onboarding/step-1",
    },
    {
      label: "Category selected",
      done: categoryIds.length > 0,
      href: "/onboarding/step-1",
    },
    {
      label: "Location",
      done: !!profile.location_city && !!profile.location_type,
      href: "/onboarding/step-1",
    },
    {
      label: "Contact info",
      done: hasContact,
      href: "/onboarding/step-1",
    },
    {
      label: "Team size",
      done: !!profile.team_size,
      href: "/onboarding/step-1",
    },
    {
      label: "Positioning line",
      done:
        !!profile.positioning_line &&
        profile.positioning_line.trim().length >= 10,
      href: "/onboarding/step-2",
    },
    {
      label: "Profile photo",
      done: hasPhoto,
      href: "/onboarding/step-4",
    },
  ];

  const completedCount = checks.filter((c) => c.done).length;
  const percentage = Math.round((completedCount / checks.length) * 100);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-neutral-900">Profile completeness</h2>
        <span className="text-sm font-medium text-neutral-500">{percentage}%</span>
      </div>
      <div className="w-full bg-neutral-100 rounded-full h-2 mb-6">
        <div
          className={cn(
            "h-2 rounded-full transition-all",
            percentage === 100 ? "bg-emerald-500" : "bg-neutral-900"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex flex-col gap-2.5">
        {checks.map(({ label, done, href }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                  done
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-neutral-100 text-neutral-400"
                )}
              >
                {done ? <Check size={10} /> : <AlertCircle size={10} />}
              </div>
              <span
                className={cn(
                  "text-sm",
                  done ? "text-neutral-700" : "text-neutral-500"
                )}
              >
                {label}
              </span>
            </div>
            {!done && (
              <Link
                href={href}
                className="text-xs text-neutral-900 font-medium hover:underline"
              >
                Add →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
