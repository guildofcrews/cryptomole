"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function TrackingBeacon() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (pathname === lastTracked.current) return;
    lastTracked.current = pathname;

    const track = () => {
      const body = JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", body);
      } else {
        fetch("/api/track", {
          method: "POST",
          body,
          headers: { "Content-Type": "application/json" },
          keepalive: true,
        }).catch(() => {});
      }
    };

    if (document.visibilityState === "visible") {
      track();
    } else {
      const handleVisibility = () => {
        if (document.visibilityState === "visible") {
          track();
          document.removeEventListener("visibilitychange", handleVisibility);
        }
      };
      document.addEventListener("visibilitychange", handleVisibility);
      return () => {
        document.removeEventListener("visibilitychange", handleVisibility);
      };
    }
  }, [pathname]);

  return null;
}
