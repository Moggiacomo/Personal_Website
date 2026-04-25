"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CoverFlow, type CoverFlowItem } from "@ashishgogula/coverflow";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react";
import initialSiteContent from "@/content/site-content.json";
import { AboutPublicationStack } from "@/components/about-publication-stack";
import { PageLayout } from "@/components/page-layout";
import { AboutScrollWords } from "@/components/about-scroll-words";
import { useSiteContent } from "@/hooks/use-site-content";
import { FEATURED_IN_ABOUT_TAG } from "@/lib/publications";
import { cn } from "@/lib/utils";
import type { ParagraphLevel, RichParagraph, SiteContent } from "@/lib/content-types";

const chalkPalette = ["#9877a2", "#8499c1", "#d990a3", "#96c8c5", "#f2dede"];
const ABOUT_ENTRY_WINDOW_START = 0.08;
const ABOUT_ENTRY_WINDOW_END = 0.58;
const ABOUT_ENTRY_DURATION = 0.16;
const ABOUT_REVEAL_THRESHOLD_OFFSET = 0.15;

type SkillHoverState = {
  color: string;
  pulseKey: number;
};

function getParagraphClass(level: ParagraphLevel = "body") {
  if (level === "lead") {
    return "text-lg leading-relaxed text-foreground md:text-xl";
  }

  if (level === "highlight") {
    return "text-base font-semibold leading-relaxed text-foreground md:text-lg";
  }

  return "leading-relaxed text-muted-foreground md:text-[1.02rem]";
}

function AboutIntroParagraph({
  paragraph,
  index,
  total,
  progress,
  revealed,
}: {
  paragraph: RichParagraph;
  index: number;
  total: number;
  progress: MotionValue<number>;
  revealed: boolean;
}) {
  const span = Math.max(total - 1, 1);
  const step = (ABOUT_ENTRY_WINDOW_END - ABOUT_ENTRY_WINDOW_START) / span;
  const start = total === 1 ? 0.12 : ABOUT_ENTRY_WINDOW_START + index * step;
  const end = Math.min(start + ABOUT_ENTRY_DURATION, ABOUT_ENTRY_WINDOW_END + ABOUT_ENTRY_DURATION);
  const rawX = useTransform(progress, [start, end], [-120, 0]);
  const rawOpacity = useTransform(progress, [start, end], [0, 1]);
  const rawBlur = useTransform(progress, [start, end], [10, 0]);
  const rawFilter = useTransform(rawBlur, (value) => `blur(${value}px)`);

  return (
    <motion.p
      className={cn(getParagraphClass(paragraph.level))}
      style={{
        x: revealed ? 0 : rawX,
        opacity: revealed ? 1 : rawOpacity,
        filter: revealed ? "blur(0px)" : rawFilter,
      }}
    >
      {paragraph.text}
    </motion.p>
  );
}

