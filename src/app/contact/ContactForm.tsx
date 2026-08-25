"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "./actions";

const initialState: ContactFormState = { status: "idle", message: "" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-xl bg-neutral-50 border border-neutral-200 px-6 py-8 text-center">
        <p className="font-medium text-neutral-900 mb-1">Nachricht gesendet</p>
        <p className="text-sm text-neutral-500">
          Danke, Ihre Nachricht ist angekommen. Wir melden uns so schnell wie möglich.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.status === "error" && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {state.message}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            placeholder="Ihr Name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
            E-Mail <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="user_type" className="block text-sm font-medium text-neutral-700 mb-1.5">
          Ich bin&hellip;
        </label>
        <select
          id="user_type"
          name="user_type"
          className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
          defaultValue=""
        >
          <option value="">Bitte wählen (optional)</option>
          <option value="Client">Auf der Suche nach einem Unternehmen</option>
          <option value="Business">Unternehmen</option>
          <option value="Press">Presse</option>
          <option value="Other">Anderes</option>
        </select>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1.5">
          Betreff <span className="text-red-500">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
          placeholder="Worum geht es?"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1.5">
          Nachricht <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={6}
          className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
          placeholder="Ihre Nachricht…"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto px-6 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Wird gesendet…" : "Nachricht senden"}
      </button>
    </form>
  );
}
