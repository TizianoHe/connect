"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Star, X, Plus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ACCEPTED_IMAGE_TYPES, MAX_AVATAR_SIZE } from "@/lib/constants";

const MAX_PHOTOS = 10;

interface Photo {
  id: string;
  photo_url: string;
  is_primary: boolean;
  display_order: number;
}

interface PhotosManagerProps {
  userId: string;
  initialPhotos: Photo[];
}

function storagePathFromUrl(photoUrl: string): string | null {
  try {
    const clean = photoUrl.split("?")[0];
    const parts = new URL(clean).pathname.split("/avatars/");
    return parts[1] ?? null;
  } catch {
    return null;
  }
}

export function PhotosManager({ userId, initialPhotos }: PhotosManagerProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Please select a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setError("Image must be 5 MB or smaller.");
      return;
    }
    if (photos.length >= MAX_PHOTOS) {
      setError("You can upload up to 10 photos.");
      return;
    }

    setError(null);
    setUploading(true);

    const ext = file.name.split(".").pop() ?? "jpg";
    const uuid = crypto.randomUUID();
    const path = `sme-photos/${userId}/${uuid}.${ext}`;
    const supabase = createClient();

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { contentType: file.type });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);

    const isFirst = photos.length === 0;

    const { data: newPhoto, error: insertError } = await supabase
      .from("sme_photos")
      .insert({
        sme_profile_id: userId,
        photo_url: publicUrl,
        is_primary: isFirst,
        display_order: photos.length,
      })
      .select()
      .single();

    if (insertError) {
      await supabase.storage.from("avatars").remove([path]);
      setError(insertError.message);
      setUploading(false);
      return;
    }

    setPhotos((prev) => [...prev, newPhoto as Photo]);
    setUploading(false);
  }

  async function handleSetPrimary(photoId: string) {
    const supabase = createClient();

    const { error: clearError } = await supabase
      .from("sme_photos")
      .update({ is_primary: false })
      .eq("sme_profile_id", userId);

    if (clearError) {
      setError(clearError.message);
      return;
    }

    const { error: setPrimaryError } = await supabase
      .from("sme_photos")
      .update({ is_primary: true })
      .eq("id", photoId);

    if (setPrimaryError) {
      setError(setPrimaryError.message);
      return;
    }

    setPhotos((prev) => prev.map((p) => ({ ...p, is_primary: p.id === photoId })));
  }

  async function handleDelete(photo: Photo) {
    if (!confirm("Delete this photo? This cannot be undone.")) return;

    const supabase = createClient();

    const { error: deleteError } = await supabase
      .from("sme_photos")
      .delete()
      .eq("id", photo.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    const storagePath = storagePathFromUrl(photo.photo_url);
    if (storagePath) {
      await supabase.storage.from("avatars").remove([storagePath]);
    }

    const remaining = photos.filter((p) => p.id !== photo.id);

    if (photo.is_primary && remaining.length > 0) {
      const newPrimary = remaining[0];
      await supabase
        .from("sme_photos")
        .update({ is_primary: true })
        .eq("id", newPrimary.id);
      setPhotos(remaining.map((p, i) => ({ ...p, is_primary: i === 0 })));
    } else {
      setPhotos(remaining);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-neutral-900">Photos</h2>
        <span className="text-xs text-neutral-400">
          {photos.length} of {MAX_PHOTOS}
        </span>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative group aspect-square rounded-xl overflow-hidden bg-neutral-100"
          >
            <Image
              src={photo.photo_url}
              alt="Business photo"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            {photo.is_primary && (
              <div className="absolute top-2 left-2 bg-neutral-900/80 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                Primary
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {!photo.is_primary && (
                <button
                  onClick={() => handleSetPrimary(photo.id)}
                  title="Set as primary"
                  className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                >
                  <Star size={14} className="text-neutral-700" />
                </button>
              )}
              <button
                onClick={() => handleDelete(photo)}
                title="Delete photo"
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
              >
                <X size={14} className="text-neutral-700" />
              </button>
            </div>
          </div>
        ))}

        {photos.length < MAX_PHOTOS && (
          <button
            onClick={() => !uploading && fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 hover:border-neutral-400 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <Plus size={20} />
                <span className="text-xs">Add photo</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