export default function HomePage() {
  const router = useRouter();
  const aboutIntroRef = useRef<HTMLDivElement | null>(null);
  const aboutStickyRef = useRef<HTMLDivElement | null>(null);
  const aboutHeightBeforeUnlockRef = useRef<number | null>(null);
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [aboutSceneInset, setAboutSceneInset] = useState(32);
  const [aboutReleaseProgress, setAboutReleaseProgress] = useState(0);
  const [aboutIntroCompleted, setAboutIntroCompleted] = useState(false);
  const [itemWidth, setItemWidth] = useState(260);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [skillStates, setSkillStates] = useState<Record<string, SkillHoverState>>({});
  const [revealedParagraphs, setRevealedParagraphs] = useState<boolean[]>([]);
  const { content } = useSiteContent(initialSiteContent as SiteContent);
  const { scrollYProgress: aboutImageProgress } = useScroll({
    target: aboutIntroRef,
    offset: ["start start", "end start"],
  });
  const { scrollY } = useScroll();
  const aboutSceneHeight = aboutIntroCompleted
    ? "auto"
    : `${Math.max(620, 460 + content.about.paragraphs.length * 120)}svh`;
  const aboutSceneTop = topBarHeight + aboutSceneInset;
  const aboutImageOpacity = aboutIntroCompleted ? 1 : 1 - aboutReleaseProgress * aboutReleaseProgress;
  const aboutImageY = aboutIntroCompleted ? 0 : 52 * aboutReleaseProgress;
  const featuredPublications = content.publications.flatMap((publication, index) =>
    publication.tags.includes(FEATURED_IN_ABOUT_TAG)
      ? [{ publication, href: `/publications#publication-${index}` }]
      : []
  );

  const coverFlowItems: CoverFlowItem[] = content.portfolio.map((project, index) => ({
    id: index,
    image: project.image,
    title: project.title,
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

  useLayoutEffect(() => {
    const topBar = document.querySelector("aside");

    const updateOffsets = () => {
      setTopBarHeight(topBar?.getBoundingClientRect().height ?? 0);
      setAboutSceneInset(window.innerWidth >= 1024 ? 48 : 32);
    };

    updateOffsets();

    const observer = topBar ? new ResizeObserver(updateOffsets) : null;
    if (topBar && observer) {
      observer.observe(topBar);
    }
    window.addEventListener("resize", updateOffsets);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateOffsets);
    };
  }, []);

  useEffect(() => {
    aboutHeightBeforeUnlockRef.current = null;
    setAboutIntroCompleted(false);
    setRevealedParagraphs((current) =>
      content.about.paragraphs.map((_, index) => current[index] ?? false)
    );
  }, [content.about.paragraphs]);

  useLayoutEffect(() => {
    if (!aboutIntroCompleted) return;

    const previousHeight = aboutHeightBeforeUnlockRef.current;
    const section = aboutIntroRef.current;
    if (!previousHeight || !section) return;

    const nextHeight = section.getBoundingClientRect().height;
    const delta = previousHeight - nextHeight;

    if (Math.abs(delta) > 1) {
      window.scrollTo({ top: window.scrollY - delta });
    }

    aboutHeightBeforeUnlockRef.current = null;
  }, [aboutIntroCompleted]);

  useMotionValueEvent(aboutImageProgress, "change", (latest) => {
    const total = content.about.paragraphs.length;
    if (!total) return;

      setRevealedParagraphs((current) => {
        let changed = false;
        const next = content.about.paragraphs.map((_, index) => {
        const span = Math.max(total - 1, 1);
        const step = (ABOUT_ENTRY_WINDOW_END - ABOUT_ENTRY_WINDOW_START) / span;
        const start = total === 1 ? 0.12 : ABOUT_ENTRY_WINDOW_START + index * step;
        const threshold = Math.min(
          start + ABOUT_REVEAL_THRESHOLD_OFFSET,
          ABOUT_ENTRY_WINDOW_END + ABOUT_ENTRY_DURATION
        );
        const revealed = current[index] || latest >= threshold;
        if (revealed !== current[index]) {
          changed = true;
        }
        return revealed;
        });

        if (next.length > 0 && next.every(Boolean) && !aboutIntroCompleted) {
          aboutHeightBeforeUnlockRef.current =
            aboutIntroRef.current?.getBoundingClientRect().height ?? null;
          setAboutIntroCompleted(true);
        }

        return changed ? next : current;
      });
  });

  useMotionValueEvent(scrollY, "change", () => {
    if (aboutIntroCompleted) return;

    const stickyElement = aboutStickyRef.current;
    if (!stickyElement) return;

    const rect = stickyElement.getBoundingClientRect();
    const releaseDelta = Math.max(0, aboutSceneTop - rect.top);
    const nextProgress = Math.min(releaseDelta / 280, 1);

    setAboutReleaseProgress((current) =>
      Math.abs(current - nextProgress) > 0.001 ? nextProgress : current
    );
  });

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
          <div className="md:hidden">
            <h2 className="mb-8 flex items-center gap-4 text-xs uppercase tracking-widest leading-none text-muted-foreground">
              <span className="h-px w-8 bg-muted-foreground" />
              {content.site.headers.about}
            </h2>

            {content.about.backgroundImage ? (
              <div className="relative mb-8 aspect-square w-full overflow-hidden">
                <img
                  src={content.about.backgroundImage}
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain object-bottom"
                  style={{ imageRendering: "auto" }}
                />
              </div>
            ) : null}

            <div className="space-y-6 text-muted-foreground">
              {content.about.paragraphs.map((paragraph, index) => (
                <p key={`about-mobile-${index}`} className={cn(getParagraphClass(paragraph.level))}>
                  {paragraph.text}
                </p>
              ))}
            </div>
          </div>

          <div
            ref={aboutIntroRef}
            className="relative hidden md:block"
            style={aboutIntroCompleted ? undefined : { minHeight: aboutSceneHeight }}
          >
            <div
              ref={aboutStickyRef}
              className={cn("overflow-visible", aboutIntroCompleted ? "relative" : "sticky")}
              style={{
                top: aboutIntroCompleted ? undefined : aboutSceneTop,
                minHeight: `calc(100svh - ${aboutSceneTop}px)`,
              }}
            >
              <div
                className="relative z-10 flex items-start"
                style={{
                  minHeight: `calc(100svh - ${aboutSceneTop}px)`,
                  paddingTop: 0,
                }}
              >
                {content.about.backgroundImage ? (
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 right-[-1.5rem] z-0 lg:right-[-3rem]"
                    style={{
                      opacity: aboutImageOpacity,
                      y: aboutImageY,
                    }}
                  >
                    <div
                      className="relative"
                      style={{
                        width: `min(68rem, 100vw, calc(100svh - ${aboutSceneTop}px))`,
                        height: `min(68rem, 100vw, calc(100svh - ${aboutSceneTop}px))`,
                      }}
                    >
                      <img
                        src={content.about.backgroundImage}
                        alt=""
                        className="block h-full w-full object-contain object-right-bottom"
                        style={{
                          imageRendering: "auto",
                        }}
                      />
                    </div>
                  </motion.div>
                ) : null}

                <div className="relative z-20 w-full max-w-5xl pr-[0vw] md:pr-[4vw] lg:pr-[8vw]">
                  <h2 className="mb-8 flex items-center gap-4 text-xs uppercase tracking-widest leading-none text-muted-foreground">
                    <span className="h-px w-8 bg-muted-foreground" />
                    {content.site.headers.about}
                  </h2>
                  <div className="space-y-6 text-muted-foreground">
                    {content.about.paragraphs.map((paragraph, index) => (
                      <AboutIntroParagraph
                        key={`about-paragraph-${index}`}
                        paragraph={paragraph}
                        index={index}
                        total={content.about.paragraphs.length}
                        progress={aboutImageProgress}
                        revealed={revealedParagraphs[index] ?? false}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <AboutScrollWords words={content.about.morphWords} />
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
                      "relative isolate flex min-h-24 items-center justify-center overflow-visible rounded-lg border border-transparent px-5 py-4 text-center text-lg transition-all duration-300 ease-out md:min-h-28 md:text-xl",
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
                    <span className="relative z-10 leading-snug">{skill}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {featuredPublications.length ? (
            <div className="mt-16">
                <h3 className="text-xs uppercase tracking-widest leading-none text-muted-foreground mb-6 flex items-center gap-4">
                  <span className="h-px w-8 bg-muted-foreground" />
                  {content.site.headers.featuredPublications}
                </h3>
                <AboutPublicationStack items={featuredPublications} />
            </div>
          ) : null}

          <div className="mt-16">
            <h3 className="text-xs uppercase tracking-widest leading-none text-muted-foreground mb-6 flex items-center gap-4">
              <span className="h-px w-8 bg-muted-foreground" />
              {content.site.headers.featuredProjects}
            </h3>
            <div className="w-full">
              <div className="h-[620px] w-full sm:h-[700px] lg:h-[820px]">
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
              <div className="mt-2 text-center sm:mt-3 md:mt-4">
                <h4 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl md:text-2xl">
                  {coverFlowItems[activeProjectIndex]?.title}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
