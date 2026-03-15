"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/components/common/ToastProvider";

export function ClientProviders({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}

