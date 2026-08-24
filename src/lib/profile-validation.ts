export interface MissingItem {
  label: string;
  href: string;
}

export interface ProfileCompletenessResult {
  isComplete: boolean;
  missingItems: MissingItem[];
}

export function getProfileCompleteness(
  profile: {
    business_name?: string | null;
    category_ids?: string[] | null;
    location_city?: string | null;
    location_type?: string | null;
    phone?: string | null;
    email_public?: string | null;
    website_url?: string | null;
    team_size?: string | null;
    positioning_line?: string | null;
  },
  hasPhoto: boolean
): ProfileCompletenessResult {
  const missingItems: MissingItem[] = [];

  if (!profile.business_name || profile.business_name.trim().length < 2) {
    missingItems.push({ label: "Add a business name", href: "/onboarding/step-1" });
  }
  if (!profile.category_ids || profile.category_ids.length === 0) {
    missingItems.push({ label: "Select at least one category", href: "/onboarding/step-1" });
  }
  if (!profile.location_city) {
    missingItems.push({ label: "Add your city", href: "/onboarding/step-1" });
  }
  if (!profile.location_type) {
    missingItems.push({ label: "Specify your location type", href: "/onboarding/step-1" });
  }
  const hasContact =
    !!profile.phone?.trim() ||
    !!profile.email_public?.trim() ||
    !!profile.website_url?.trim();
  if (!hasContact) {
    missingItems.push({ label: "Add a contact channel (phone, email, or website)", href: "/onboarding/step-1" });
  }
  if (!profile.team_size) {
    missingItems.push({ label: "Add your team size", href: "/onboarding/step-1" });
  }
  if (!profile.positioning_line || profile.positioning_line.trim().length < 10) {
    missingItems.push({ label: "Add a positioning line", href: "/onboarding/step-2" });
  }
  if (!hasPhoto) {
    missingItems.push({ label: "Upload a profile picture", href: "/onboarding/step-4" });
  }

  return { isComplete: missingItems.length === 0, missingItems };
}
