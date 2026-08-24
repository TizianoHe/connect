"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Listens globally for Supabase's PASSWORD_RECOVERY event, which fires when
// the user follows a password-reset link that contains a hash fragment
// (#access_token=...&type=recovery). Because that link lands on whatever page
// the Site URL is set to (usually the homepage), we need a global listener to
// redirect them to the reset form before they can see any other content.
export function AuthRecoveryHandler() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === "PASSWORD_RECOVERY" &&
        window.location.pathname !== "/reset-password"
      ) {
        router.push("/reset-password");
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  return null;
}
