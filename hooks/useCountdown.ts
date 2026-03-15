"use client";

import { useEffect, useState } from "react";
import { getTimeRemaining, type TimeRemaining } from "@/utils/dates";

export function useCountdown(deadline: string | Date): TimeRemaining {
  const [remaining, setRemaining] = useState<TimeRemaining>(() =>
    getTimeRemaining(deadline)
  );

  useEffect(() => {
    setRemaining(getTimeRemaining(deadline));

    const interval = setInterval(() => {
      setRemaining(getTimeRemaining(deadline));
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  return remaining;
}

