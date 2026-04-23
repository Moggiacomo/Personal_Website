"use client";

import { useEffect, useState } from "react";
import initialSiteContent from "@/content/site-content.json";
import { useSiteContent } from "@/hooks/use-site-content";
import { PageLayout } from "@/components/page-layout";
import { PortfolioCards } from "@/components/portfolio-cards";
import type { SiteContent } from "@/lib/content-types";

export default function PortfolioPage() {
  const [expandedFromHash, setExpandedFromHash] = useState<string | null>(null);
  const { content } = useSiteContent(initialSiteContent as SiteContent);

  useEffect(() => {
    const syncExpandedFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      setExpandedFromHash(hash || null);
    };

    syncExpandedFromHash();
    window.addEventListener("hashchange", syncExpandedFromHash);

    return () => window.removeEventListener("hashchange", syncExpandedFromHash);
  }, []);

  return (
    <PageLayout>
      <section className="pt-8 pb-12 lg:pt-12 lg:pb-24 px-6 lg:px-12">
        <div className="max-w-full mx-auto w-full">
          <h2 className="text-xs uppercase tracking-widest leading-none text-muted-foreground mb-12 flex items-center gap-4">
            <span className="h-px w-8 bg-muted-foreground" />
            {content.site.headers.portfolio}
          </h2>

          <PortfolioCards
            projects={content.portfolio}
            layout="stack"
            idPrefix="project"
            initialExpandedId={expandedFromHash}
          />
        </div>
      </section>
    </PageLayout>
  );
}
