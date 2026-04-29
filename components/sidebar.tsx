"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import initialSiteContent from "@/content/site-content.json";
import { useSiteContent } from "@/hooks/use-site-content";
import { getExternalLinkIcon, hasUsableLink } from "@/lib/external-links";
import type { SiteContent } from "@/lib/content-types";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { content, loading } = useSiteContent(initialSiteContent as SiteContent);
  const brandingIconRef = useRef<HTMLAnchorElement>(null);
  const brandingTextRef = useRef<HTMLDivElement>(null);
  const [brandingIconSize, setBrandingIconSize] = useState<number | null>(null);
  const [isNarrowBranding, setIsNarrowBranding] = useState(false);
  const navItems = [
    { href: "/", label: content.site.navigation.about },
    { href: "/cv", label: content.site.navigation.cv },
    { href: "/publications", label: content.site.navigation.publications },
    { href: "/portfolio", label: content.site.navigation.portfolio },
    { href: "/repo", label: content.site.navigation.repo },
    { href: "/contact", label: content.site.navigation.contact },
  ];
  const socialLinks = [
    { href: content.site.social.github, label: "GitHub" },
    { href: content.site.social.linkedin, label: "LinkedIn" },
    { href: content.site.social.twitter, label: "Twitter" },
    { href: content.site.social.instagram, label: "Instagram" },
    { href: content.site.social.youtube, label: "YouTube" },
    { href: content.site.social.email, label: "Email" },
  ].filter((social) => hasUsableLink(social.href));

  useLayoutEffect(() => {
    const iconElement = brandingIconRef.current;
    const textElement = brandingTextRef.current;
    if (!iconElement || !textElement) return;

    const updateSize = () => {
      let nextSize = brandingIconSize ?? textElement.getBoundingClientRect().height;

      for (let iteration = 0; iteration < 8; iteration += 1) {
        iconElement.style.width = `${nextSize}px`;
        iconElement.style.height = `${nextSize}px`;

        const measuredTextHeight = textElement.getBoundingClientRect().height;
        if (Math.abs(measuredTextHeight - nextSize) < 0.5) {
          nextSize = measuredTextHeight;
          break;
        }

        nextSize = measuredTextHeight;
      }

      setBrandingIconSize(nextSize > 0 ? nextSize : null);
    };

    const rafId = window.requestAnimationFrame(updateSize);

    const observer = new ResizeObserver(updateSize);
    observer.observe(textElement);
    window.addEventListener("resize", updateSize);

    return () => {
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, [
    brandingIconSize,
    loading,
    content.site.branding.name,
    content.site.branding.title,
    content.site.branding.description,
  ]);

  useLayoutEffect(() => {
    const updateBrandingLayout = () => {
      setIsNarrowBranding(window.innerWidth < 520);
    };

    updateBrandingLayout();
    window.addEventListener("resize", updateBrandingLayout);

    return () => {
      window.removeEventListener("resize", updateBrandingLayout);
    };
  }, []);

  const effectiveIconSize = brandingIconSize
    ? isNarrowBranding
      ? Math.min(brandingIconSize, 88)
      : brandingIconSize
    : null;

  return (
    <aside className="site-header-shell relative z-20 w-full bg-background border-b border-border p-6 lg:p-8">
      <div className="max-w-full mx-auto w-full">
        <div className="site-header-layout flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          {/* Name and Title */}
          <div className="site-header-branding xl:flex-1">
            <div
              className={cn(
                "site-branding-row gap-4",
                isNarrowBranding ? "flex flex-col items-start" : "flex items-start"
              )}
            >
              {content.site.branding.icon?.trim() ? (
                <Link
                  href="/"
                  ref={brandingIconRef}
                  className="relative block shrink-0 overflow-hidden"
                  aria-label="Go to homepage"
                  style={
                    effectiveIconSize
                      ? { width: `${effectiveIconSize}px`, height: `${effectiveIconSize}px` }
                      : undefined
                  }
                >
                  <Image
                    src={content.site.branding.icon.trim()}
                    alt={`${content.site.branding.name} icon`}
                    fill
                    className="object-contain"
                  />
                </Link>
              ) : null}
              <div ref={brandingTextRef} className="site-branding-copy min-w-0 py-0.5">
                <Link href="/">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
                    {content.site.branding.name}
                  </h1>
                </Link>
                <p className="mt-1 text-base font-medium text-primary sm:text-lg md:text-xl">
                  {content.site.branding.title}
                </p>
                <p className="mt-2 max-w-2xl whitespace-pre-line text-justify text-sm leading-relaxed text-muted-foreground md:text-base">
                  {content.site.branding.description}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation and Social Links */}
          <div className="site-header-actions flex flex-col gap-6 xl:shrink-0 xl:items-end">
            {/* Navigation */}
            <nav className="flex flex-wrap gap-4 md:gap-6 xl:justify-end">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  isActive={pathname === item.href}
                />
              ))}
            </nav>

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-4 xl:justify-end">
              {socialLinks.map((social) => (
                (() => {
                  const Icon = getExternalLinkIcon(social.href);

                  return (
                    <Link
                      key={social.label}
                      href={social.href!}
                      target={social.href!.startsWith("mailto") ? undefined : "_blank"}
                      rel={
                        social.href!.startsWith("mailto")
                          ? undefined
                          : "noopener noreferrer"
                      }
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="size-5" />
                    </Link>
                  );
                })()
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 rounded-md transition-colors text-sm font-medium",
        isActive
          ? "text-foreground bg-secondary"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      )}
    >
      {label}
    </Link>
  );
}
