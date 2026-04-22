import { ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

const publications = [
  {
    title: "Building Scalable React Applications: Best Practices and Patterns",
    venue: "Tech Conference 2024",
    type: "Conference Paper",
    year: "2024",
    url: "https://example.com/paper1",
    abstract:
      "An exploration of modern patterns for building maintainable React applications at scale, including state management, component architecture, and performance optimization.",
  },
  {
    title: "The Future of Web Development: Trends and Predictions",
    venue: "Web Dev Journal",
    type: "Journal Article",
    year: "2023",
    url: "https://example.com/paper2",
    abstract:
      "A comprehensive analysis of emerging web technologies and their potential impact on how we build digital experiences in the coming years.",
  },
  {
    title: "Optimizing Database Performance in Modern Web Applications",
    venue: "Database Systems Symposium",
    type: "Conference Paper",
    year: "2023",
    url: "https://example.com/paper3",
    abstract:
      "Techniques for improving database query performance and reducing latency in high-traffic web applications through indexing, caching, and query optimization.",
  },
  {
    title: "Accessibility in Design Systems: A Practical Guide",
    venue: "UX Design Magazine",
    type: "Article",
    year: "2022",
    url: "https://example.com/paper4",
    abstract:
      "Guidelines for integrating accessibility considerations into design system components, ensuring inclusive digital experiences for all users.",
  },
];

export function PublicationsSection() {
  return (
    <section id="publications" className="py-24 px-6 lg:px-0">
      <div className="max-w-full mx-auto w-full">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-12 flex items-center gap-4">
          <span className="h-px w-8 bg-muted-foreground" />
          Publications
        </h2>
        <div className="space-y-8">
          {publications.map((pub, index) => (
            <PublicationCard key={index} {...pub} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PublicationCard({
  title,
  venue,
  type,
  year,
  url,
  abstract,
}: {
  title: string;
  venue: string;
  type: string;
  year: string;
  url: string;
  abstract: string;
}) {
  return (
    <div className="group grid md:grid-cols-[120px_1fr] gap-4 md:gap-8 p-6 rounded-lg hover:bg-secondary/50 transition-colors">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground font-medium">{year}</span>
        <span className="text-xs text-primary/80 flex items-center gap-1">
          <FileText className="size-3" />
          {type}
        </span>
      </div>
      <div className="space-y-2">
        <h3 className="text-foreground font-medium group-hover:text-primary transition-colors">
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-start gap-2"
          >
            <span className="text-balance">{title}</span>
            <ExternalLink className="size-4 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </h3>
        <p className="text-sm text-primary/70 font-medium">{venue}</p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {abstract}
        </p>
      </div>
    </div>
  );
}
