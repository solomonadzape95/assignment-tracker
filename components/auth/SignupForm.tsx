"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/common/Button";
import { useToast } from "@/hooks/useToast";

interface SignupFormProps {
  studentId: string;
  studentName: string;
}

export function SignupForm({ studentId, studentName }: SignupFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          studentId,
          studentName,
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok || result.error) {
        const msg =
          result.error ?? "Failed to create your account. Please try again.";
        setError(msg);
        showToast(msg, "error");
        return;
      }
      // Automatically sign the user in now that their account exists and is confirmed.
      const { error: signInError } =
        await supabaseBrowserClient.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        const msg =
          signInError.message ||
          "Account created, but we couldn't sign you in automatically. Please try signing in.";
        setError(msg);
        showToast(msg, "error");
        return;
      }

      const successMsg = "Account created and signed in successfully.";
      setMessage(successMsg);
      showToast(successMsg, "success");
      router.replace("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-xs font-semibold text-slate-300 uppercase mb-1 ml-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-xs font-semibold text-slate-300 uppercase mb-1 ml-1"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
          required
        />
      </div>

      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="text-sm text-emerald-400" role="status">
          {message}
        </p>
      ) : null}

      <Button
        type="submit"
        fullWidth
        disabled={loading}
        className="bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
      >
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}

