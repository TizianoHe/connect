"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface SubmitForReviewButtonProps {
  userId: string;
  label?: string;
}

export function SubmitForReviewButton({
  userId,
  label = "Submit for review",
}: SubmitForReviewButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("sme_profiles")
      .update({
        status: "pending_review",
        submitted_at: new Date().toISOString(),
        rejection_reason: null,
      })
      .eq("id", userId);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button loading={loading} onClick={handleSubmit}>
        {label}
      </Button>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
