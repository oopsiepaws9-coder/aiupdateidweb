"use client";

import { useEffect, useState } from "react";

type Item = { id: string; text: string };

export default function TableOfContents() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    // Wait a moment so headings rendered by ReactMarkdown are already in the DOM.
    const timer = window.setTimeout(() => {
      const headings = Array.from(
        document.querySelectorAll<HTMLElement>(".editorialProse h2")
      );

      const mapped = headings
        .map((heading, index) => {
          const id = heading.id || `bagian-${index + 1}`;
          heading.id = id;
          return {
            id,
            text: heading.textContent?.trim() || ""
          };
        })
        .filter((item) => item.text);

      setItems(mapped);
    }, 80);

    return () => window.clearTimeout(timer);
  }, []);

  if (!items.length) return null;

  return (
    <nav className="tocBox" aria-label="Daftar isi">
      <details className="tocDetails">
        <summary className="tocTitle">
          <span>Daftar Isi</span>
          <span className="tocMeta">
            {items.length} bagian <span className="tocChevron" aria-hidden="true">⌄</span>
          </span>
        </summary>
        <ol>
          {items.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.text}</a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
