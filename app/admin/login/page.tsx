"use client";

import { FormEvent, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { Gamepad2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("/admin");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const value = new URL(window.location.href).searchParams.get("callbackUrl");
    setCallbackUrl(value || "/admin");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (!result || result.error) {
      setError("Invalid admin email or password.");
      setIsSubmitting(false);
      return;
    }

    window.location.href = result.url || callbackUrl;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center shadow-2xl shadow-primary/40 mb-4">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-white/50 text-sm mt-1">Sign in with admin credentials</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm text-white/70">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-surface-900/80 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-primary/50"
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm text-white/70">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-surface-900/80 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-primary/50"
                placeholder="Enter admin password"
              />
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition-all duration-200 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Sign In
            </button>
          </form>

          <p className="text-center text-white/30 text-xs mt-4">
            User login?{" "}
            <Link href="/login" className="text-primary-400 hover:underline">
              Go to user sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
