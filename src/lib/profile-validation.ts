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
    description?: string | null;
    location_city?: string | null;
  },
  serviceCount: number,
  hasPhoto: boolean
): ProfileCompletenessResult {
  const missingItems: MissingItem[] = [];

  if (!profile.business_name || profile.business_name.trim().length < 2) {
    missingItems.push({ label: "Add a business name", href: "/onboarding/step-1" });
  }
  if (!profile.description || profile.description.trim().length < 20) {
    missingItems.push({ label: "Add a description", href: "/onboarding/step-1" });
  }
  if (!profile.location_city) {
    missingItems.push({ label: "Add your location", href: "/onboarding/step-3" });
  }
  if (serviceCount === 0) {
    missingItems.push({ label: "Add at least one service", href: "/onboarding/step-2" });
  }
  if (!hasPhoto) {
    missingItems.push({ label: "Upload a profile picture", href: "/onboarding/step-4" });
  }

  return { isComplete: missingItems.length === 0, missingItems };
}
