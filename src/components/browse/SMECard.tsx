import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface SMECardData {
  id: string;
  business_name: string;
  tagline: string | null;
  description?: string | null;
  avatar_url: string | null;
  location_city: string | null;
  location_country: string;
  categories: { id: string; name: string }[];
  service_count?: number;
}

interface SMECardProps {
  sme: SMECardData;
  className?: string;
  compact?: boolean;
}

// Full-width fallback for the compact (image-area) card
function LargeAvatarFallback({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const hues = [210, 160, 280, 30, 340, 190];
  const hue = hues[name.charCodeAt(0) % hues.length];
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: `hsl(${hue}, 60%, 92%)` }}
    >
      <span className="text-3xl font-semibold" style={{ color: `hsl(${hue}, 50%, 35%)` }}>
        {initials}
      </span>
    </div>
  );
}

// Small square fallback for the horizontal card (48 px target)
function SmallAvatarFallback({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const hues = [210, 160, 280, 30, 340, 190];
  const hue = hues[name.charCodeAt(0) % hues.length];
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: `hsl(${hue}, 60%, 92%)` }}
    >
      <span className="text-base font-semibold" style={{ color: `hsl(${hue}, 50%, 35%)` }}>
        {initials}
      </span>
    </div>
  );
}

export function SMECard({ sme, className, compact = false }: SMECardProps) {
  const locationLabel = [sme.location_city, sme.location_country]
    .filter(Boolean)
    .join(", ");
  const visibleCategories = sme.categories.slice(0, 2);

  // ── Compact (landing page): image banner + body ──────────────────────────
  if (compact) {
    const extraCount = sme.categories.length - visibleCategories.length;
    return (
      <Link
        href={`/sme/${sme.id}`}
        className={cn(
          "group flex flex-col bg-white rounded-2xl overflow-hidden border border-neutral-200",
          "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200",
          className
        )}
      >
        <div className="relative w-full aspect-[16/9] bg-neutral-100 overflow-hidden">
          {sme.avatar_url ? (
            <Image
              src={sme.avatar_url}
              alt={sme.business_name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <LargeAvatarFallback name={sme.business_name} />
          )}
        </div>
        <div className="flex flex-col gap-1.5 p-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 leading-snug line-clamp-1">
              {sme.business_name}
            </h3>
            {sme.tagline && (
              <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{sme.tagline}</p>
            )}
          </div>
          {locationLabel && (
            <div className="flex items-center gap-1 text-xs text-neutral-400">
              <MapPin size={11} className="flex-shrink-0" />
              <span className="truncate">{locationLabel}</span>
            </div>
          )}
          {sme.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {visibleCategories.map((cat) => (
                <Badge key={cat.id} variant="muted" className="text-xs">
                  {cat.name}
                </Badge>
              ))}
              {extraCount > 0 && (
                <Badge variant="muted" className="text-xs">+{extraCount}</Badge>
              )}
            </div>
          )}
        </div>
      </Link>
    );
  }

  // ── Default (browse page): horizontal layout ─────────────────────────────
  const svcCount = sme.service_count ?? 0;
  const svcLabel =
    svcCount > 0 ? `${svcCount} ${svcCount === 1 ? "service" : "services"}` : null;

  return (
    <Link
      href={`/sme/${sme.id}`}
      className={cn(
        "group flex items-start gap-3 bg-white rounded-2xl border border-neutral-200 p-4",
        "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
        className
      )}
    >
      {/* Avatar — 64 px square */}
      <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-neutral-100">
        {sme.avatar_url ? (
          <Image
            src={sme.avatar_url}
            alt={sme.business_name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <SmallAvatarFallback name={sme.business_name} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <h3 className="font-semibold text-neutral-900 text-sm leading-snug truncate">
          {sme.business_name}
        </h3>
        {sme.tagline && (
          <p className="text-xs text-neutral-500 mt-0.5 truncate">{sme.tagline}</p>
        )}
        {sme.description && (
          <p className="text-xs text-neutral-400 mt-1 line-clamp-1 leading-relaxed">
            {sme.description}
          </p>
        )}
        {visibleCategories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {visibleCategories.map((cat) => (
              <Badge key={cat.id} variant="muted" className="text-[11px] py-0.5 px-2">
                {cat.name}
              </Badge>
            ))}
          </div>
        )}
        {(locationLabel || svcLabel) && (
          <div className="flex items-center gap-1 mt-2 text-xs text-neutral-400">
            {locationLabel && (
              <>
                <MapPin size={10} className="flex-shrink-0" />
                <span className="truncate min-w-0">{locationLabel}</span>
              </>
            )}
            {locationLabel && svcLabel && (
              <span className="flex-shrink-0 mx-0.5">·</span>
            )}
            {svcLabel && <span className="flex-shrink-0">{svcLabel}</span>}
          </div>
        )}
      </div>
    </Link>
  );
}
