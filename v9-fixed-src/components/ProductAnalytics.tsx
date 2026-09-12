"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackProductEvent } from "@/lib/product-analytics";

function routeType(pathname: string) {
  if (pathname.startsWith("/advisor")) return "advisor";
  if (pathname.startsWith("/troubleshooter")) return "troubleshooter";
  if (pathname.startsWith("/workflow")) return "workflow";
  if (pathname.startsWith("/artikel/")) return "article";
  if (pathname.startsWith("/tools/")) return "tool";
  if (pathname.startsWith("/compare/")) return "compare";
  if (pathname.startsWith("/glossary/")) return "glossary";
  return "other";
}

export default function ProductAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    trackProductEvent("page_view", "site", { route_type: routeType(pathname) });
  }, [pathname]);

  return null;
}
