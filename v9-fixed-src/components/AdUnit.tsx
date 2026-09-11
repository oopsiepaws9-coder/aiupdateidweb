"use client";

import { useEffect, useRef } from "react";

type AdUnitProps = {
  slot?: string;
  placement: string;
  className?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || "";
const isValidClient = /^ca-pub-\d{10,}$/.test(client);

function isValidSlot(value?: string) {
  return /^\d{5,20}$/.test(value?.trim() || "");
}

export default function AdUnit({
  slot,
  placement,
  className = "",
  format = "auto"
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const ad = adRef.current;
    if (!ad || ad.dataset.initialized === "true") return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      ad.dataset.initialized = "true";
    } catch {
      // An ad blocker or delayed network request must never break the page.
    }
  }, []);

  // Slots are created in AdSense. Until both values are configured, render
  // nothing so unfinished monetization never creates empty boxes for readers.
  if (!isValidClient || !isValidSlot(slot)) return null;

  return (
    <aside className={`adUnit adUnit--${placement} ${className}`.trim()} aria-label="Iklan">
      <span className="adUnitLabel">IKLAN</span>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
