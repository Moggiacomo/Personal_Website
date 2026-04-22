import { PortfolioCards } from "@/components/portfolio-cards";
import { projects } from "@/lib/projects";

export function PortfolioSection() {
  return (
    <section id="portfolio" className="py-24 px-6 lg:px-0 bg-card/50">
      <div className="max-w-full mx-auto w-full">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-12 flex items-center gap-4">
          <span className="h-px w-8 bg-muted-foreground" />
          Selected Work
        </h2>
        <PortfolioCards projects={projects} idPrefix="portfolio-project" />
      </div>
    </section>
  );
}
