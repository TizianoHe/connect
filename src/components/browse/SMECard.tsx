import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface SMECardData {
  id: string;
  business_name: string;
  tagline: string | null;
  avatar_url: string | null;
  location_city: string | null;
  location_country: string;
  categories: { id: string; name: string }[];
}

interface SMECardProps {
  sme: SMECardData;
  className?: string;
}

function AvatarFallback({ name }: { name: string }) {
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
      <span
        className="text-3xl font-semibold"
        style={{ color: `hsl(${hue}, 50%, 35%)` }}
      >
        {initials}
      </span>
    </div>
  );
}

export function SMECard({ sme, className }: SMECardProps) {
  const locationLabel = [sme.location_city, sme.location_country]
    .filter(Boolean)
    .join(", ");

  const visibleCategories = sme.categories.slice(0, 2);
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
      {/* Image area */}
      <div className="relative w-full aspect-[4/3] bg-neutral-100 overflow-hidden">
        {sme.avatar_url ? (
          <Image
            src={sme.avatar_url}
            alt={sme.business_name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <AvatarFallback name={sme.business_name} />
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2 p-5">
        <div>
          <h3 className="font-semibold text-neutral-900 text-base leading-snug line-clamp-1">
            {sme.business_name}
          </h3>
          {sme.tagline && (
            <p className="text-sm text-neutral-500 mt-0.5 line-clamp-1">
              {sme.tagline}
            </p>
          )}
        </div>

        {locationLabel && (
          <div className="flex items-center gap-1 text-xs text-neutral-400">
            <MapPin size={11} className="flex-shrink-0" />
            <span className="truncate">{locationLabel}</span>
          </div>
        )}

        {sme.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {visibleCategories.map((cat) => (
              <Badge key={cat.id} variant="muted" className="text-xs">
                {cat.name}
              </Badge>
            ))}
            {extraCount > 0 && (
              <Badge variant="muted" className="text-xs">
                +{extraCount}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
