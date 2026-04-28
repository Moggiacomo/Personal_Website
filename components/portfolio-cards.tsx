"use client";

import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { MediaAsset } from "@/components/media-asset";
import { Badge } from "@/components/ui/badge";
import { getExternalLinkIcon, hasUsableLink } from "@/lib/external-links";
import { cn } from "@/lib/utils";

const INTERNAL_TAGS = new Set(["Featured in About"]);
import type { Project } from "@/lib/projects";

interface PortfolioCardsProps {
  projects: Project[];
  layout?: "grid" | "stack";
  idPrefix?: string;
  initialExpandedId?: string | null;
}

const expandedViewportStyle = {
  "--expanded-viewport-gap": "clamp(1.5rem, 4vw, 3rem)",
} as React.CSSProperties;

const expandedStackCardStyle = {
  ...expandedViewportStyle,
  width: "calc(100vw - (var(--expanded-viewport-gap) * 2))",
  maxWidth: "calc(100vw - (var(--expanded-viewport-gap) * 2))",
  marginTop: "var(--expanded-viewport-gap)",
  marginBottom: "var(--expanded-viewport-gap)",
  marginLeft: "auto",
  marginRight: "auto",
} as React.CSSProperties;

export function PortfolioCards({
  projects,
  layout = "grid",
  idPrefix,
  initialExpandedId,
}: PortfolioCardsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    initialExpandedId ?? null
  );
  const [activeFigures, setActiveFigures] = useState<Record<string, number>>({});
  const [fullscreenGallery, setFullscreenGallery] = useState<{
    cardId: string;
    figures: { src: string; alt: string }[];
    activeIndex: number;
    title: string;
  } | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const articleRefs = useRef(new Map<string, HTMLElement>());

  const isGrid = layout === "grid";

  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!fullscreenGallery) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFullscreenGallery(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [fullscreenGallery]);

  useEffect(() => {
    setExpandedId(initialExpandedId ?? null);
  }, [initialExpandedId]);

  useEffect(() => {
    if (!expandedId) return;

    const target = articleRefs.current.get(expandedId);
    if (!target) return;

    const timeoutId = window.setTimeout(() => {
      const rect = target.getBoundingClientRect();
      const styles = window.getComputedStyle(target);
      const viewportGapValue =
        styles.getPropertyValue("--expanded-viewport-gap").trim() || "24px";
      const resolvedGap = Number.parseFloat(viewportGapValue) || 24;
      const targetTop = window.scrollY + rect.top - resolvedGap;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });
    }, 120);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [expandedId]);

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
    if (fullscreenGallery) {
      return;
    }
    leaveTimeoutRef.current = setTimeout(() => {
      setExpandedId((current) => (current === cardId ? null : current));
      setActiveFigures((current) => ({
        ...current,
        [cardId]: 0,
      }));
      leaveTimeoutRef.current = null;
    }, 240);
  };

  const handleCardClick = (cardId: string, event: ReactMouseEvent<HTMLElement>) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest("a,button")) {
      return;
    }
    openCard(cardId);
  };

  return (
    <div className={cn("project-cards-shell", isGrid ? "grid gap-6 md:grid-cols-2" : "space-y-6")}>
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
            ref={(element) => {
              if (element) {
                articleRefs.current.set(cardId, element);
              } else {
                articleRefs.current.delete(cardId);
              }
            }}
            onClick={(event) => handleCardClick(cardId, event)}
            onMouseLeave={() => closeCard(cardId)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                closeCard(cardId);
              }
            }}
            className={cn(
              "group scroll-mt-8 text-foreground transition-all duration-[500ms] ease-[cubic-bezier(0.18,0.9,0.2,1)]",
              isGrid
                ? "relative overflow-hidden rounded-lg border border-border/50 bg-secondary/50 hover:border-primary/30 hover:bg-secondary/75 hover:shadow-[0_24px_80px_-36px_rgba(0,0,0,0.55)]"
                : "rounded-lg hover:bg-secondary/30",
              isExpanded ? "cursor-default" : "cursor-pointer",
              isExpanded &&
                (isGrid
                  ? "scale-[1.01]"
                  : "flex items-center bg-secondary/30"),
              !isGrid && !isExpanded && "-mx-6"
            )}
            style={!isGrid && isExpanded ? expandedStackCardStyle : undefined}
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
                onOpenFullscreen={() =>
                  {
                    if (leaveTimeoutRef.current) {
                      clearTimeout(leaveTimeoutRef.current);
                      leaveTimeoutRef.current = null;
                    }
                    setFullscreenGallery({
                      cardId,
                      figures,
                      activeIndex: activeFigure,
                      title: project.title,
                    });
                  }
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
                onOpenFullscreen={() =>
                  {
                    if (leaveTimeoutRef.current) {
                      clearTimeout(leaveTimeoutRef.current);
                      leaveTimeoutRef.current = null;
                    }
                    setFullscreenGallery({
                      cardId,
                      figures,
                      activeIndex: activeFigure,
                      title: project.title,
                    });
                  }
                }
              />
            )}
          </article>
        );
      })}
      {fullscreenGallery ? (
        <FullscreenFigureViewer
          figures={fullscreenGallery.figures}
          title={fullscreenGallery.title}
          activeIndex={fullscreenGallery.activeIndex}
          onClose={() => {
            setActiveFigures((current) => ({
              ...current,
              [fullscreenGallery.cardId]: fullscreenGallery.activeIndex,
            }));
            setFullscreenGallery(null);
          }}
          onSelect={(index) => {
            setActiveFigures((current) => ({
              ...current,
              [fullscreenGallery.cardId]: index,
            }));
            setFullscreenGallery((current) =>
              current ? { ...current, activeIndex: index } : current
            );
          }}
        />
      ) : null}
    </div>
  );
}

