"use client";

import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 lg:px-0">
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Left Column - Name and Navigation */}
        <div className="lg:sticky lg:top-24 space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Your Name
            </h1>
            <p className="text-xl md:text-2xl text-primary mt-2 font-medium">
              Your Title
            </p>
            <p className="text-muted-foreground mt-4 max-w-sm leading-relaxed">
              I build elegant digital experiences that blend thoughtful design
              with robust engineering.
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-3">
            <NavLink href="#about" label="About" />
            <NavLink href="#experience" label="Experience" />
            <NavLink href="#portfolio" label="Portfolio" />
            <NavLink href="#publications" label="Publications" />
            <NavLink href="#contact" label="Contact" />
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-4 pt-4">
            <SocialLink
              href="https://github.com"
              icon={<Github className="size-5" />}
              label="GitHub"
            />
            <SocialLink
              href="https://linkedin.com"
              icon={<Linkedin className="size-5" />}
              label="LinkedIn"
            />
            <SocialLink
              href="https://twitter.com"
              icon={<Twitter className="size-5" />}
              label="Twitter"
            />
            <SocialLink
              href="mailto:hello@example.com"
              icon={<Mail className="size-5" />}
              label="Email"
            />
          </div>
        </div>

        {/* Right Column - About Content */}
        <div id="about" className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            I&apos;m a passionate professional focused on creating accessible,
            pixel-perfect digital experiences. My work lies at the intersection
            of design and development, creating experiences that not only look
            great but are meticulously built for performance and usability.
          </p>
          <p>
            Currently, I&apos;m working on innovative projects that push the
            boundaries of what&apos;s possible on the web. I specialize in
            building scalable applications that deliver exceptional user
            experiences.
          </p>
          <p>
            In my spare time, I enjoy contributing to open-source projects,
            writing technical articles, and exploring new technologies. I believe
            in continuous learning and sharing knowledge with the community.
          </p>
        </div>
      </div>
    </section>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors"
    >
      <span className="h-px w-8 bg-muted-foreground group-hover:w-16 group-hover:bg-foreground transition-all duration-300" />
      <span className="uppercase text-xs tracking-widest font-medium">
        {label}
      </span>
    </Link>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-primary transition-colors"
      aria-label={label}
    >
      {icon}
    </Link>
  );
}
