import { PageLayout } from "@/components/page-layout";
import { EditableText } from "@/components/editable-text";

export default function HomePage() {
  return (
    <PageLayout>
      <section className="py-12 lg:py-24 px-6 lg:px-12">
        <div className="max-w-3xl">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-8 flex items-center gap-4">
            <span className="h-px w-8 bg-muted-foreground" />
            About Me
          </h2>
          
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <EditableText
              contentKey="home-about-1"
              as="p"
              className="text-lg text-foreground"
            >
              I&apos;m a passionate professional focused on creating accessible,
              pixel-perfect digital experiences. My work lies at the intersection
              of design and development.
            </EditableText>
            <EditableText
              contentKey="home-about-2"
              as="p"
              className=""
            >
              Creating experiences that not only look great but are meticulously 
              built for performance and usability has always been my goal. I believe 
              that great software should feel invisible — seamlessly integrating 
              into people&apos;s lives while solving real problems.
            </EditableText>
            <EditableText
              contentKey="home-about-3"
              as="p"
              className=""
            >
              Currently, I&apos;m working on innovative projects that push the
              boundaries of what&apos;s possible on the web. I specialize in
              building scalable applications that deliver exceptional user
              experiences.
            </EditableText>
            <EditableText
              contentKey="home-about-4"
              as="p"
              className=""
            >
              In my spare time, I enjoy contributing to open-source projects,
              writing technical articles, and exploring new technologies. I believe
              in continuous learning and sharing knowledge with the community.
            </EditableText>
          </div>

          {/* Skills Section */}
          <div className="mt-16">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-4">
              <span className="h-px w-8 bg-muted-foreground" />
              Core Skills
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "JavaScript / TypeScript",
                "React / Next.js",
                "Node.js",
                "Python",
                "UI/UX Design",
                "Cloud Services",
              ].map((skill) => (
                <div
                  key={skill}
                  className="p-4 rounded-lg bg-secondary/50 text-sm text-foreground hover:bg-secondary/80 transition-colors"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>


        </div>
      </section>
    </PageLayout>
  );
}