function GridProjectCard({
  project,
  figures,
  activeFigure,
  isExpanded,
  onSelectFigure,
  onOpenFullscreen,
}: {
  project: Project;
  figures: { src: string; alt: string }[];
  activeFigure: number;
  isExpanded: boolean;
  onSelectFigure: (index: number) => void;
  onOpenFullscreen: () => void;
}) {
  const mediaRef = useFlipAnimation<HTMLDivElement>(isExpanded);

  return (
    <div
      className={cn(
        "project-card-shell flex flex-col p-6",
        isExpanded ? "project-card-shell-expanded" : "project-card-shell-collapsed"
      )}
    >
      <div
        ref={mediaRef}
        className={cn(
          "project-card-media",
          "relative overflow-hidden rounded-2xl shadow-none transition-[opacity,border-radius] duration-[1100ms] ease-[cubic-bezier(0.18,0.9,0.2,1)]",
          isExpanded
            ? "project-card-media-expanded order-2 mt-3 mx-auto aspect-[16/10] w-full max-w-[64%] rounded-none bg-transparent"
            : "project-card-media-collapsed order-1 -mx-6 -mt-6 mb-6 aspect-square rounded-none bg-muted/20"
        )}
      >
        <MediaAsset
          src={isExpanded ? (figures[activeFigure]?.src ?? project.image) : project.image}
          alt={isExpanded ? (figures[activeFigure]?.alt ?? project.title) : project.title}
          fill
          className={cn(
            "opacity-80 transition-all duration-[1200ms] ease-[cubic-bezier(0.18,0.9,0.2,1)] group-hover:opacity-100",
            isExpanded ? "object-contain" : "object-contain"
          )}
        />
        {isExpanded ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpenFullscreen();
            }}
            className="absolute bottom-3 right-3 rounded-full border border-border/60 bg-background/85 p-2 text-foreground shadow-sm transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`Open ${project.title} figures fullscreen`}
          >
            <Expand className="size-4" />
          </button>
        ) : null}
      </div>

      <div className={cn("project-card-copy order-2 flex flex-1 flex-col", isExpanded && "order-1 text-center")}>
        <CardHeader
          title={project.title}
          subtitle={project.subtitle}
          github={project.github}
          url={project.url}
          expanded={isExpanded}
        />
        <div
          className={cn(
            "transition-all duration-[1200ms] ease-[cubic-bezier(0.18,0.9,0.2,1)]",
            isExpanded ? "mt-0 max-h-none overflow-visible opacity-100" : "mt-4 max-h-40 overflow-hidden opacity-100"
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
  onOpenFullscreen,
}: {
  project: Project;
  figures: { src: string; alt: string }[];
  activeFigure: number;
  isExpanded: boolean;
  onSelectFigure: (index: number) => void;
  onOpenFullscreen: () => void;
}) {
  const mediaRef = useFlipAnimation<HTMLDivElement>(isExpanded);

  return (
    <div
      className={cn(
        "project-card-stack",
        isExpanded ? "project-card-stack-expanded" : "project-card-stack-collapsed",
        "grid w-full gap-5 p-6 transition-[grid-template-columns] duration-[1200ms] ease-[cubic-bezier(0.18,0.9,0.2,1)]",
        isExpanded ? "grid-cols-1 min-h-full" : "grid-cols-1 md:grid-cols-[16rem_minmax(0,1fr)]"
      )}
    >
      <div
        ref={mediaRef}
        className={cn(
          "project-card-media",
          "relative overflow-hidden rounded-xl transition-[border-radius,box-shadow,width] duration-[1200ms] ease-[cubic-bezier(0.18,0.9,0.2,1)]",
          isExpanded
            ? "project-card-media-expanded order-2 mx-auto aspect-[16/10] w-full max-w-[64%] rounded-none bg-transparent"
            : "project-card-media-collapsed order-1 aspect-square md:row-span-2 bg-muted/20"
        )}
      >
        <MediaAsset
          src={isExpanded ? (figures[activeFigure]?.src ?? project.image) : project.image}
          alt={isExpanded ? (figures[activeFigure]?.alt ?? project.title) : project.title}
          fill
          className={cn(
            "opacity-80 transition-all duration-[1200ms] ease-[cubic-bezier(0.18,0.9,0.2,1)] group-hover:opacity-100",
            isExpanded ? "object-contain" : "object-contain"
          )}
        />
        {isExpanded ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpenFullscreen();
            }}
            className="absolute bottom-3 right-3 rounded-full border border-border/60 bg-background/85 p-2 text-foreground shadow-sm transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`Open ${project.title} figures fullscreen`}
          >
            <Expand className="size-4" />
          </button>
        ) : null}
      </div>

      <div className={cn("project-card-copy space-y-2", isExpanded ? "order-1 text-center" : "order-2")}>
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
          "transition-all duration-[1200ms] ease-[cubic-bezier(0.18,0.9,0.2,1)]",
          isExpanded ? "order-3 max-h-none overflow-visible opacity-100" : "order-3 mt-1 max-h-56 overflow-hidden opacity-100"
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

