"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MAX_AVATAR_SIZE, ACCEPTED_IMAGE_TYPES } from "@/lib/constants";

interface Step4AvatarUploadProps {
  userId: string;
  businessName: string;
  currentAvatarUrl?: string | null;
}

export function Step4AvatarUpload({
  userId,
  businessName,
  currentAvatarUrl,
}: Step4AvatarUploadProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(selected.type)) {
      setError("Please select a JPEG, PNG, or WebP image.");
      return;
    }
    if (selected.size > MAX_AVATAR_SIZE) {
      setError("Image must be 5 MB or smaller.");
      return;
    }

    setError(null);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError(null);

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${userId}/avatar.${ext}`;
    const supabase = createClient();

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);

    const { error: profileError } = await supabase
      .from("sme_profiles")
      .update({
        avatar_url: `${publicUrl}?t=${Date.now()}`,
        onboarding_step: 5,
        is_published: true,
      })
      .eq("id", userId);

    if (profileError) {
      setError(profileError.message);
      setUploading(false);
      return;
    }

    router.push("/dashboard");
  }

  async function handleSkip() {
    setCompleting(true);
    const supabase = createClient();
    await supabase
      .from("sme_profiles")
      .update({ onboarding_step: 5, is_published: true })
      .eq("id", userId);
    router.push("/dashboard");
  }

  const initials = businessName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      {/* Preview area */}
      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            "w-32 h-32 rounded-2xl overflow-hidden flex items-center justify-center bg-neutral-100 border-2 border-dashed border-neutral-300 cursor-pointer hover:border-neutral-400 transition-colors",
            preview && "border-solid border-transparent"
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <Image
              src={preview}
              alt="Business logo preview"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-neutral-400">
              <Upload size={24} />
              <span className="text-xs">Upload photo</span>
            </div>
          )}
        </div>

        {preview && (
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              setFile(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-red-500"
          >
            <X size={12} /> Remove
          </button>
        )}

        {!preview && (
          <p className="text-sm text-neutral-500 text-center">
            Or your profile will show{" "}
            <span className="font-semibold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-lg">
              {initials}
            </span>{" "}
            as a placeholder
          </p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={handleFileSelect}
      />

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {file ? (
          <Button
            type="button"
            size="lg"
            className="w-full"
            loading={uploading}
            onClick={handleUpload}
          >
            Upload & publish profile
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose image
          </Button>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/onboarding/step-3")}
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handleSkip}
            disabled={completing}
            className="text-sm text-neutral-500 hover:text-neutral-900 disabled:opacity-50"
          >
            {completing ? "Saving..." : "Skip for now →"}
          </button>
        </div>
      </div>
    </div>
  );
}
