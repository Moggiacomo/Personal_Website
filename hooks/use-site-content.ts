"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content-types";

export function useSiteContent(initialContent: SiteContent) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/content", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load content");
        }
        const nextContent = (await response.json()) as SiteContent;
        if (active) {
          setContent(nextContent);
        }
      } catch {
        // Keep initial bundled content as a safe fallback.
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  return { content, setContent, loading };
}
