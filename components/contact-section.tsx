import { Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ContactSection() {
  return (
    <section id="contact" className="pt-16 pb-24 px-6 lg:px-0 lg:pt-20 bg-card/50">
      <div className="max-w-full mx-auto w-full">
        <h2 className="text-xs uppercase tracking-widest leading-none text-muted-foreground mb-12 flex items-center gap-4">
          <span className="h-px w-8 bg-muted-foreground" />
          Contact
        </h2>
        <div className="max-w-2xl space-y-8">
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
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="size-5 text-primary" />
              <Link
                href="mailto:hello@example.com"
                className="hover:text-foreground transition-colors"
              >
                hello@example.com
              </Link>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="size-5 text-primary" />
              <span>San Francisco, CA</span>
            </div>
          </div>

          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="mailto:hello@example.com">
              Get in Touch
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-8 px-6 lg:px-0 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Your Name. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground">
          Built with Next.js & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
