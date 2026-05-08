"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Plus, Loader2, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ACCEPTED_IMAGE_TYPES, MAX_AVATAR_SIZE } from "@/lib/constants";

const GALLERY_MAX = 10;

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
  const [primaryPhoto, setPrimaryPhoto] = useState<Photo | null>(
    initialPhotos.find((p) => p.is_primary) ?? null
  );
  const [galleryPhotos, setGalleryPhotos] = useState<Photo[]>(
    initialPhotos
      .filter((p) => !p.is_primary)
      .sort((a, b) => a.display_order - b.display_order)
  );
  const [primaryUploading, setPrimaryUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  function validateFile(file: File): boolean {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Please select a JPEG, PNG, or WebP image.");
      return false;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setError("Image must be 5 MB or smaller.");
      return false;
    }
    return true;
  }

  async function uploadToStorage(file: File): Promise<{ url: string; path: string } | null> {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `sme-photos/${userId}/${crypto.randomUUID()}.${ext}`;
    const supabase = createClient();

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { contentType: file.type });

    if (uploadError) {
      setError(uploadError.message);
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);

    return { url: publicUrl, path };
  }

  async function handlePrimarySelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (primaryInputRef.current) primaryInputRef.current.value = "";
    if (!file || !validateFile(file)) return;

    setError(null);
    setPrimaryUploading(true);

    const uploaded = await uploadToStorage(file);
    if (!uploaded) {
      setPrimaryUploading(false);
      return;
    }

    const supabase = createClient();

    if (primaryPhoto) {
      const { error: updateError } = await supabase
        .from("sme_photos")
        .update({ photo_url: uploaded.url })
        .eq("id", primaryPhoto.id);

      if (updateError) {
        await supabase.storage.from("avatars").remove([uploaded.path]);
        setError(updateError.message);
        setPrimaryUploading(false);
        return;
      }

      // Delete old file after the DB row is updated
      const oldPath = storagePathFromUrl(primaryPhoto.photo_url);
      if (oldPath) {
        await supabase.storage.from("avatars").remove([oldPath]);
      }

      setPrimaryPhoto({ ...primaryPhoto, photo_url: uploaded.url });
    } else {
      const { data: newRow, error: insertError } = await supabase
        .from("sme_photos")
        .insert({
          sme_profile_id: userId,
          photo_url: uploaded.url,
          is_primary: true,
          display_order: 0,
        })
        .select()
        .single();

      if (insertError) {
        await supabase.storage.from("avatars").remove([uploaded.path]);
        setError(insertError.message);
        setPrimaryUploading(false);
        return;
      }

      setPrimaryPhoto(newRow as Photo);
    }

    // Keep legacy avatar_url field in sync
    await supabase
      .from("sme_profiles")
      .update({ avatar_url: uploaded.url })
      .eq("id", userId);

    setPrimaryUploading(false);
  }

  async function handleGallerySelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (galleryInputRef.current) galleryInputRef.current.value = "";
    if (!file || !validateFile(file)) return;

    if (galleryPhotos.length >= GALLERY_MAX) {
      setError("You can upload up to 10 gallery photos.");
      return;
    }

    setError(null);
    setGalleryUploading(true);

    const uploaded = await uploadToStorage(file);
    if (!uploaded) {
      setGalleryUploading(false);
      return;
    }

    const supabase = createClient();
    const { data: newPhoto, error: insertError } = await supabase
      .from("sme_photos")
      .insert({
        sme_profile_id: userId,
        photo_url: uploaded.url,
        is_primary: false,
        display_order: galleryPhotos.length,
      })
      .select()
      .single();

    if (insertError) {
      await supabase.storage.from("avatars").remove([uploaded.path]);
      setError(insertError.message);
      setGalleryUploading(false);
      return;
    }

    setGalleryPhotos((prev) => [...prev, newPhoto as Photo]);
    setGalleryUploading(false);
  }

  async function handleGalleryDelete(photo: Photo) {
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

    setGalleryPhotos((prev) => prev.filter((p) => p.id !== photo.id));
  }

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* ── Section 1: Profile picture ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h2 className="font-semibold text-neutral-900 mb-4">Profile picture</h2>
        <div className="flex items-center gap-5">
          <div className="relative w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100">
            {primaryPhoto ? (
              <Image
                src={primaryPhoto.photo_url}
                alt="Profile picture"
                fill
                className="object-cover"
                sizes="192px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera size={28} className="text-neutral-300" />
              </div>
            )}
            {primaryUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-white" />
              </div>
            )}
          </div>
          <button
            onClick={() => !primaryUploading && primaryInputRef.current?.click()}
            disabled={primaryUploading}
            className="text-sm font-medium text-neutral-700 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 px-4 py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {primaryPhoto ? "Change profile picture" : "Upload profile picture"}
          </button>
        </div>
        <input
          ref={primaryInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          className="hidden"
          onChange={handlePrimarySelect}
        />
      </div>

      {/* ── Section 2: Gallery ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-neutral-900">Gallery</h2>
          <span className="text-xs text-neutral-400">
            {galleryPhotos.length} of {GALLERY_MAX}
          </span>
        </div>
        <p className="text-xs text-neutral-500 mb-4">
          Up to 10 additional photos shown on your public profile.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {galleryPhotos.map((photo) => (
            <div
              key={photo.id}
              className="relative group aspect-square rounded-xl overflow-hidden bg-neutral-100"
            >
              <Image
                src={photo.photo_url}
                alt="Gallery photo"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleGalleryDelete(photo)}
                  title="Delete photo"
                  className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                >
                  <X size={14} className="text-neutral-700" />
                </button>
              </div>
            </div>
          ))}

          {galleryPhotos.length < GALLERY_MAX && (
            <button
              onClick={() => !galleryUploading && galleryInputRef.current?.click()}
              disabled={galleryUploading}
              className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 hover:border-neutral-400 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {galleryUploading ? (
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
          ref={galleryInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          className="hidden"
          onChange={handleGallerySelect}
        />
      </div>
    </div>
  );
}
