"use client";

import initialSiteContent from "@/content/site-content.json";
import { PageIntro } from "@/components/page-intro";
import { PublicationCards } from "@/components/publication-cards";
import { useSiteContent } from "@/hooks/use-site-content";
import type { SiteContent } from "@/lib/content-types";

export function PublicationsPageClient() {
  const { content } = useSiteContent(initialSiteContent as SiteContent);

  return (
    <>
      <h2 className="mb-12 flex items-center gap-4 text-xs leading-none uppercase tracking-widest text-muted-foreground">
        <span className="h-px w-8 bg-muted-foreground" />
        {content.site.headers.publications}
      </h2>

      <PageIntro
        paragraphs={content.site.pageIntro.publications}
        className="mb-12"
      />

      <PublicationCards
        publications={content.publications}
        layout="stack"
        idPrefix="publication"
      />
    </>
  );
}
