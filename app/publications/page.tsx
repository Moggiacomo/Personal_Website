import { PageLayout } from "@/components/page-layout";
import { PublicationsPageClient } from "@/components/publications-page-client";

export const metadata = {
  title: "Publications | Your Name",
  description: "My research papers, articles, and academic publications",
};

export default function PublicationsPage() {
  return (
    <PageLayout>
      <section className="pt-8 pb-12 lg:pt-12 lg:pb-24 px-6 lg:px-12">
        <div className="max-w-full mx-auto w-full">
          <PublicationsPageClient />
        </div>
      </section>
    </PageLayout>
  );
}
