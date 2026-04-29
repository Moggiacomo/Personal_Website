"use client";

import { Calendar, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import initialSiteContent from "@/content/site-content.json";
import { PageIntro } from "@/components/page-intro";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/use-site-content";
import type { SiteContent } from "@/lib/content-types";

export function ContactPageClient() {
  const { content } = useSiteContent(initialSiteContent as SiteContent);
  const contact = content.site.contact;

  return (
    <section className="pt-8 pb-12 lg:pt-12 lg:pb-24 px-6 lg:px-12">
      <div className="max-w-2xl">
        <h2 className="text-xs uppercase tracking-widest leading-none text-muted-foreground mb-12 flex items-center gap-4">
          <span className="h-px w-8 bg-muted-foreground" />
          {contact.sectionTitle}
        </h2>

        <PageIntro
          paragraphs={content.site.pageIntro.contact}
          className="mb-12"
        />

        <div className="space-y-8">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
              {contact.headline}
            </h3>
            <p className="text-muted-foreground mt-4 whitespace-pre-line text-justify leading-relaxed">
              {contact.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {contact.emailLabel}
                </p>
                <Link
                  href={contact.emailHref}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {contact.emailValue}
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {contact.locationLabel}
                </p>
                <span className="text-foreground">{contact.locationValue}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {contact.availabilityLabel}
                </p>
                <span className="text-foreground">{contact.availabilityValue}</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href={contact.primaryButtonHref}>
                <Mail className="size-4 mr-2" />
                {contact.primaryButtonLabel}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
