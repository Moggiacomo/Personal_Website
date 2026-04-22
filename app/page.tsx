"use client";

import { PageLayout } from "@/components/page-layout";
import { EditableText } from "@/components/editable-text";
import { CoverFlow, type CoverFlowItem } from "@ashishgogula/coverflow";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const projects = [
  {
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce solution with real-time inventory management, payment processing, and an intuitive admin dashboard.",
    image: "/placeholder-project-1.svg",
    url: "https://example.com",
    github: "https://github.com",
    tags: ["Next.js", "Stripe", "Prisma", "PostgreSQL"],
    featured: true,
  },
  {
    title: "Analytics Dashboard",
    description:
      "Real-time analytics dashboard for tracking user behavior and business metrics with interactive visualizations.",
    image: "/placeholder-project-2.svg",
    url: "https://example.com",
    github: "https://github.com",
    tags: ["React", "D3.js", "Node.js", "MongoDB"],
    featured: true,
  },
  {
    title: "Task Management App",
    description:
      "A collaborative task management application with real-time updates, drag-and-drop functionality, and team features.",
    image: "/placeholder-project-3.svg",
    url: "https://example.com",
    github: "https://github.com",
    tags: ["Vue.js", "Firebase", "Tailwind CSS"],
    featured: false,
  },
  {
    title: "AI Content Generator",
    description:
      "An AI-powered content generation tool that helps marketers create engaging copy for various platforms.",
    image: "/placeholder-project-4.svg",
    url: "https://example.com",
    github: "https://github.com",
    tags: ["Python", "OpenAI", "FastAPI", "React"],
    featured: false,
  },
];

const coverFlowItems: CoverFlowItem[] = projects.map((project, index) => ({
  id: index,
  image: project.image,
  title: project.title,
  subtitle: project.tags.slice(0, 2).join(", "),
}));

export default function HomePage() {
  const router = useRouter();
  const [itemWidth, setItemWidth] = useState(260);

  useEffect(() => {
    const updateItemWidth = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemWidth(200); // Mobile
      } else if (width < 1024) {
        setItemWidth(240); // Tablet
      } else {
        setItemWidth(260); // Desktop
      }
    };

    updateItemWidth();
    window.addEventListener('resize', updateItemWidth);
    return () => window.removeEventListener('resize', updateItemWidth);
  }, []);

  const handleItemClick = (item: CoverFlowItem, index: number) => {
    router.push(`/portfolio#project-${index}`);
  };

  return (
    <PageLayout>
      <section className="py-12 lg:py-24 px-6 lg:px-12">
        <div className="max-w-full mx-auto w-full">
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

          {/* Cover Flow Showcase */}
          <div className="mt-16">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-4">
              <span className="h-px w-8 bg-muted-foreground" />
              Featured Projects
            </h3>
            <div className="h-[420px] w-full">
              <CoverFlow
                items={coverFlowItems}
                itemWidth={itemWidth}
                itemHeight={260}
                initialIndex={0}
                enableReflection={true}
                enableClickToSnap={true}
                enableScroll={true}
                scrollThreshold={100}
                onItemClick={handleItemClick}
                className="w-full"
              />
            </div>
          </div>

        </div>
      </section>
    </PageLayout>
  );
}
