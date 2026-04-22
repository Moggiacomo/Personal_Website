import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const experiences = [
  {
    period: "2022 — Present",
    title: "Senior Software Engineer",
    company: "Tech Company",
    url: "https://example.com",
    description:
      "Lead the development of scalable web applications serving millions of users. Architect frontend solutions and mentor junior developers while collaborating with cross-functional teams.",
    skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
  },
  {
    period: "2020 — 2022",
    title: "Software Engineer",
    company: "Startup Inc",
    url: "https://example.com",
    description:
      "Built and maintained core product features, improving performance by 40%. Implemented CI/CD pipelines and established coding standards across the engineering team.",
    skills: ["Vue.js", "Python", "PostgreSQL", "Docker"],
  },
  {
    period: "2018 — 2020",
    title: "Junior Developer",
    company: "Agency Name",
    url: "https://example.com",
    description:
      "Developed responsive websites and web applications for diverse clients. Collaborated with designers to implement pixel-perfect interfaces.",
    skills: ["JavaScript", "HTML/CSS", "WordPress", "PHP"],
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 px-6 lg:px-0">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-12 flex items-center gap-4">
          <span className="h-px w-8 bg-muted-foreground" />
          Experience
        </h2>
        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <ExperienceCard key={index} {...exp} />
          ))}
        </div>
        <div className="mt-12">
          <Link
            href="/cv.pdf"
            className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors group"
          >
            <span className="border-b border-transparent group-hover:border-primary">
              View Full Résumé
            </span>
            <ExternalLink className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({
  period,
  title,
  company,
  url,
  description,
  skills,
}: {
  period: string;
  title: string;
  company: string;
  url: string;
  description: string;
  skills: string[];
}) {
  return (
    <div className="group grid md:grid-cols-[200px_1fr] gap-4 md:gap-8">
      <div className="text-sm text-muted-foreground font-medium">{period}</div>
      <div className="space-y-3">
        <h3 className="text-foreground font-medium group-hover:text-primary transition-colors">
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            {title} · {company}
            <ExternalLink className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/20 border-0"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
