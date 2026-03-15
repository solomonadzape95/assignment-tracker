import Link from "next/link";
import { VerificationCard } from "@/components/auth/VerificationCard";
import { SignupForm } from "@/components/auth/SignupForm";
import { getStudentByIdServer } from "@/services/students-server";
import { Icon } from "@/components/common/Icon";

interface VerifyPageProps {
  searchParams: Promise<{
    studentId?: string;
  }>;
}

export default async function VerifyStudentPage({
  searchParams,
}: VerifyPageProps) {
  const { studentId } = await searchParams;

  if (!studentId) {
    return (
      <main className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md px-6 text-center space-y-3">
          <p className="text-sm font-medium text-slate-900">
            Missing student information
          </p>
          <p className="text-sm text-slate-500">
            Please go back and enter your registration number again.
          </p>
        </div>
      </main>
    );
  }

  const student = await getStudentByIdServer(studentId);

  if (!student) {
    return (
      <main className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md px-6 text-center space-y-3">
          <p className="text-sm font-medium text-slate-900">
            Student record not found
          </p>
          <p className="text-sm text-slate-500">
            The linked student record could not be found. Please restart the
            verification process.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-slate-900 shadow-xl overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center bg-white dark:bg-slate-900 p-4 pb-2 justify-between border-b border-slate-100 dark:border-slate-800">
          <Link
            href="/"
            className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100"
          >
            <Icon name="arrow_back" size={24} />
          </Link>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
            Verification
          </h2>
        </div>

        {/* Progress Stepper */}
        <div className="flex w-full flex-row items-center justify-center gap-4 py-6">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
              1
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Identify
            </span>
          </div>
          <div className="h-[2px] w-8 bg-slate-200 -mt-6" />
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
              2
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Confirm
            </span>
          </div>
          <div className="h-[2px] w-8 bg-slate-200 -mt-6" />
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm font-bold">
              3
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Account
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 px-6 pb-24 overflow-y-auto">
          {/* Step 2: Verification Card */}
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-slate-900 text-lg font-bold">
                Verify it&apos;s you
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">
                Record found
              </span>
            </div>
            <VerificationCard student={student} />
          </section>

          {/* Step 3: Account creation */}
          <section className="mb-10">
            <div className="mb-4">
              <h3 className="text-slate-900 text-xl font-bold leading-tight">
                Secure your account
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Set up your login credentials.
              </p>
            </div>
            <SignupForm
              studentId={student.id}
              studentName={student.fullname}
            />
          </section>
        </div>

        {/* Bottom helper */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-4">
          <div className="flex items-center justify-center gap-1">
            <p className="text-slate-500 text-sm">
              Already verified?
            </p>
            <a href="/sign-in" className="text-primary font-bold text-sm">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}


