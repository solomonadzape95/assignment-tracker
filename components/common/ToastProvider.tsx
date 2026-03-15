"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = ++idCounter;
    const toast: Toast = { id, message, variant };
    setToasts((current) => [...current, toast]);
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <div className="flex w-full max-w-md flex-col gap-2">
          {toasts.map((toast) => {
            const base =
              "pointer-events-auto rounded-lg px-3 py-2 text-sm shadow-md border bg-white";
            const variantStyles =
              toast.variant === "success"
                ? "border-emerald-200 text-emerald-800"
                : toast.variant === "error"
                ? "border-red-200 text-red-800"
                : "border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200";
            return (
              <div key={toast.id} className={`${base} ${variantStyles}`}>
                {toast.message}
              </div>
            );
          })}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return ctx;
}

