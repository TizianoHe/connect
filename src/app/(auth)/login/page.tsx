import { Logo } from "@/components/shared/Logo";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Sign in — Spotted" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <Logo />
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Welcome back</h1>
          <p className="text-sm text-neutral-500 mb-8">
            Sign in to manage your business profile.
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
