"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { useToast } from "@/hooks/useToast";

export default function SignInPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!supabaseBrowserClient) {
      const msg =
        "Supabase is not configured. Please contact the administrator.";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    if (!email || !password) {
      const msg = "Please enter both email and password.";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } =
        await supabaseBrowserClient.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError(signInError.message);
        showToast(signInError.message, "error");
        return;
      }

      showToast("Signed in successfully.", "success");
      router.replace("/dashboard");
    } catch (err) {
      console.error(err);
      const msg = "Something went wrong. Please try again.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-background-dark font-display text-slate-100 min-h-dvh flex items-center justify-center px-4">
      <div className="relative flex min-h-[480px] w-full max-w-lg md:max-w-2xl flex-col md:flex-row bg-slate-950 shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden border border-slate-800">
        {/* Back button (desktop/tablet) */}
        <button
          type="button"
          className="hidden md:flex absolute top-3 left-3 text-slate-300 size-9 items-center justify-center rounded-full hover:bg-slate-800 transition-colors z-10"
          onClick={() => router.push("/")}
          aria-label="Back to landing"
        >
          <Icon name="arrow_back" size={22} />
        </button>
        {/* Left column: app icon + intro (visible on larger screens) */}
        <div className="hidden md:flex md:w-2/5 flex-col items-center justify-center bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800 p-6">
          <div className="flex flex-col items-center gap-4 text-center max-w-xs">
            <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/40">
              <Icon name="book" size={28} className="text-white" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
                UniTask
              </p>
              <h2 className="text-lg font-bold text-slate-50">
                Welcome back
              </h2>
              <p className="text-xs text-slate-300">
                Sign in with the email and password you used when creating your
                account to get back to your assignment timeline.
              </p>
            </div>
          </div>
        </div>

        {/* Header (mobile) */}
        <div className="flex md:hidden items-center bg-slate-950/80 backdrop-blur-sm p-4 pb-2 justify-between border-b border-slate-800">
          <button
            type="button"
            className="text-slate-200 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-800 transition-colors"
            onClick={() => router.push("/")}
          >
            <Icon name="arrow_back" size={24} />
          </button>
          <h2 className="text-slate-50 text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
            Sign in
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 pb-24 pt-6 overflow-y-auto space-y-6 bg-slate-950">
          <section className="space-y-3">
            <h3 className="text-xl font-bold leading-tight text-slate-50">
              Welcome back 👋
            </h3>
            <p className="text-sm text-slate-300">
              Sign in with the email and password you used when creating your
              account.
            </p>
          </section>

          <section>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-400 uppercase mb-1 ml-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-400 uppercase mb-1 ml-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-16 rounded-xl border border-slate-700 bg-slate-900 text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center px-2 text-xs font-semibold text-slate-300 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error ? (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                className="bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/40 hover:bg-primary/90 transition-all"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </section>
        </div>

        {/* Bottom helper */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-6 py-4">
          <div className="flex items-center justify-center gap-1">
            <p className="text-slate-300 text-sm">
              Don&apos;t have an account?
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-primary font-bold text-sm"
            >
              Verify &amp; sign up
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

