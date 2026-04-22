"use client";

import { useEffect, useState } from "react";
import { PageLayout } from "@/components/page-layout";
import { PortfolioCards } from "@/components/portfolio-cards";
import { projects } from "@/lib/projects";

export default function PortfolioPage() {
  const [expandedFromHash, setExpandedFromHash] = useState<string | null>(null);

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
            Selected Work
          </h2>

          <PortfolioCards
            projects={projects}
            layout="stack"
            idPrefix="project"
            expandedIdOverride={expandedFromHash}
            onInteractionStart={() => {
              if (expandedFromHash) {
                setExpandedFromHash(null);
              }
            }}
          />
        </div>
      </section>
    </PageLayout>
  );
}
