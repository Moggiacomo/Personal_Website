"use client";

import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import initialSiteContent from "@/content/site-content.json";
import { useSiteContent } from "@/hooks/use-site-content";
import type { SiteContent } from "@/lib/content-types";
import { cn } from "@/lib/utils";

const socialLinks = [
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "mailto:hello@example.com", icon: Mail, label: "Email" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { content } = useSiteContent(initialSiteContent as SiteContent);
  const navItems = [
    { href: "/", label: content.site.navigation.about },
    { href: "/cv", label: content.site.navigation.cv },
    { href: "/publications", label: content.site.navigation.publications },
    { href: "/portfolio", label: content.site.navigation.portfolio },
    { href: "/repo", label: content.site.navigation.repo },
    { href: "/contact", label: content.site.navigation.contact },
  ];

  return (
    <aside className="w-full bg-background border-b border-border p-6 lg:p-8">
      <div className="max-w-full mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Name and Title */}
          <div className="flex-1">
            <Link href="/">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
                {content.site.branding.name}
              </h1>
            </Link>
            <p className="text-lg md:text-xl text-primary mt-1 font-medium">
              {content.site.branding.title}
            </p>
            <p className="text-muted-foreground mt-2 leading-relaxed text-sm md:text-base max-w-2xl">
              {content.site.branding.description}
            </p>
          </div>

          {/* Navigation and Social Links */}
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Navigation */}
            <nav className="flex flex-wrap gap-4 md:gap-6">
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
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={social.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="size-5" />
                </Link>
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
