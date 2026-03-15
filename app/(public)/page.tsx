"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { getStudentByRegNoClient } from "@/services/students";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { useToast } from "@/hooks/useToast";

export default function PublicLandingPage() {
  const router = useRouter();
  const [regNo, setRegNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const value = regNo.trim();
    if (!value) {
      setError("Please enter your registration number.");
      return;
    }

    setLoading(true);
    try {
      const student = await getStudentByRegNoClient(value);

      if (!student) {
        const msg = "No student found with that registration number.";
        setError(msg);
        showToast(msg, "error");
        return;
      }

      router.push(`/verify?studentId=${student.id}`);
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
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased flex flex-col">
      {/* Top navigation - aligned with ui/landing */}
      <nav className="sticky top-0 z-50 w-full glass-effect border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
              {/* Change logo to book */}
              <Icon name="book" size={24} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              UniTask
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm font-bold">
           
            <Link
              href="/sign-in"
              className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:text-primary transition-colors"
            >
              Log in
            </Link>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("verify-start");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="bg-primary text-white px-5 py-2.5 rounded-full hover:bg-primary-dark transition-all shadow-md active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero section */}
        <section className="relative pt-16 pb-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-500/10 blur-[100px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex flex-col gap-6 lg:w-1/2 text-center lg:text-left">
        
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white">
                  Master your{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-indigo-500">
                    semester
                  </span>{" "}
                  with ease
                </h1>
                <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  The intelligent assignment tracker built for your class. Verify your
                  student record, connect your profile, and never miss a deadline again.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("verify-start");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="px-7 py-3 bg-primary text-white rounded-2xl font-bold text-sm md:text-base shadow-xl shadow-primary/25 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95"
                  >
                    Start Tracking Free
                  </button>
                
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
                  <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                    Used by your entire class for a single view of every assignment.
                  </p>
                </div>
              </div>

              {/* Right column: verification entry card */}
              <div
                id="verify-start"
                className="lg:w-1/2 w-full max-w-md lg:max-w-none mx-auto"
              >
                <div className="rounded-2xl border border-slate-200/80 bg-white/90 dark:bg-slate-900/90 shadow-2xl shadow-primary/10 p-6 sm:p-7 space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Get started in seconds
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Enter your university registration number to verify your record.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="reg_no"
                        className="block text-xs font-semibold text-slate-500 uppercase tracking-wider"
                      >
                        Registration number
                      </label>
                      <input
                        id="reg_no"
                        name="reg_no"
                        type="text"
                        autoComplete="off"
                        placeholder="e.g. 2022/101101"
                        value={regNo}
                        onChange={(e) => setRegNo(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
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
                      className="bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                    >
                      {loading ? "Checking..." : "Continue"}
                    </Button>
                  </form>

                  <p className="text-center text-xs text-slate-500 pt-1">
                    Already verified?{" "}
                    <Link href="/sign-in" className="text-primary font-bold">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section
          id="features"
          className="py-20 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100/80 dark:border-slate-800/80"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-primary font-bold tracking-widest text-xs uppercase mb-3">
                Core Platform
              </h2>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                Everything your class needs
              </h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                A focused assignment tracker built for a single cohort. Simple for
                students, powerful for admins.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Card 1: Smart tracking */}
              <div className="group p-6 md:p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  {/* Main icon for the card */}
                  <Icon name="track_changes" size={32} />
                </div>
                <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Icon name="task_alt" size={22} className="text-primary" aria-label="Smart tracking icon" />
                  Smart tracking
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  See every assignment in one timeline with clear statuses and
                  deadline indicators.
                </p>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-center gap-2">
                    <Icon name="schedule" size={18} className="text-primary" aria-label="Deadline icon" />
                    Auto-sorted by nearest deadline
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="visibility" size={18} className="text-primary" aria-label="Progress icon" />
                    Progress at a glance
                  </li>
                </ul>
              </div>

              {/* Card 2: Timely reminders */}
              <div className="group p-6 md:p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-6 group-hover:scale-110 transition-transform">
                  {/* Main icon for the card */}
                  <Icon name="alarm" size={32} />
                </div>
                <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Icon name="notifications_active" size={22} className="text-indigo-500" aria-label="Reminders icon" />
                  Timely reminders
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Students get gentle nudges before deadlines, and admins see who is
                  falling behind.
                </p>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-center gap-2">
                    <Icon name="email" size={18} className="text-indigo-500" aria-label="Email icon" />
                    Email notifications on new assignments
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="priority_high" size={18} className="text-indigo-500" aria-label="Alert icon" />
                    Alerts for <span className="font-semibold">sub-24h</span>{" "}
                    deadlines
                  </li>
                </ul>
              </div>

              {/* Card 3: Admin insights */}
              <div className="group p-6 md:p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-500 mb-6 group-hover:scale-110 transition-transform">
                  {/* Main icon for the card */}
                  <Icon name="insights" size={32} />
                </div>
                <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Icon name="admin_panel_settings" size={22} className="text-violet-500" aria-label="Admin icon" />
                  Admin insights
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  A simple admin view for creating assignments and monitoring class
                  progress.
                </p>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-center gap-2">
                    <Icon name="publish" size={18} className="text-violet-500" aria-label="Publish icon" />
                    One form to publish to everyone
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="bar_chart" size={18} className="text-violet-500" aria-label="Metrics icon" />
                    Completion and engagement metrics
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="relative bg-primary rounded-3xl p-8 md:p-14 text-center overflow-hidden shadow-2xl shadow-primary/40">
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-indigo-900/20 rounded-full blur-3xl" />
              <div className="relative z-10 space-y-6">
                <h2 className="text-2xl md:text-4xl font-black text-white">
                  Ready to run your semester on rails?
                </h2>
                <p className="text-indigo-100 text-sm md:text-lg max-w-2xl mx-auto">
                  Verify once, sign in anywhere, and keep every assignment,
                  countdown, and course in sync for your entire class.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("verify-start");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="px-8 py-3 bg-white text-primary rounded-2xl font-bold text-sm md:text-base hover:bg-slate-50 transition-all shadow-lg active:scale-95"
                  >
                    Begin verification
                  </button>
                  <Link
                    href="/sign-in"
                    className="px-8 py-3 bg-primary-dark text-white rounded-2xl font-bold text-sm md:text-base hover:bg-indigo-700 transition-all border border-white/20 inline-flex items-center justify-center"
                  >
                    Already verified? Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-primary p-1.5 rounded-lg shadow-sm">
                {/* Footer logo book */}
                <Icon name="book" size={18} className="text-white" />
              </div>
              <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
                UniTask
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              © {new Date().getFullYear()} UniTask. Built for your cohort.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}