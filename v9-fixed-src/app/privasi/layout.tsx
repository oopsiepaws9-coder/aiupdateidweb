import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  alternates: { canonical: "/privasi" },
};

export default function RouteLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
