"use client";

import { useEffect, useRef, useState } from "react";
import type { AdItem } from "@/types";

interface AdSlotProps {
  position: string;
  page: string;
  device?: "all" | "mobile" | "desktop";
  className?: string;
}

export function AdSlot({ position, page, device = "all", className }: AdSlotProps) {
  const [ad, setAd] = useState<AdItem | null>(null);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          setVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    fetch(`/api/ads?position=${position}&page=${page}&device=${device}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) {
          setAd(data);
          // Record impression
          fetch("/api/analytics/ad-impression", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adId: data.id, page }),
          });
        }
      })
      .catch(() => {});
  }, [visible, position, page, device]);

  const handleClick = () => {
    if (!ad) return;
    fetch("/api/analytics/ad-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId: ad.id, page }),
    });
  };

  if (!ad && visible) return null;

  return (
    <div ref={ref} className={className}>
      {ad && (
        <div onClick={handleClick}>
          {ad.imageUrl ? (
            <a
              href={ad.linkUrl || "#"}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="w-full rounded-lg"
                loading="lazy"
              />
            </a>
          ) : ad.htmlCode ? (
            <div dangerouslySetInnerHTML={{ __html: ad.htmlCode }} />
          ) : null}
        </div>
      )}
    </div>
  );
}
