import { PageLayout } from "@/components/page-layout";
import { ContactPageClient } from "@/components/contact-page-client";

export const metadata = {
  title: "Contact | Your Name",
  description: "Get in touch with me for collaborations and opportunities",
};

export default function ContactPage() {
  return (
    <PageLayout>
      <ContactPageClient />
    </PageLayout>
  );
}
