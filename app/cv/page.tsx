"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Download, ExternalLink, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page-layout";
import { PageIntro } from "@/components/page-intro";
import initialSiteContent from "@/content/site-content.json";
import type { ExperienceType, SiteContent, TimelineItem } from "@/lib/content-types";
import { useSiteContent } from "@/hooks/use-site-content";
import { cn } from "@/lib/utils";

const currentYear = new Date().getFullYear();

const fallbackTimelineItems: TimelineItem[] = [
  {
    id: "1",
    type: "work",
    period: "2022 — Present",
    startYear: 2022,
    endYear: currentYear,
    title: "Senior Software Engineer",
    organization: "Tech Company",
    url: "https://example.com",
    description:
      "Lead the development of scalable web applications serving millions of users.",
    details: [
      "Architected frontend solutions using React and TypeScript",
      "Mentored junior developers and conducted code reviews",
      "Improved application performance by 60%",
      "Collaborated with cross-functional teams on product strategy",
    ],
    skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
  },
  {
    id: "2",
    type: "work",
    period: "2020 — 2022",
    startYear: 2020,
    endYear: 2022,
    title: "Software Engineer",
    organization: "Startup Inc",
    url: "https://example.com",
    description:
      "Built and maintained core product features, improving performance by 40%.",
    details: [
      "Implemented CI/CD pipelines using GitHub Actions",
      "Established coding standards across the engineering team",
      "Developed RESTful APIs with Python and FastAPI",
      "Managed PostgreSQL databases and optimized queries",
    ],
    skills: ["Vue.js", "Python", "PostgreSQL", "Docker"],
  },
  {
    id: "3",
    type: "education",
    period: "2018 — 2020",
    startYear: 2018,
    endYear: 2020,
    title: "Master of Science in Computer Science",
    organization: "University Name",
    url: "https://example.edu",
    description:
      "Specialized in distributed systems and machine learning.",
    details: [
      "Thesis: Scalable Machine Learning Pipelines for Real-time Data",
      "GPA: 3.9/4.0",
      "Teaching Assistant for Advanced Algorithms course",
      "Published 2 papers in peer-reviewed conferences",
    ],
  },
  {
    id: "4",
    type: "work",
    period: "08/2018 - 03/2020",
    startYear: 2018,
    startMonth: 8,
    endYear: 2020,
    endMonth: 3,
    title: "Junior Developer",
    organization: "Agency Name",
    url: "https://example.com",
    description:
      "Developed responsive websites and web applications for diverse clients.",
    details: [
      "Built 20+ client websites from design to deployment",
      "Implemented pixel-perfect interfaces from Figma designs",
      "Maintained WordPress sites and developed custom plugins",
    ],
    skills: ["JavaScript", "HTML/CSS", "WordPress", "PHP"],
  },
  {
    id: "5",
    type: "other",
    period: "2019",
    startYear: 2019,
    endYear: 2019,
    title: "Google Summer of Code",
    organization: "Open Source Organization",
    url: "https://summerofcode.withgoogle.com",
    description:
      "Contributed to an open-source project as part of Google Summer of Code.",
    details: [
      "Developed a new feature for the project core library",
      "Collaborated with mentors from around the world",
      "Code merged into main branch and used by 10K+ developers",
    ],
    skills: ["Python", "Open Source", "Git"],
  },
  {
    id: "6",
    type: "education",
    period: "2014 — 2018",
    startYear: 2014,
    endYear: 2018,
    title: "Bachelor of Science in Software Engineering",
    organization: "University Name",
    url: "https://example.edu",
    description:
      "Foundation in computer science, software development, and engineering principles.",
    details: [
      "GPA: 3.7/4.0",
      "Dean's List for 6 semesters",
      "Senior Project: Mobile App for Campus Navigation",
      "Member of ACM Student Chapter",
    ],
  },
  {
    id: "7",
    type: "other",
    period: "2017",
    startYear: 2017,
    endYear: 2017,
    title: "Hackathon Winner",
    organization: "TechCrunch Disrupt",
    description:
      "Won first place at TechCrunch Disrupt Hackathon with an AI-powered accessibility tool.",
    details: [
      "Built a prototype in 24 hours with a team of 4",
      "Presented to panel of judges including VCs and tech leaders",
      "Featured in TechCrunch article about the event",
    ],
    skills: ["Python", "TensorFlow", "React Native"],
  },
];

const chalk_palette = {
  lavender: "#9877a2",
  blue: "#8499c1",
  rose: "#d990a3",
  blush: "#f2dede",
  mint: "#96c8c5",
};

