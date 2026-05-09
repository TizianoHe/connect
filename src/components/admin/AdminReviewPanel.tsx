"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface AdminReviewPanelProps {
  profileId: string;
  profileStatus: string;
  businessName: string;
  rejectionReason: string | null;
  adminUserId: string;
}

export function AdminReviewPanel({
  profileId,
  profileStatus,
  businessName,
  rejectionReason,
  adminUserId,
}: AdminReviewPanelProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionText, setRejectionText] = useState("");

  async function handleApprove() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("sme_profiles")
      .update({
        status: "published",
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminUserId,
        rejection_reason: null,
      })
      .eq("id", profileId);

    // TODO: send email notification to SME when status changes to 'published'

    if (err) { setError(err.message); setLoading(false); return; }
    router.push("/admin");
  }

  async function handleReject() {
    if (rejectionText.trim().length < 20) {
      setError("Please write at least 20 characters so the SME knows what to fix.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("sme_profiles")
      .update({
        status: "rejected",
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminUserId,
        rejection_reason: rejectionText.trim(),
      })
      .eq("id", profileId);

    // TODO: send email notification to SME when status changes to 'rejected'

    if (err) { setError(err.message); setLoading(false); return; }
    router.push("/admin");
  }

  async function handleUnpublish() {
    if (!confirm(`Unpublish ${businessName}? The profile will no longer appear publicly.`)) return;
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("sme_profiles")
      .update({ status: "unpublished" })
      .eq("id", profileId);

    if (err) { setError(err.message); setLoading(false); return; }
    router.push("/admin");
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-neutral-400 uppercase tracking-wide font-medium mb-1">
            Admin action
          </p>
          <h2 className="font-semibold text-neutral-900">{businessName}</h2>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
          profileStatus === "pending_review" ? "bg-neutral-900 text-white" :
          profileStatus === "published"      ? "bg-emerald-100 text-emerald-700" :
          profileStatus === "rejected"       ? "bg-amber-100 text-amber-700" :
                                              "bg-neutral-100 text-neutral-600"
        }`}>
          {profileStatus === "pending_review" ? "Under review" :
           profileStatus === "published"      ? "Published" :
           profileStatus === "rejected"       ? "Rejected" :
           profileStatus === "unpublished"    ? "Unpublished" : "Draft"}
        </span>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* ── Pending review actions ─────────────────────────────────────── */}
      {profileStatus === "pending_review" && !showRejectForm && (
        <div className="flex items-center gap-3">
          <Button onClick={handleApprove} loading={loading} className="bg-emerald-600 hover:bg-emerald-700">
            Approve
          </Button>
          <Button variant="secondary" onClick={() => setShowRejectForm(true)} disabled={loading}>
            Reject with reason
          </Button>
        </div>
      )}

      {profileStatus === "pending_review" && showRejectForm && (
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-1.5">
              Rejection reason
            </label>
            <p className="text-xs text-neutral-400 mb-2">
              Be constructive and specific. The SME will use this to improve their profile.
              Min 20 characters, max 1000.
            </p>
            <textarea
              value={rejectionText}
              onChange={(e) => setRejectionText(e.target.value)}
              maxLength={1000}
              rows={4}
              placeholder="Explain what needs to change before this profile can be published. The SME will see this message."
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
            />
            <p className="text-right text-xs text-neutral-400 mt-1">
              {rejectionText.length}/1000
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleReject} loading={loading} variant="secondary">
              Send rejection
            </Button>
            <button
              onClick={() => { setShowRejectForm(false); setError(null); }}
              className="text-sm text-neutral-500 hover:text-neutral-900"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Published actions ──────────────────────────────────────────── */}
      {profileStatus === "published" && (
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={handleUnpublish} loading={loading}>
            Unpublish
          </Button>
          <p className="text-xs text-neutral-400">
            Use this only if a profile shouldn&apos;t be public anymore.
          </p>
        </div>
      )}

      {/* ── Rejected actions ───────────────────────────────────────────── */}
      {profileStatus === "rejected" && !showRejectForm && (
        <div className="flex flex-col gap-3">
          {rejectionReason && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-xs font-medium text-amber-700 mb-1">Previous rejection reason</p>
              <p className="text-sm text-amber-900">{rejectionReason}</p>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Button onClick={handleApprove} loading={loading} className="bg-emerald-600 hover:bg-emerald-700">
              Approve anyway
            </Button>
            <Button variant="secondary" onClick={() => { setShowRejectForm(true); setRejectionText(rejectionReason ?? ""); }} disabled={loading}>
              Update rejection reason
            </Button>
          </div>
        </div>
      )}

      {profileStatus === "rejected" && showRejectForm && (
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-1.5">
              Update rejection reason
            </label>
            <textarea
              value={rejectionText}
              onChange={(e) => setRejectionText(e.target.value)}
              maxLength={1000}
              rows={4}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
            />
            <p className="text-right text-xs text-neutral-400 mt-1">
              {rejectionText.length}/1000
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleReject} loading={loading} variant="secondary">
              Save updated reason
            </Button>
            <button
              onClick={() => { setShowRejectForm(false); setError(null); }}
              className="text-sm text-neutral-500 hover:text-neutral-900"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
