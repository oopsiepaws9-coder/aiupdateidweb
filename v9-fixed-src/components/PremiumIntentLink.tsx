"use client";

import { ArrowRight } from "lucide-react";
import { trackProductEvent } from "@/lib/product-analytics";

export default function PremiumIntentLink({ href }: { href: string }) {
  return (
    <a
      className="primary"
      href={href}
      onClick={() =>
        trackProductEvent("premium_intent", "monetization", {
          product_slug: "ai_content_workflow_kit_indonesia",
          price_idr: 49000,
          intent: "early_access",
        })
      }
    >
      Minta akses awal <ArrowRight size={16} />
    </a>
  );
}
