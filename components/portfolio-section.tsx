"use client";

import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const projects = [
  {
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce solution with real-time inventory management, payment processing, and an intuitive admin dashboard.",
    image: "/placeholder-project-1.svg",
    url: "https://example.com",
    github: "https://github.com",
    tags: ["Next.js", "Stripe", "Prisma", "PostgreSQL"],
    featured: true,
  },
  {
    title: "Analytics Dashboard",
    description:
      "Real-time analytics dashboard for tracking user behavior and business metrics with interactive visualizations.",
    image: "/placeholder-project-2.svg",
    url: "https://example.com",
    github: "https://github.com",
    tags: ["React", "D3.js", "Node.js", "MongoDB"],
    featured: true,
  },
  {
    title: "Task Management App",
    description:
      "A collaborative task management application with real-time updates, drag-and-drop functionality, and team features.",
    image: "/placeholder-project-3.svg",
    url: "https://example.com",
    github: "https://github.com",
    tags: ["Vue.js", "Firebase", "Tailwind CSS"],
    featured: false,
  },
  {
    title: "AI Content Generator",
    description:
      "An AI-powered content generation tool that helps marketers create engaging copy for various platforms.",
    image: "/placeholder-project-4.svg",
    url: "https://example.com",
    github: "https://github.com",
    tags: ["Python", "OpenAI", "FastAPI", "React"],
    featured: false,
  },
];

export function PortfolioSection() {
  return (
    <section id="portfolio" className="py-24 px-6 lg:px-0 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-12 flex items-center gap-4">
          <span className="h-px w-8 bg-muted-foreground" />
          Selected Work
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  title,
  description,
  image,
  url,
  github,
  tags,
}: {
  title: string;
  description: string;
  image: string;
  url: string;
  github: string;
  tags: string[];
  featured?: boolean;
}) {
  return (
    <div className="group relative bg-secondary/50 rounded-lg overflow-hidden hover:bg-secondary/80 transition-colors">
      <div className="aspect-video relative bg-muted/20">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
      </div>
      <div className="p-6 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-foreground font-medium text-lg group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            {github && (
              <Link
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`View ${title} on GitHub`}
              >
                <Github className="size-5" />
              </Link>
            )}
            {url && (
              <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`View ${title} live`}
              >
                <ExternalLink className="size-5" />
              </Link>
            )}
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/20 border-0 text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
