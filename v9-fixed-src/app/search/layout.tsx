import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

export default function RouteLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
