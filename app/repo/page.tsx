"use client";

import initialSiteContent from "@/content/site-content.json";
import { PageLayout } from "@/components/page-layout";
import { PageIntro } from "@/components/page-intro";
import { RepoGrid } from "@/components/repo-grid";
import { useSiteContent } from "@/hooks/use-site-content";
import type { SiteContent } from "@/lib/content-types";

export default function RepoPage() {
  const { content } = useSiteContent(initialSiteContent as SiteContent);

  return (
    <PageLayout>
      <section className="px-6 pt-8 pb-12 lg:px-12 lg:pt-12 lg:pb-24">
        <div className="mx-auto w-full max-w-full">
          <h2 className="mb-12 flex items-center gap-4 text-xs leading-none uppercase tracking-widest text-muted-foreground">
            <span className="h-px w-8 bg-muted-foreground" />
            {content.site.headers.repo}
          </h2>

          <PageIntro
            paragraphs={content.site.pageIntro.repo}
            className="mb-12"
          />

          <RepoGrid items={content.repo} />
        </div>
      </section>
    </PageLayout>
  );
}
