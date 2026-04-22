import { PublicationCards } from "@/components/publication-cards";
import { publications } from "@/lib/publications";

export function PublicationsSection() {
  return (
    <section id="publications" className="pt-16 pb-24 px-6 lg:px-0 lg:pt-20">
      <div className="max-w-full mx-auto w-full">
        <h2 className="text-xs uppercase tracking-widest leading-none text-muted-foreground mb-12 flex items-center gap-4">
          <span className="h-px w-8 bg-muted-foreground" />
          Publications
        </h2>
        <PublicationCards publications={publications} idPrefix="publication" />
      </div>
    </section>
  );
}
