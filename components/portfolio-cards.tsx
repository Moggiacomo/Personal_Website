"use client";

import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/projects";

interface PortfolioCardsProps {
  projects: Project[];
  layout?: "grid" | "stack";
  idPrefix?: string;
  initialExpandedId?: string | null;
}

export function PortfolioCards({
  projects,
  layout = "grid",
  idPrefix,
  initialExpandedId,
}: PortfolioCardsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeFigures, setActiveFigures] = useState<Record<string, number>>({});
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isGrid = layout === "grid";

  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (initialExpandedId) {
      setExpandedId(initialExpandedId);
    }
  }, [initialExpandedId]);

  const openCard = (cardId: string) => {
    if (expandedId === cardId) {
      return;
    }
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setExpandedId(cardId);
  };

  const closeCard = (cardId: string) => {
    leaveTimeoutRef.current = setTimeout(() => {
      setExpandedId((current) => (current === cardId ? null : current));
      setActiveFigures((current) => ({
        ...current,
        [cardId]: 0,
      }));
      leaveTimeoutRef.current = null;
    }, 140);
  };

  const handleCardClick = (cardId: string, event: ReactMouseEvent<HTMLElement>) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest("a,button")) {
      return;
    }
    openCard(cardId);
  };

  return (
    <div className={cn(isGrid ? "grid gap-6 md:grid-cols-2" : "space-y-6")}>
      {projects.map((project, index) => {
        const cardId = idPrefix ? `${idPrefix}-${index}` : project.title;
        const figures = project.figures?.length
          ? project.figures
          : [{ src: project.image, alt: project.title }];
        const activeFigure = activeFigures[cardId] ?? 0;
        const isExpanded = expandedId === cardId;

        return (
          <article
            key={cardId}
            id={cardId}
            onClick={(event) => handleCardClick(cardId, event)}
            onMouseLeave={() => closeCard(cardId)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                closeCard(cardId);
              }
            }}
            className={cn(
              "group text-foreground transition-all duration-[500ms] ease-[cubic-bezier(0.18,0.9,0.2,1)]",
              isGrid
                ? "relative overflow-hidden rounded-lg border border-border/50 bg-secondary/50 hover:border-primary/30 hover:bg-secondary/75 hover:shadow-[0_24px_80px_-36px_rgba(0,0,0,0.55)]"
                : "rounded-lg hover:bg-secondary/30",
              isExpanded ? "cursor-default" : "cursor-pointer",
              isExpanded && (isGrid ? "scale-[1.01]" : "bg-secondary/30"),
              !isGrid && "-mx-6"
            )}
          >
            {isGrid ? (
              <GridProjectCard
                project={project}
                figures={figures}
                activeFigure={activeFigure}
                isExpanded={isExpanded}
                onSelectFigure={(figureIndex) =>
                  setActiveFigures((current) => ({
                    ...current,
                    [cardId]: figureIndex,
                  }))
                }
              />
            ) : (
              <StackProjectCard
                project={project}
                figures={figures}
                activeFigure={activeFigure}
                isExpanded={isExpanded}
                onSelectFigure={(figureIndex) =>
                  setActiveFigures((current) => ({
                    ...current,
                    [cardId]: figureIndex,
                  }))
                }
              />
            )}
          </article>
        );
      })}
    </div>
  );
}

