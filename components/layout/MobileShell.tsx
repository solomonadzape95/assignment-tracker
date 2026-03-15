import type { ReactNode } from "react";

interface MobileShellProps {
  title?: string;
  children: ReactNode;
}

export function MobileShell({ title, children }: MobileShellProps) {
  return (
    <div className="min-h-screen bg-background-light">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-4">
        {title ? (
          <header className="mb-4">
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h1>
          </header>
        ) : null}
        <main className="flex-1 pb-6">{children}</main>
      </div>
    </div>
  );
}