const typeConfig: Record<ExperienceType, { label: string; color: string; bgColor: string; borderColor: string; lineColor: string; cardBg: string; cardHover: string; skillBg: string }> = {
  work: {
    label: "Work",
    color: "text-[#d990a3]",
    bgColor: "bg-[#d990a3]",
    borderColor: "border-[#d990a3]",
    lineColor: chalk_palette.rose,
    cardBg: "bg-[#d990a3]",
    cardHover: "hover:bg-[#c97592]",
    skillBg: "bg-[#ad6e7d]",
  },
  education: {
    label: "Education",
    color: "text-[#8499c1]",
    bgColor: "bg-[#8499c1]",
    borderColor: "border-[#8499c1]",
    lineColor: chalk_palette.blue,
    cardBg: "bg-[#8499c1]",
    cardHover: "hover:bg-[#7488ab]",
    skillBg: "bg-[#6f7da3]",
  },
  other: {
    label: "Other",
    color: "text-[#96c8c5]",
    bgColor: "bg-[#96c8c5]",
    borderColor: "border-[#96c8c5]",
    lineColor: chalk_palette.mint,
    cardBg: "bg-[#96c8c5]",
    cardHover: "hover:bg-[#86b2b0]",
    skillBg: "bg-[#6aa6a3]",
  },
};

const YEAR_HEIGHT = 80; // pixels per year
const MONTH_HEIGHT = YEAR_HEIGHT / 12;

const getStartMonth = (item: TimelineItem) => item.startMonth ?? 1;
const getEndMonth = (item: TimelineItem) => item.endMonth ?? 12;
const getMonthIndex = (year: number, month: number) => year * 12 + (month - 1);
const getItemStartIndex = (item: TimelineItem) => getMonthIndex(item.startYear, getStartMonth(item));
const getItemEndIndex = (item: TimelineItem) => getMonthIndex(item.endYear, getEndMonth(item));
const sortTimelineItemsByEndDate = (items: TimelineItem[]) =>
  [...items].sort((a, b) => getItemEndIndex(b) - getItemEndIndex(a));

// Calculate column positions for overlapping items
function calculateColumns(items: TimelineItem[]): Map<string, number> {
  const columns = new Map<string, number>();
  const sortedItems = [...items].sort((a, b) => getItemStartIndex(a) - getItemStartIndex(b));
  
  const columnEndIndexes: number[] = [];
  
  for (const item of sortedItems) {
    let column = 0;
    const startIndex = getItemStartIndex(item);
    for (let i = 0; i < columnEndIndexes.length; i++) {
      if (columnEndIndexes[i] < startIndex) {
        column = i;
        break;
      }
      column = i + 1;
    }
    
    columns.set(item.id, column);
    columnEndIndexes[column] = getItemEndIndex(item);
  }
  
  return columns;
}

const BAR_WIDTH = 14;
const BAR_GAP = 20;

