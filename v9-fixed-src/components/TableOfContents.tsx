"use client";

import { useEffect, useState } from "react";

type Item = { id: string; text: string; level: number };

export default function TableOfContents() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    // Wait a moment so headings rendered by ReactMarkdown are already in the DOM.
    const timer = window.setTimeout(() => {
      const headings = Array.from(
        document.querySelectorAll<HTMLElement>(".editorialProse h2, .editorialProse h3")
      );

      const mapped = headings
        .map((heading, index) => {
          const id = heading.id || `bagian-${index + 1}`;
          heading.id = id;
          return {
            id,
            text: heading.textContent?.trim() || "",
            level: heading.tagName === "H2" ? 2 : 3
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
      <div className="tocTitle">Daftar Isi</div>
      <ol>
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "tocSub" : ""}>
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
