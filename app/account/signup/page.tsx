"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-sm px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-extrabold text-white">Check your email</h1>
        <p className="mt-4 text-slate-400">We sent a confirmation link to {email}. Click it to activate your account.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <h1 className="font-display text-2xl font-extrabold text-white">Create an Account</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">Full Name</label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3 font-bold text-slate-900 transition hover:brightness-110 disabled:opacity-50"
        >
          {submitting ? "Creating account…" : "Sign Up"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/account/login" className="font-semibold text-amber-400 hover:text-amber-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}