function GridProjectCard({
  project,
  figures,
  activeFigure,
  isExpanded,
  onSelectFigure,
}: {
  project: Project;
  figures: { src: string; alt: string }[];
  activeFigure: number;
  isExpanded: boolean;
  onSelectFigure: (index: number) => void;
}) {
  const mediaRef = useFlipAnimation<HTMLDivElement>(isExpanded);

  return (
    <div className="flex flex-col p-6">
      <div
        ref={mediaRef}
        className={cn(
          "relative overflow-hidden rounded-2xl shadow-none transition-[opacity,border-radius] duration-[1100ms] ease-[cubic-bezier(0.18,0.9,0.2,1)]",
          isExpanded
            ? "order-2 mt-3 mx-auto aspect-[16/10] w-full max-w-[64%] bg-transparent"
            : "order-1 -mx-6 -mt-6 mb-6 aspect-square rounded-none bg-muted/20"
        )}
      >
        <Image
          src={isExpanded ? (figures[activeFigure]?.src ?? project.image) : project.image}
          alt={isExpanded ? (figures[activeFigure]?.alt ?? project.title) : project.title}
          fill
          className={cn(
            "opacity-80 transition-all duration-[1200ms] ease-[cubic-bezier(0.18,0.9,0.2,1)] group-hover:opacity-100",
            isExpanded ? "object-contain" : "object-cover"
          )}
        />
      </div>

      <div className={cn("order-2 flex flex-1 flex-col", isExpanded && "order-1 text-center")}>
        <CardHeader
          title={project.title}
          subtitle={project.subtitle}
          github={project.github}
          url={project.url}
          expanded={isExpanded}
        />
        <div
          className={cn(
            "overflow-hidden transition-all duration-[1200ms] ease-[cubic-bezier(0.18,0.9,0.2,1)]",
            isExpanded ? "mt-0 max-h-[760px] opacity-100" : "mt-4 max-h-40 opacity-100"
          )}
        >
          {isExpanded ? (
            <div className="space-y-3">
              <ProjectFigureGallery
                figures={figures}
                activeIndex={activeFigure}
                onSelect={onSelectFigure}
              />
              <p className="mx-auto max-w-[42ch] text-sm leading-relaxed text-muted-foreground md:text-base">
                {project.description}
              </p>
            </div>
          ) : (
            <p className="text-base leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          )}
        </div>
        <TagList tags={project.tags} centered={false} className={cn(!isExpanded && "mt-auto pt-4", isExpanded && "pt-2")} />
      </div>
    </div>
  );
}

function StackProjectCard({
  project,
  figures,
  activeFigure,
  isExpanded,
  onSelectFigure,
}: {
  project: Project;
  figures: { src: string; alt: string }[];
  activeFigure: number;
  isExpanded: boolean;
  onSelectFigure: (index: number) => void;
}) {
  const mediaRef = useFlipAnimation<HTMLDivElement>(isExpanded);

  return (
    <div
      className={cn(
        "grid gap-5 p-6 transition-[grid-template-columns] duration-[1200ms] ease-[cubic-bezier(0.18,0.9,0.2,1)]",
        isExpanded ? "grid-cols-1" : "grid-cols-1 md:grid-cols-[16rem_minmax(0,1fr)]"
      )}
    >
      <div
        ref={mediaRef}
        className={cn(
          "relative overflow-hidden rounded-xl transition-[border-radius,box-shadow,width] duration-[1200ms] ease-[cubic-bezier(0.18,0.9,0.2,1)]",
          isExpanded
            ? "order-2 mx-auto aspect-[16/10] w-full max-w-[64%] rounded-[24px] bg-transparent"
            : "order-1 aspect-square md:row-span-2 bg-muted/20"
        )}
      >
        <Image
          src={isExpanded ? (figures[activeFigure]?.src ?? project.image) : project.image}
          alt={isExpanded ? (figures[activeFigure]?.alt ?? project.title) : project.title}
          fill
          className={cn(
            "opacity-80 transition-all duration-[1200ms] ease-[cubic-bezier(0.18,0.9,0.2,1)] group-hover:opacity-100",
            isExpanded ? "object-contain" : "object-cover"
          )}
        />
      </div>

      <div className={cn("space-y-2", isExpanded ? "order-1 text-center" : "order-2")}>
        <CardHeader
          title={project.title}
          subtitle={project.subtitle}
          github={project.github}
          url={project.url}
          expanded={isExpanded}
        />
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-[1200ms] ease-[cubic-bezier(0.18,0.9,0.2,1)]",
          isExpanded ? "order-3 max-h-[820px] opacity-100" : "order-3 mt-1 max-h-56 opacity-100"
        )}
      >
        {isExpanded ? (
          <div className="space-y-3 text-center">
            <ProjectFigureGallery
              figures={figures}
              activeIndex={activeFigure}
              onSelect={onSelectFigure}
            />
            <p className="mx-auto max-w-[48ch] leading-relaxed text-muted-foreground md:text-lg/7">
              {project.description}
            </p>
            <TagList tags={project.tags} />
          </div>
        ) : (
          <div className="flex min-h-full flex-col">
            <p className="text-base leading-relaxed text-muted-foreground">{project.description}</p>
            <TagList tags={project.tags} centered={false} className="mt-auto pt-6" />
          </div>
        )}
      </div>
    </div>
  );
}

