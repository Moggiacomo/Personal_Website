import { PageLayout } from "@/components/page-layout";
import { PublicationCards } from "@/components/publication-cards";
import { publications } from "@/lib/publications";

export const metadata = {
  title: "Publications | Your Name",
  description: "My research papers, articles, and academic publications",
};

export default function PublicationsPage() {
  return (
    <PageLayout>
      <section className="pt-8 pb-12 lg:pt-12 lg:pb-24 px-6 lg:px-12">
        <div className="max-w-full mx-auto w-full">
          <h2 className="text-xs uppercase tracking-widest leading-none text-muted-foreground mb-12 flex items-center gap-4">
            <span className="h-px w-8 bg-muted-foreground" />
            Publications
          </h2>
          
          <PublicationCards publications={publications} layout="stack" idPrefix="publication" />
        </div>
      </section>
    </PageLayout>
  );
}
