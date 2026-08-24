"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { MapPin, Users, Globe, Phone, Mail, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TEAM_SIZE_LABELS: Record<string, string> = {
  solo: "Just me",
  "2-5": "2–5 people",
  "6-20": "6–20 people",
  "21-50": "21–50 people",
  "50+": "50+ people",
};

interface Step5ReviewSubmitProps {
  userId: string;
  profile: {
    business_name: string;
    positioning_line: string | null;
    location_city: string | null;
    location_country: string;
    team_size: string | null;
    phone: string | null;
    email_public: string | null;
    website_url: string | null;
    avatar_url: string | null;
  };
  categoryNames: string[];
  photoCount: number;
}

export function Step5ReviewSubmit({
  userId,
  profile,
  categoryNames,
  photoCount,
}: Step5ReviewSubmitProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = [profile.location_city, profile.location_country]
    .filter(Boolean)
    .join(", ");

  const initials = profile.business_name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("sme_profiles")
      .update({
        status: "pending_review",
        submitted_at: new Date().toISOString(),
        rejection_reason: null,
      })
      .eq("id", userId);

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Profile preview card */}
      <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6">
        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-4">
          Vorschau Ihres Profils
        </p>
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-200 flex-shrink-0 flex items-center justify-center">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.business_name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-semibold text-neutral-500">{initials}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-neutral-900 leading-tight">
              {profile.business_name}
            </h2>
            {profile.positioning_line && (
              <p className="text-sm text-neutral-500 mt-1 leading-snug">
                {profile.positioning_line}
              </p>
            )}
            {location && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-neutral-500">
                <MapPin size={12} className="text-neutral-400 flex-shrink-0" />
                <span>{location}</span>
              </div>
            )}
            {categoryNames.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {categoryNames.map((name) => (
                  <Badge key={name} variant="muted">{name}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick details strip */}
        <div className="mt-4 pt-4 border-t border-neutral-200 flex flex-wrap gap-4">
          {profile.team_size && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Users size={12} className="text-neutral-400" />
              <span>{TEAM_SIZE_LABELS[profile.team_size] ?? profile.team_size}</span>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Phone size={12} className="text-neutral-400" />
              <span>{profile.phone}</span>
            </div>
          )}
          {profile.email_public && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Mail size={12} className="text-neutral-400" />
              <span>{profile.email_public}</span>
            </div>
          )}
          {profile.website_url && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Globe size={12} className="text-neutral-400" />
              <span>{profile.website_url.replace(/^https?:\/\//, "")}</span>
            </div>
          )}
        </div>

        {/* Photo count note */}
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <CheckCircle2
              size={13}
              className={photoCount >= 1 ? "text-emerald-500" : "text-neutral-300"}
            />
            <span>
              {photoCount === 0
                ? "Kein Foto — bitte gehen Sie zurück zu Schritt 4"
                : photoCount === 1
                ? "1 Foto hochgeladen — ausreichend für die Bewerbung"
                : `${photoCount} Fotos hochgeladen`}
            </span>
          </div>
          {photoCount > 0 && photoCount < 3 && (
            <p className="text-xs text-neutral-400 mt-1 ml-5">
              Für die Veröffentlichung brauchen wir mindestens 3 Fotos. Sie können weitere nach der Bewerbung hinzufügen.
            </p>
          )}
        </div>
      </div>

      {/* Info box */}
      <div className="bg-neutral-50 rounded-2xl border border-neutral-200 px-5 py-4">
        <p className="text-sm font-medium text-neutral-900 mb-1">Was passiert nach der Einreichung?</p>
        <p className="text-sm text-neutral-500">
          Wir prüfen jedes Profil persönlich. Sie erhalten eine Antwort innerhalb von 48 Stunden.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.push("/onboarding/step-4")}
          className="text-sm text-neutral-500 hover:text-neutral-900"
        >
          ← Back
        </button>
        <Button
          size="lg"
          loading={loading}
          disabled={photoCount === 0}
          onClick={handleSubmit}
        >
          Bewerbung einreichen
        </Button>
      </div>
    </div>
  );
}