export default function CVPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ExperienceType | "all">("all");
  const timelineRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [linePositions, setLinePositions] = useState<Map<string, { barRightX: number; barCenterY: number; cardLeftX: number; cardY: number }>>(new Map());
  const { content } = useSiteContent(initialSiteContent as SiteContent);
  const timelineItems = useMemo(
    () =>
      sortTimelineItemsByEndDate(
        (content.cv.items.length ? content.cv.items : fallbackTimelineItems) as TimelineItem[]
      ),
    [content.cv.items]
  );

  const filteredItems = useMemo(() => {
    return timelineItems
      .filter((item) => filter === "all" || item.type === filter)
      .sort((a, b) => getItemEndIndex(b) - getItemEndIndex(a));
  }, [filter, timelineItems]);

  const minYear = Math.min(...timelineItems.map(i => i.startYear));
  const maxYear = currentYear;
  const totalYears = maxYear - minYear + 1;
  
  const columnPositions = useMemo(() => calculateColumns(filteredItems), [filteredItems]);
  const maxColumns = Math.max(0, ...Array.from(columnPositions.values())) + 1;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Generate year labels
  const yearLabels = [];
  for (let year = maxYear; year >= minYear; year--) {
    yearLabels.push(year);
  }

  // Track bar and card positions for connecting lines
  useEffect(() => {
    const updatePositions = () => {
      if (!timelineRef.current) return;
      const containerRect = timelineRef.current.getBoundingClientRect();
      const cardsContainer = timelineRef.current.querySelector('[data-cards-container]');
      if (!cardsContainer) return;
      
      const cardsContainerRect = cardsContainer.getBoundingClientRect();
      const newLinePositions = new Map<string, { barRightX: number; barCenterY: number; cardLeftX: number; cardY: number }>();
      
      filteredItems.forEach(item => {
        const barEl = timelineRef.current?.querySelector(`[data-bar-id="${item.id}"]`);
        const cardEl = cardRefs.current.get(item.id);
        
        if (barEl && cardEl) {
          const barRect = barEl.getBoundingClientRect();
          const cardRect = cardEl.getBoundingClientRect();
          
          // Calculate positions relative to the cards container (where SVG lives)
          const barRightX = barRect.right - cardsContainerRect.left;
          const barCenterY = barRect.top + barRect.height / 2 - cardsContainerRect.top;
          const cardLeftX = cardRect.left - cardsContainerRect.left;
          const cardY = cardRect.top + 28 - cardsContainerRect.top; // 28px from top of card (middle of header)
          
          newLinePositions.set(item.id, { barRightX, barCenterY, cardLeftX, cardY });
        }
      });
      
      setLinePositions(newLinePositions);
    };
    
    const handleTransitionEnd = () => {
      updatePositions();
    };
    
    // Update positions immediately, then after animation starts, and after it completes
    updatePositions();
    const timeoutId1 = setTimeout(updatePositions, 50);
    const timeoutId2 = setTimeout(updatePositions, 350); // After animation completes
    
    // Listen for transition end on cards
    const cards = timelineRef.current?.querySelectorAll('[data-cards-container] > div > div');
    cards?.forEach(card => {
      card.addEventListener('transitionend', handleTransitionEnd);
    });
    
    window.addEventListener('resize', updatePositions);
    
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      cards?.forEach(card => {
        card.removeEventListener('transitionend', handleTransitionEnd);
      });
      window.removeEventListener('resize', updatePositions);
    };
  }, [filteredItems, expandedId]);

  return (
    <PageLayout>
      <section className="pt-8 pb-12 lg:pt-12 lg:pb-24 px-6 lg:px-12">
        <div className="max-w-full mx-auto w-full">
          {/* Header */}
          <h2 className="text-xs uppercase tracking-widest leading-none text-muted-foreground mb-12 flex items-center gap-4">
            <span className="h-px w-8 bg-muted-foreground" />
            {content.site.headers.cv}
          </h2>
          <PageIntro
            paragraphs={content.site.pageIntro.cv}
            className="mb-10"
          />
          <div className="mb-12">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="w-fit border-border hover:bg-secondary/50"
            >
              <Link href={content.cv.documentPath || "/cv.pdf"} target="_blank">
                <Download className="size-4 mr-2" />
                {content.cv.documentLabel || "Download CV"}
              </Link>
            </Button>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-6 mb-12">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                filter === "all"
                  ? "bg-[#9877a2]/20 text-[#9877a2]"
                  : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-[#9877a2]/10"
              )}
            >
              <div className="w-4 h-4 rounded bg-[#9877a2]" />
              <span className="text-sm font-medium">All</span>
            </button>
            {(Object.keys(typeConfig) as ExperienceType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                  filter === type
                    ? typeConfig[type].bgColor + " text-foreground"
                    : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <div className={cn("w-4 h-4 rounded", typeConfig[type].bgColor)} />
                <span className="text-sm font-medium">{typeConfig[type].label}</span>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex gap-6 lg:gap-8" ref={timelineRef}>
            {/* Timeline Section */}
            <div className="relative flex gap-0 flex-shrink-0">
              {/* Year Labels */}
              <div className="relative w-10 flex-shrink-0">
                {yearLabels.map((year, index) => {
                  const topPx = index * YEAR_HEIGHT + YEAR_HEIGHT / 2;
                  return (
                    <div
                      key={year}
                      className="absolute right-2 text-sm text-muted-foreground font-bold"
                      style={{ top: `${topPx}px`, transform: 'translateY(-50%)' }}
                    >
                      {year}
                    </div>
                  );
                })}
              </div>

              {/* Main Timeline Bar */}
              <div 
                className="relative w-3 bg-border rounded-full flex-shrink-0"
                style={{ height: `${totalYears * YEAR_HEIGHT}px` }}
              >
                {/* Year tick marks */}
                {yearLabels.map((year, index) => {
                  const topPx = index * YEAR_HEIGHT;
                  return (
                    <div
                      key={year}
                      className="absolute left-0 w-full h-0.5 bg-muted-foreground/40"
                      style={{ top: `${topPx}px` }}
                    />
                  );
                })}
              </div>

              {/* Experience Bars */}
              <div 
                className="relative ml-2"
                style={{ 
                  height: `${totalYears * YEAR_HEIGHT}px`,
                  width: `${maxColumns * 20 + 8}px`
                }}
              >
                {filteredItems.map((item) => {
                  const config = typeConfig[item.type];
                  const endIndex = getItemEndIndex(item);
                  const startIndex = getItemStartIndex(item);
                  const topPx = ((maxYear - item.endYear) * YEAR_HEIGHT) + ((12 - getEndMonth(item)) * MONTH_HEIGHT);
                  const heightPx = (endIndex - startIndex + 1) * MONTH_HEIGHT;
                  const column = columnPositions.get(item.id) || 0;
                  
                  return (
                    <div
                      key={item.id}
                      data-bar-id={item.id}
                      onClick={() => toggleExpand(item.id)}
                      className={cn(
                        "absolute rounded-md transition-all cursor-pointer hover:opacity-80",
                        config.bgColor,
                        expandedId === item.id && "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                      )}
                      style={{
                        top: `${topPx}px`,
                        height: `${Math.max(heightPx, 24)}px`,
                        left: `${column * 20}px`,
                        width: '14px',
                      }}
                      title={`${item.title} (${item.period})`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Cards Section with SVG Connecting Lines */}
            <div className="flex-1 min-w-0 relative" data-cards-container>
              {/* SVG Layer for connecting lines - positioned to cover the gap between bars and cards */}
              <svg 
                className="absolute inset-0 pointer-events-none"
                style={{ 
                  left: `-${24 + maxColumns * 20 + 16}px`, 
                  width: `calc(100% + ${24 + maxColumns * 20 + 16}px)`,
                  height: '100%',
                  overflow: 'visible'
                }}
              >
                {filteredItems.map((item) => {
                  const isExpanded = expandedId === item.id;
                  const config = typeConfig[item.type];
                  const positions = linePositions.get(item.id);
                  
                  if (!positions) return null;
                  
                  const { barRightX, barCenterY, cardLeftX, cardY } = positions;
                  
                  // Offset for SVG positioning
                  const svgOffset = 24 + maxColumns * 20 + 16;
                  const startX = barRightX + svgOffset;
                  const endX = cardLeftX + svgOffset;
                  const midX = (startX + endX) / 2;
                  
                  return (
                    <path
                      key={item.id}
                      d={`M ${startX} ${barCenterY} C ${midX} ${barCenterY}, ${midX} ${cardY}, ${endX} ${cardY}`}
                      fill="none"
                      strokeWidth={isExpanded ? 4 : 3}
                      strokeLinecap="round"
                      style={{ stroke: config.lineColor }}
                      className={cn(
                        "transition-all",
                        isExpanded ? "opacity-100" : "opacity-80"
                      )}
                    />
                  );
                })}
              </svg>
              
              {/* Cards */}
              <div className="space-y-4">
              {filteredItems.map((item) => {
                const config = typeConfig[item.type];
                const isExpanded = expandedId === item.id;
                
                return (
                  <div 
                    key={item.id} 
                    ref={(el) => {
                      if (el) cardRefs.current.set(item.id, el);
                    }}
                  >
                    
                    {/* Card */}
                    <div
                      onMouseEnter={() => setExpandedId(item.id)}
                      onMouseLeave={() => setExpandedId(null)}
                      className={cn(
                        "rounded-lg border-2 transition-all text-black",
                        config.borderColor,
                        config.cardBg
                      )}
                    >
                      {/* Card Header - Always Visible */}
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg md:text-2xl text-black font-semibold leading-snug break-words">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-xs text-black/90 sm:text-sm break-words">
                              {item.period}
                            </p>
                            <p className="mt-1 text-xs text-black/70 sm:text-sm break-words">
                              {item.organization}
                            </p>
                          </div>
                          <ChevronDown
                            className={cn(
                              "size-4 sm:size-5 text-black transition-transform flex-shrink-0",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-300 ease-in-out",
                          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        )}
                      >
                        <div className="mt-0 border-t border-border/30 px-3 pb-3 pt-0 sm:px-4 sm:pb-4">
                          <div className="pt-3 sm:pt-4">
                            <p className="text-xs sm:text-sm text-black leading-relaxed">
                              {item.description}
                            </p>

                            {item.details && (
                              <ul className="mt-3 space-y-2 sm:mt-4">
                                {item.details.map((detail, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2 text-xs text-black sm:text-sm"
                                  >
                                    <span className={cn("size-1.5 rounded-full mt-1.5 flex-shrink-0", config.bgColor)} />
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            )}

                            {item.skills && (
                              <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                                {item.skills.map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant="secondary"
                                    className={cn(
                                      "border-0 text-[10px] sm:text-xs text-white",
                                      config.skillBg
                                    )}
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {item.url && (
                              <Link
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="mt-3 inline-flex items-center gap-1.5 text-xs text-black hover:underline sm:mt-4 sm:text-sm"
                              >
                                Visit website
                                <ExternalLink className="size-3.5" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      </section>
    </PageLayout>
  );
}
