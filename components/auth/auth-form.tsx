"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2, KeyRound, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

type AuthFormProps = {
  mode: "login" | "signup";
  redirectedFrom?: string;
};

export function AuthForm({ mode, redirectedFrom }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isSignup = mode === "signup";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const supabase = createClient();

      if (isSignup) {
        const origin = window.location.origin;
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${origin}/auth/callback?next=/notes`
          }
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        setMessage("Check your inbox to confirm your email before signing in.");
        setPassword("");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.replace(redirectedFrom || "/notes");
      router.refresh();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background px-5 py-8 text-ink">
      <main className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1fr]">
        <section className="hidden lg:block">
          <p className="mono-label mb-5 text-primary">Agent-controlled note database</p>
          <h1 className="font-display text-5xl font-bold leading-tight">
            Your notes. Your agents. One memory database.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-ink-muted">
            AgentNotes keeps the UI calm and the API precise, so humans can write
            naturally while external agents work through a secure permission layer.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 shadow-paper sm:p-8">
          <Link href="/notes" className="mb-10 block">
            <p className="font-display text-3xl font-bold text-primary">AgentNotes</p>
            <p className="mono-label mt-2 text-ink-muted">Precision Workspace</p>
          </Link>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-semibold">
              {isSignup ? "Create your account" : "Sign in"}
            </h2>
            <p className="mt-2 text-ink-muted">
              {isSignup
                ? "Use email and password. You will need to confirm your email before signing in."
                : "Use the email and password you registered with."}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <label className="block">
              <span className="mono-label mb-2 block text-ink-muted">Email</span>
              <span className="flex h-14 items-center gap-3 rounded-xl border border-border bg-white px-4 focus-within:border-primary">
                <Mail className="h-5 w-5 text-ink-muted" />
                <input
                  className="h-full flex-1 border-0 bg-transparent p-0 text-base focus:ring-0"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="mono-label mb-2 block text-ink-muted">Password</span>
              <span className="flex h-14 items-center gap-3 rounded-xl border border-border bg-white px-4 focus-within:border-primary">
                <KeyRound className="h-5 w-5 text-ink-muted" />
                <input
                  className="h-full flex-1 border-0 bg-transparent p-0 text-base focus:ring-0"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                />
              </span>
            </label>

            {message ? (
              <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-danger">
                <AlertCircle className="h-5 w-5 shrink-0" />
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mono-label flex h-14 w-full items-center justify-center rounded-lg bg-primary text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Working..." : isSignup ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-ink-muted">
            {isSignup ? "Already have an account?" : "Need an account?"}{" "}
            <Link
              href={isSignup ? "/login" : "/signup"}
              className="font-semibold text-primary hover:underline"
            >
              {isSignup ? "Sign in" : "Create one"}
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