function useFlipAnimation<T extends HTMLElement>(trigger: boolean) {
  const ref = useRef<T>(null);
  const previousRectRef = useRef<DOMRect | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const nextRect = element.getBoundingClientRect();
    const previousRect = previousRectRef.current;

    if (previousRect) {
      const deltaX = previousRect.left - nextRect.left;
      const deltaY = previousRect.top - nextRect.top;
      const scaleX = previousRect.width / nextRect.width;
      const scaleY = previousRect.height / nextRect.height;

      if (deltaX || deltaY || Math.abs(1 - scaleX) > 0.01 || Math.abs(1 - scaleY) > 0.01) {
        element.animate(
          [
            {
              transformOrigin: "top left",
              transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`,
            },
            {
              transformOrigin: "top left",
              transform: "translate(0px, 0px) scale(1, 1)",
            },
          ],
          {
            duration: 1300,
            easing: "cubic-bezier(0.18, 0.9, 0.2, 1)",
          }
        );
      }
    }

    previousRectRef.current = nextRect;
  }, [trigger]);

  return ref;
}

function CardHeader({
  title,
  subtitle,
  github,
  url,
  expanded = false,
}: {
  title: string;
  subtitle?: string;
  github: string;
  url: string;
  expanded?: boolean;
}) {
  return (
    <div
      className={cn(
        "gap-4",
        expanded ? "relative flex justify-center pt-1" : "flex items-start justify-between"
      )}
    >
      <div className={cn(expanded && "text-center")}>
        <h3
          className={cn(
            "font-medium text-foreground transition-colors group-hover:text-primary group-focus-within:text-primary",
            expanded ? "text-center text-lg font-semibold tracking-tight md:text-2xl" : "text-xl md:text-2xl"
          )}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            className={cn(
              "mt-1 text-sm leading-relaxed text-muted-foreground",
              expanded ? "text-center md:text-base" : "md:text-base"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      <div
        className={cn(
          "flex items-center gap-2",
          expanded ? "absolute right-0 top-0 justify-end" : ""
        )}
      >
        {github && (
          <Link
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`View ${title} on GitHub`}
          >
            <Github className="size-5" />
          </Link>
        )}
        {url && (
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`View ${title} live`}
          >
            <ExternalLink className="size-5" />
          </Link>
        )}
      </div>
    </div>
  );
}

function TagList({
  tags,
  centered = true,
  className,
}: {
  tags: string[];
  centered?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2 pt-2", centered ? "justify-center" : "justify-start", className)}>
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="border-0 bg-primary/10 text-xs text-primary hover:bg-primary/20"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}

function ProjectFigureGallery({
  figures,
  activeIndex,
  onSelect,
}: {
  figures: { src: string; alt: string }[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onSelect((activeIndex - 1 + figures.length) % figures.length)}
          className="rounded-full border border-border/60 p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-default disabled:opacity-40"
          aria-label="Show previous figure"
          disabled={figures.length === 1}
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="relative flex min-h-20 max-w-[24rem] flex-1 items-center justify-center overflow-x-auto px-2 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {figures.map((figure, index) => {
            const offset = index - activeIndex;
            const clampedOffset = Math.max(-2, Math.min(2, offset));
            const isActive = index === activeIndex;

            return (
              <button
                key={`${figure.src}-${index}`}
                type="button"
                onClick={() => onSelect(index)}
                className={cn(
                  "relative h-16 w-20 shrink-0 overflow-hidden rounded-2xl border border-border/40 bg-card/60 transition-all duration-500 ease-[cubic-bezier(0.18,0.9,0.2,1)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  figures.length === 1
                    ? "z-10"
                    : isActive
                      ? "z-20 scale-110"
                      : "z-10 opacity-70 hover:opacity-100"
                )}
                style={{
                  marginLeft: figures.length === 1 || index === 0 ? 0 : "-1.5rem",
                  transform:
                    figures.length === 1
                      ? "scale(1)"
                      : `translateX(${clampedOffset * 0.55}rem) scale(${
                          isActive ? 1.1 : 0.9 - Math.min(Math.abs(offset), 2) * 0.08
                        })`,
                }}
                aria-label={`Show figure ${index + 1}`}
                aria-pressed={isActive}
              >
                <Image
                  src={figure.src}
                  alt={figure.alt}
                  fill
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onSelect((activeIndex + 1) % figures.length)}
          className="rounded-full border border-border/60 p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-default disabled:opacity-40"
          aria-label="Show next figure"
          disabled={figures.length === 1}
        >
          <ChevronRight className="size-4" />
        </button>
    </div>
  );
}