function FullscreenFigureViewer({
  figures,
  title,
  activeIndex,
  onClose,
  onSelect,
}: {
  figures: { src: string; alt: string }[];
  title: string;
  activeIndex: number;
  onClose: () => void;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 p-4">
        <p className="min-w-0 truncate text-sm font-medium text-foreground sm:text-base">
          {title}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-border/60 bg-background/85 p-2 text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Close fullscreen gallery"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center gap-3 px-3 pb-3">
        <button
          type="button"
          onClick={() => onSelect((activeIndex - 1 + figures.length) % figures.length)}
          className="rounded-full border border-border/60 bg-background/85 p-2 text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40"
          aria-label="Previous image"
          disabled={figures.length === 1}
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="relative flex-1 self-stretch overflow-hidden rounded-2xl bg-background/30">
          <MediaAsset
            src={figures[activeIndex]?.src ?? figures[0]?.src ?? ""}
            alt={figures[activeIndex]?.alt ?? title}
            fill
            className="object-contain"
          />
        </div>
        <button
          type="button"
          onClick={() => onSelect((activeIndex + 1) % figures.length)}
          className="rounded-full border border-border/60 bg-background/85 p-2 text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40"
          aria-label="Next image"
          disabled={figures.length === 1}
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {figures.map((figure, index) => (
          <button
            key={`${figure.src}-${index}`}
            type="button"
            onClick={() => onSelect(index)}
            className={cn(
              "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border p-1 transition-all",
              index === activeIndex
                ? "border-primary bg-primary/10"
                : "border-border/50 bg-background/30"
            )}
            aria-label={`Show figure ${index + 1}`}
            aria-pressed={index === activeIndex}
          >
            <div className="relative h-full w-full overflow-hidden rounded-lg">
              <MediaAsset src={figure.src} alt={figure.alt} fill className="object-contain" />
            </div>
          </button>
        ))}
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
  const hasGithub = hasUsableLink(github);
  const hasUrl = hasUsableLink(url);
  const GithubIcon = getExternalLinkIcon(github);
  const UrlIcon = getExternalLinkIcon(url);

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
            "project-card-title font-medium text-foreground transition-colors group-hover:text-primary group-focus-within:text-primary",
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
        {hasGithub && (
          <Link
            href={github.trim()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`View ${title} on GitHub`}
          >
            <GithubIcon className="size-5" />
          </Link>
        )}
        {hasUrl && (
          <Link
            href={url.trim()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`View ${title} live`}
          >
            <UrlIcon className="size-5" />
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
  const visibleTags = tags.filter((tag) => !INTERNAL_TAGS.has(tag));

  if (!visibleTags.length) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-2 pt-2", centered ? "justify-center" : "justify-start", className)}>
      {visibleTags.map((tag) => (
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
    <div className="mx-auto grid w-full max-w-[min(100%,42rem)] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <button
          type="button"
          onClick={() => onSelect((activeIndex - 1 + figures.length) % figures.length)}
          className="rounded-full border border-border/60 p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-default disabled:opacity-40"
          aria-label="Show previous figure"
          disabled={figures.length === 1}
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="relative flex min-h-24 w-full items-center justify-center overflow-hidden px-4 py-2">
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
                  "relative h-16 w-20 shrink-0 rounded-none border border-border/40 bg-transparent p-1.5 transition-all duration-500 ease-[cubic-bezier(0.18,0.9,0.2,1)]",
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
              <div className="relative h-full w-full overflow-hidden rounded-none">
                <MediaAsset
                  src={figure.src}
                  alt={figure.alt}
                    fill
                    className="object-contain"
                  />
                </div>
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
