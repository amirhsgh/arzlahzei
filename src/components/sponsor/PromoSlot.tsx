"use client";

import { useEffect, useRef, useState } from "react";
import type { AdItem } from "@/types";

interface PromoSlotProps {
  position: string;
  page: string;
  device?: "all" | "mobile" | "desktop";
  className?: string;
}

export function PromoSlot({ position, page, device = "all", className }: PromoSlotProps) {
  const [item, setItem] = useState<AdItem | null>(null);
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

    fetch(`/api/promo?position=${position}&page=${page}&device=${device}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) {
          setItem(data);
          // Record impression
          fetch("/api/analytics/view-log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adId: data.id, page }),
          });
        }
      })
      .catch(() => {});
  }, [visible, position, page, device]);

  const handleClick = () => {
    if (!item) return;
    fetch("/api/analytics/click-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId: item.id, page }),
    });
  };

  if (!item && visible) return null;

  return (
    <div ref={ref} className={className}>
      {item && (
        <div onClick={handleClick}>
          {item.imageUrl ? (
            <a
              href={item.linkUrl || "#"}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full rounded-lg"
                loading="lazy"
              />
            </a>
          ) : item.htmlCode ? (
            <div dangerouslySetInnerHTML={{ __html: item.htmlCode }} />
          ) : null}
        </div>
      )}
    </div>
  );
}
