import { Mail, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page-layout";

export const metadata = {
  title: "Contact | Your Name",
  description: "Get in touch with me for collaborations and opportunities",
};

export default function ContactPage() {
  return (
    <PageLayout>
      <section className="pt-8 pb-12 lg:pt-12 lg:pb-24 px-6 lg:px-12">
        <div className="max-w-2xl">
          <h2 className="text-xs uppercase tracking-widest leading-none text-muted-foreground mb-12 flex items-center gap-4">
            <span className="h-px w-8 bg-muted-foreground" />
            Contact
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                Let&apos;s work together
              </h3>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                I&apos;m always interested in hearing about new opportunities,
                collaborations, or just having a chat about technology and design.
                Feel free to reach out!
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Email
                  </p>
                  <Link
                    href="mailto:hello@example.com"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    hello@example.com
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Location
                  </p>
                  <span className="text-foreground">San Francisco, CA</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Availability
                  </p>
                  <span className="text-foreground">Open to opportunities</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="mailto:hello@example.com">
                  <Mail className="size-4 mr-2" />
                  Send me an email
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
