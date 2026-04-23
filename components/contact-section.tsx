"use client";

import { Mail, MapPin } from "lucide-react";
import Link from "next/link";
import initialSiteContent from "@/content/site-content.json";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/use-site-content";
import type { SiteContent } from "@/lib/content-types";

export function ContactSection() {
  const { content } = useSiteContent(initialSiteContent as SiteContent);
  const contact = content.site.contact;

  return (
    <section
      id="contact"
      className="bg-card/50 px-6 pt-16 pb-24 lg:px-0 lg:pt-20"
    >
      <div className="mx-auto w-full max-w-full">
        <h2 className="mb-12 flex items-center gap-4 text-xs leading-none uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-8 bg-muted-foreground" />
          {contact.sectionTitle}
        </h2>
        <div className="max-w-2xl space-y-8">
          <div>
            <h3 className="text-3xl font-bold text-balance text-foreground md:text-4xl">
              {contact.headline}
            </h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {contact.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="size-5 text-primary" />
              <Link
                href={contact.emailHref}
                className="transition-colors hover:text-foreground"
              >
                {contact.emailValue}
              </Link>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="size-5 text-primary" />
              <span>{contact.locationValue}</span>
            </div>
          </div>

          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href={contact.primaryButtonHref}>{contact.primaryButtonLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { content } = useSiteContent(initialSiteContent as SiteContent);

  return (
    <footer className="border-t border-border px-6 py-8 lg:px-0">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {content.site.footer.copyrightName}. All rights reserved.
        </p>
        <div className="flex items-center gap-4 self-end md:self-auto">
          <p className="text-xs text-muted-foreground">
            {content.site.footer.builtWith}
          </p>
          <Link
            href="/editor"
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {content.site.navigation.editor}
          </Link>
        </div>
      </div>
    </footer>
  );
}
