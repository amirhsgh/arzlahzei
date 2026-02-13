"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: pathname,
        referrer: document.referrer,
      }),
    }).catch(() => {});
  }, [pathname]);
}
