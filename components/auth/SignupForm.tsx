"use client";

import { useState, type FormEvent } from "react";
import { supabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/common/Button";
import { useToast } from "@/hooks/useToast";

interface SignupFormProps {
  studentId: string;
  studentName: string;
}

export function SignupForm({ studentId, studentName }: SignupFormProps) {
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
      const origin =
        typeof window !== "undefined" ? window.location.origin : undefined;

      const { error: signUpError } = await supabaseBrowserClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: origin
            ? `${origin}/dashboard`
            : undefined,
          data: {
            student_id: studentId,
            full_name: studentName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        showToast(signUpError.message, "error");
        return;
      }

      const successMsg =
        "Account created. Check your email for the verification link.";
      setMessage(successMsg);
      showToast(successMsg, "success");
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
          className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
          required
        />
      </div>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="text-sm text-emerald-700" role="status">
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

