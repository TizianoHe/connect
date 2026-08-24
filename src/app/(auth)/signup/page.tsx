import { Logo } from "@/components/shared/Logo";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = { title: "Unternehmen vorstellen — Spotted" };

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <Logo />
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h1 className="text-3xl text-neutral-900 mb-1">Unternehmen vorstellen</h1>
          <p className="font-sans text-sm text-neutral-500 mb-8">
            Konto erstellen, Profil ausfüllen — danach schauen wir es uns
            persönlich an.
          </p>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
