import React, { isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const CALLOUT_PATTERN = /^(💡\s*)?(tips?|tip praktis)$|^(⚠️?\s*)?(peringatan|kesalahan umum|hindari)$|^(📌\s*)?(intinya|ringkasan|poin penting)$|^(⭐\s*)?(pandangan aiupdateid|catatan editor)$|^(📚\s*)?(lanjut belajar|baca selanjutnya)$|^(✅\s*)?(contoh yang baik|rekomendasi)$/i;

function stripOuterFence(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(
    /^```(?:text|markdown|md)?(?:\s+id="[^"]+")?\s*\n([\s\S]*?)\n```$/i
  );
  return match ? match[1].trim() : trimmed;
}

function isCalloutLabel(line: string) {
  return CALLOUT_PATTERN.test(line.trim());
}

function groupEditorialCallouts(value: string) {
  const lines = value.split("\n");
  const output: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (!isCalloutLabel(line)) {
      output.push(line);
      continue;
    }

    const block: string[] = [line.trim()];
    let cursor = index + 1;

    while (cursor < lines.length) {
      const candidate = lines[cursor];
      const trimmed = candidate.trim();

      if (/^#{1,6}\s+/.test(trimmed) || isCalloutLabel(trimmed)) break;

      block.push(candidate);
      cursor += 1;
    }

    const meaningful = block.join("\n").trim().split("\n");
    meaningful.forEach((item) => {
      output.push(item.trim() ? `> ${item}` : ">");
    });
    output.push("");
    index = cursor - 1;
  }

  return output.join("\n");
}

function normalizeMarkdown(value: string) {
  const normalized = stripOuterFence(value)
    .replace(/\r\n?/g, "\n")
    // Markdown syntax may arrive with accidental indentation from copy/paste.
    .replace(/^[ \t]{1,3}(?=#{1,6}\s*\S)/gm, "")
    .replace(/^(#{1,6})(?!#)(?=\S)/gm, "$1 ")
    // Remove redundant heading hashes copied into the heading text.
    // Examples: "## # Judul" -> "## Judul", "### ## Judul" -> "### Judul".
    .replace(/^(#{1,6})\s+#+\s*/gm, "$1 ")
    // The page title already owns the document H1.
    .replace(/^#\s+/gm, "## ")
    .replace(/^[ \t]{1,3}(?=>\s*\S)/gm, "")
    .replace(/^>(?=\S)/gm, "> ")
    .replace(/^[ \t]{1,3}(?=[-*+]\s*\S)/gm, "")
    .replace(/^[-*+](?=\S)/gm, "- ")
    .replace(/^[ \t]{1,3}(?=\d+\.\s*\S)/gm, "")
    .replace(/^(\d+\.)(?=\S)/gm, "$1 ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return groupEditorialCallouts(normalized);
}

function childrenToText(children: React.ReactNode): string {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }
      if (isValidElement<{ children?: React.ReactNode }>(child)) {
        return childrenToText(child.props.children);
      }
      return "";
    })
    .join("")
    .trim();
}

function cleanHeadingText(value: string) {
  return value
    .replace(/^\s*#+\s*/, "")
    .replace(/^\s*\\#+\s*/, "")
    .trim();
}

function headingId(value: string) {
  return cleanHeadingText(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function calloutType(text: string) {
  const value = text.toLowerCase().trim();
  if (/^(💡\s*)?(tips?|tip praktis)\b/.test(value)) return "tip";
  if (/^(⚠️?\s*)?(peringatan|kesalahan umum|hindari)\b/.test(value)) return "warning";
  if (/^(📌\s*)?(intinya|ringkasan|poin penting)\b/.test(value)) return "summary";
  if (/^(⭐\s*)?(pandangan aiupdateid|catatan editor)\b/.test(value)) return "editor";
  if (/^(📚\s*)?(lanjut belajar|baca selanjutnya)\b/.test(value)) return "learn";
  if (/^(✅\s*)?(contoh yang baik|rekomendasi)\b/.test(value)) return "success";
  return "quote";
}

export default function ArticleBody({ content }: { content: string }) {
  return (
    <div className="prose editorialProse">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => {
            const text = cleanHeadingText(childrenToText(children));
            return <h2 id={headingId(text)} className="articleSectionHeading" data-markdown-level="2">{text}</h2>;
          },
          h2: ({ children }) => {
            const text = cleanHeadingText(childrenToText(children));
            return <h2 id={headingId(text)} className="articleSectionHeading" data-markdown-level="2">{text}</h2>;
          },
          h3: ({ children }) => {
            const text = cleanHeadingText(childrenToText(children));
            return <h3 id={headingId(text)} className="articleSubheading" data-markdown-level="3">{text}</h3>;
          },
          blockquote: ({ children }) => {
            const text = childrenToText(children);
            const type = calloutType(text);
            return (
              <blockquote className={`editorialCallout ${type}`}>
                {children}
              </blockquote>
            );
          },
          ul: ({ children }) => <ul className="editorialList">{children}</ul>,
          ol: ({ children }) => <ol className="editorialList numbered">{children}</ol>,
          table: ({ children }) => (
            <div
              className="articleTableScroller"
              role="region"
              aria-label="Tabel artikel, geser horizontal untuk melihat semua kolom"
              tabIndex={0}
            >
              <table>{children}</table>
            </div>
          ),
          a: ({ children, href, ...props }) => {
            const internal = Boolean(
              href?.startsWith("/") || href?.includes("aiupdateid")
            );
            return (
              <a
                href={href}
                {...props}
                {...(!internal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {children}
              </a>
            );
          },
          code: ({ children, className, ...props }) => {
            const isBlock = Boolean(className);
            return isBlock ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code className="inlineCode" {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {normalizeMarkdown(content)}
      </ReactMarkdown>
    </div>
  );
}
