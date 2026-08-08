"use client";

import { useMemo, useState } from "react";

type Props = {
  provider?: string | null;
  name?: string | null;
  logoUrl?: string | null;
  large?: boolean;
};

type BrandConfig = {
  simpleIcon: string;
  fallbackDomain: string;
  label: string;
};

const BRAND_MAP: Array<[RegExp, BrandConfig]> = [
  [/openai/i, {
    simpleIcon: "openai",
    fallbackDomain: "openai.com",
    label: "OpenAI"
  }],
  [/(google|gemini|deepmind)/i, {
    simpleIcon: "googlegemini",
    fallbackDomain: "gemini.google.com",
    label: "Google Gemini"
  }],
  [/anthropic/i, {
    simpleIcon: "anthropic",
    fallbackDomain: "anthropic.com",
    label: "Anthropic"
  }],
  [/(spacexai|\bxai\b|x\.ai)/i, {
    simpleIcon: "xai",
    fallbackDomain: "x.ai",
    label: "xAI"
  }],
  [/deepseek/i, {
    simpleIcon: "deepseek",
    fallbackDomain: "deepseek.com",
    label: "DeepSeek"
  }],
  [/\bmeta\b|llama/i, {
    simpleIcon: "meta",
    fallbackDomain: "meta.com",
    label: "Meta"
  }],
  [/mistral/i, {
    simpleIcon: "mistralai",
    fallbackDomain: "mistral.ai",
    label: "Mistral AI"
  }],
  [/microsoft/i, {
    simpleIcon: "microsoft",
    fallbackDomain: "microsoft.com",
    label: "Microsoft"
  }]
];

function initials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function BrandLogo({ provider, name, logoUrl, large = false }: Props) {
  const config = useMemo(() => {
    const haystack = `${provider || ""} ${name || ""}`;
    return BRAND_MAP.find(([pattern]) => pattern.test(haystack))?.[1] || null;
  }, [provider, name]);

  const sources = useMemo(() => {
    const values: string[] = [];
    if (logoUrl) values.push(logoUrl);

    if (config) {
      values.push(`https://cdn.simpleicons.org/${config.simpleIcon}/ffffff`);
      values.push(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(config.fallbackDomain)}&sz=128`);
    }

    return Array.from(new Set(values));
  }, [logoUrl, config]);

  const [sourceIndex, setSourceIndex] = useState(0);
  const source = sourceIndex < sources.length ? sources[sourceIndex] : undefined;
  const fallback = initials(name || provider || "AI");

  if (!source) {
    return (
      <div className={`brandLogo ${large ? "large" : ""} fallback`} aria-label={provider || name || "AI"}>
        <span>{fallback}</span>
      </div>
    );
  }

  return (
    <div className={`brandLogo ${large ? "large" : ""}`} title={config?.label || provider || name || "AI"}>
      <img
        src={source}
        alt={`${config?.label || provider || name || "AI"} logo`}
        referrerPolicy="no-referrer"
        onError={() => {
          if (sourceIndex < sources.length - 1) setSourceIndex(sourceIndex + 1);
          else setSourceIndex(sources.length);
        }}
      />
    </div>
  );
}
