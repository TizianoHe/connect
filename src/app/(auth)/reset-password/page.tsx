import { Logo } from "@/components/shared/Logo";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata = { title: "Set new password — Spotted" };

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <Logo />
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Set a new password</h1>
          <p className="text-sm text-neutral-500 mb-8">
            Enter your new password below.
          </p>
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
