"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CoverFlow, type CoverFlowItem } from "@ashishgogula/coverflow";
import initialSiteContent from "@/content/site-content.json";
import { EditableText } from "@/components/editable-text";
import { PageLayout } from "@/components/page-layout";
import { useSiteContent } from "@/hooks/use-site-content";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@/lib/content-types";

const chalkPalette = ["#9877a2", "#8499c1", "#d990a3", "#96c8c5", "#f2dede"];

type SkillHoverState = {
  color: string;
  pulseKey: number;
};

export default function HomePage() {
  const router = useRouter();
  const [itemWidth, setItemWidth] = useState(260);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [skillStates, setSkillStates] = useState<Record<string, SkillHoverState>>({});
  const { content } = useSiteContent(initialSiteContent as SiteContent);

  const coverFlowItems: CoverFlowItem[] = content.portfolio.map((project, index) => ({
    id: index,
    image: project.image,
    title: project.title,
    subtitle: project.tags.slice(0, 2).join(", "),
  }));

  useEffect(() => {
    const updateItemWidth = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemWidth(400);
      } else if (width < 1024) {
        setItemWidth(640);
      } else {
        setItemWidth(700);
      }
    };

    updateItemWidth();
    window.addEventListener("resize", updateItemWidth);
    return () => window.removeEventListener("resize", updateItemWidth);
  }, []);

  const handleItemClick = (_item: CoverFlowItem, index: number) => {
    router.push(`/portfolio#project-${index}`);
  };

  const handleSkillEnter = (skill: string) => {
    const color =
      chalkPalette[Math.floor(Math.random() * chalkPalette.length)] ?? chalkPalette[0];

    setSkillStates((current) => ({
      ...current,
      [skill]: {
        color,
        pulseKey: (current[skill]?.pulseKey ?? 0) + 1,
      },
    }));
    setHoveredSkill(skill);
  };

  const handleSkillLeave = (skill: string) => {
    setHoveredSkill((current) => (current === skill ? null : current));
  };

  return (
    <PageLayout>
      <section className="pt-8 pb-12 lg:pt-12 lg:pb-24 px-6 lg:px-12">
        <div className="max-w-full mx-auto w-full">
          <h2 className="text-xs uppercase tracking-widest leading-none text-muted-foreground mb-8 flex items-center gap-4">
            <span className="h-px w-8 bg-muted-foreground" />
            {content.site.headers.about}
          </h2>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            {content.about.paragraphs.map((paragraph, index) => (
              <EditableText
                key={index}
                contentKey={`home-about-${index + 1}`}
                as="p"
                className={index === 0 ? "text-lg text-foreground" : ""}
              >
                {paragraph}
              </EditableText>
            ))}
          </div>

          <div className="mt-16">
            <h3 className="text-xs uppercase tracking-widest leading-none text-muted-foreground mb-6 flex items-center gap-4">
              <span className="h-px w-8 bg-muted-foreground" />
              {content.site.headers.coreSkills}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {content.about.skills.map((skill) => {
                const skillState = skillStates[skill];
                const isHovered = hoveredSkill === skill;
                const color = skillState?.color ?? "rgba(255,255,255,0.08)";

                return (
                  <div
                    key={skill}
                    onMouseEnter={() => handleSkillEnter(skill)}
                    onMouseLeave={() => handleSkillLeave(skill)}
                    className={cn(
                      "relative isolate overflow-visible rounded-lg border border-transparent p-4 text-sm transition-all duration-300 ease-out",
                      isHovered
                        ? "z-10 -translate-y-1 scale-[1.04] font-semibold shadow-[0_20px_45px_-20px_rgba(0,0,0,0.65)]"
                        : "bg-secondary/50 text-foreground hover:shadow-[0_16px_32px_-24px_rgba(0,0,0,0.45)]"
                    )}
                    style={{
                      backgroundColor: isHovered ? color : undefined,
                      borderColor: isHovered ? `${color}cc` : undefined,
                      color: isHovered ? "#141a22" : undefined,
                    }}
                  >
                    {isHovered && skillState ? (
                      <span
                        key={`${skill}-${skillState.pulseKey}`}
                        className="pointer-events-none absolute inset-0 -z-10 rounded-xl skill-wave"
                        style={{ backgroundColor: color }}
                      />
                    ) : null}
                    <span className="relative z-10">{skill}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-16">
            <h3 className="text-xs uppercase tracking-widest leading-none text-muted-foreground mb-6 flex items-center gap-4">
              <span className="h-px w-8 bg-muted-foreground" />
              {content.site.headers.featuredProjects}
            </h3>
            <div className="w-full">
              <div className="h-[820px] w-full">
                <CoverFlow
                  items={coverFlowItems}
                  itemWidth={itemWidth}
                  itemHeight={itemWidth}
                  initialIndex={0}
                  enableReflection={false}
                  enableClickToSnap={true}
                  enableScroll={true}
                  onItemClick={handleItemClick}
                  onIndexChange={setActiveProjectIndex}
                  className="about-coverflow w-full"
                />
              </div>
              <div className="mt-4 text-center">
                <h4 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                  {coverFlowItems[activeProjectIndex]?.title}
                </h4>
                <p className="mt-2 text-sm font-medium tracking-wide text-muted-foreground">
                  {coverFlowItems[activeProjectIndex]?.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
