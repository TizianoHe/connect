"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface PublishButtonProps {
  userId: string;
}

export function PublishButton({ userId }: PublishButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePublish() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("sme_profiles")
      .update({ status: "published" })
      .eq("id", userId);

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <Button loading={loading} onClick={handlePublish} className="bg-emerald-600 hover:bg-emerald-700">
        Jetzt veröffentlichen
      </Button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
