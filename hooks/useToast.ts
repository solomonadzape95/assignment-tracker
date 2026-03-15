"use client";

import { useToastContext } from "@/components/common/ToastProvider";

export function useToast() {
  const { showToast } = useToastContext();
  return { showToast };
}

