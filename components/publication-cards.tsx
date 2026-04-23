"use client";

import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Publication } from "@/lib/publications";

interface PublicationCardsProps {
  publications: Publication[];
  layout?: "grid" | "stack";
  idPrefix?: string;
}

const expandedViewportStyle = {
  "--expanded-viewport-gap": "clamp(1.5rem, 4vw, 3rem)",
} as React.CSSProperties;

export function PublicationCards({
  publications,
  layout = "grid",
  idPrefix,
}: PublicationCardsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeFigures, setActiveFigures] = useState<Record<string, number>>({});
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const articleRefs = useRef(new Map<string, HTMLElement>());
  const isGrid = layout === "grid";

  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!expandedId) return;

    const target = articleRefs.current.get(expandedId);
    if (!target) return;

    const timeoutId = window.setTimeout(() => {
      const rect = target.getBoundingClientRect();
      const styles = window.getComputedStyle(target);
      const marginTop = Number.parseFloat(styles.marginTop) || 0;
      const marginBottom = Number.parseFloat(styles.marginBottom) || 0;
      const totalHeight = rect.height + marginTop + marginBottom;
      const targetTop =
        window.scrollY + rect.top - marginTop - (window.innerHeight - totalHeight) / 2;

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
    if (expandedId === cardId) return;
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
    <div className={cn(isGrid ? "grid gap-6 md:grid-cols-2" : "space-y-6")}>
      {publications.map((publication, index) => {
        const cardId = idPrefix ? `${idPrefix}-${index}` : publication.title;
        const figures = publication.figures?.length
          ? publication.figures
          : [{ src: publication.image, alt: publication.title }];
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
            style={
              !isGrid && isExpanded
                ? {
                    ...expandedViewportStyle,
                    width: "calc(100vw - (var(--expanded-viewport-gap) * 2))",
                    maxWidth: "calc(100vw - (var(--expanded-viewport-gap) * 2))",
                    marginTop: "var(--expanded-viewport-gap)",
                    marginBottom: "var(--expanded-viewport-gap)",
                    marginLeft: "auto",
                    marginRight: "auto",
                    minHeight: "calc(100svh - (var(--expanded-viewport-gap) * 2))",
                  }
                : undefined
            }
          >
            {isGrid ? (
              <GridPublicationCard
                publication={publication}
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
              <StackPublicationCard
                publication={publication}
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

function GridPublicationCard({
  publication,
  figures,
  activeFigure,
  isExpanded,
  onSelectFigure,
}: {
  publication: Publication;
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
            : "order-1 -mx-6 -mt-6 mb-6 aspect-[1/1.4142] rounded-none bg-muted/20"
        )}
      >
        <Image
          src={isExpanded ? (figures[activeFigure]?.src ?? publication.image) : publication.image}
          alt={isExpanded ? (figures[activeFigure]?.alt ?? publication.title) : publication.title}
          fill
          className={cn(
            "opacity-80 transition-all duration-[1200ms] ease-[cubic-bezier(0.18,0.9,0.2,1)] group-hover:opacity-100",
            isExpanded ? "object-contain" : "object-contain"
          )}
        />
      </div>

      <div className={cn("order-2 flex flex-1 flex-col", isExpanded && "order-1 text-center")}>
        <PublicationHeader publication={publication} expanded={isExpanded} />
        <div
          className={cn(
            "overflow-hidden transition-all duration-[1200ms] ease-[cubic-bezier(0.18,0.9,0.2,1)]",
            isExpanded ? "mt-0 max-h-[760px] opacity-100" : "mt-4 max-h-40 opacity-100"
          )}
        >
          {isExpanded ? (
            <div className="space-y-3">
              <PublicationFigureGallery
                figures={figures}
                activeIndex={activeFigure}
                onSelect={onSelectFigure}
              />
              <p className="mx-auto max-w-[42ch] text-sm leading-relaxed text-muted-foreground md:text-base">
                {publication.abstract}
              </p>
            </div>
          ) : (
            <p className="text-base leading-relaxed text-muted-foreground">
              {publication.abstract}
            </p>
          )}
        </div>
        <PublicationTagList
          tags={publication.tags}
          centered={false}
          className={cn(!isExpanded && "mt-auto pt-4", isExpanded && "pt-2")}
        />
      </div>
    </div>
  );
}

function StackPublicationCard({
  publication,
  figures,
  activeFigure,
  isExpanded,
  onSelectFigure,
}: {
  publication: Publication;
  figures: { src: string; alt: string }[];
  activeFigure: number;
  isExpanded: boolean;
  onSelectFigure: (index: number) => void;
}) {
  const mediaRef = useFlipAnimation<HTMLDivElement>(isExpanded);

  return (
    <div
      className={cn(
        "grid w-full gap-5 p-6 transition-[grid-template-columns] duration-[1200ms] ease-[cubic-bezier(0.18,0.9,0.2,1)]",
        isExpanded ? "grid-cols-1 min-h-full" : "grid-cols-1 md:grid-cols-[16rem_minmax(0,1fr)]"
      )}
    >
      <div
        ref={mediaRef}
        className={cn(
          "relative overflow-hidden rounded-xl transition-[border-radius,box-shadow,width] duration-[1200ms] ease-[cubic-bezier(0.18,0.9,0.2,1)]",
          isExpanded
            ? "order-2 mx-auto aspect-[16/10] w-full max-w-[64%] rounded-[24px] bg-transparent"
            : "order-1 aspect-[1/1.4142] md:row-span-2 bg-muted/20"
        )}
      >
        <Image
          src={isExpanded ? (figures[activeFigure]?.src ?? publication.image) : publication.image}
          alt={isExpanded ? (figures[activeFigure]?.alt ?? publication.title) : publication.title}
          fill
          className={cn(
            "opacity-80 transition-all duration-[1200ms] ease-[cubic-bezier(0.18,0.9,0.2,1)] group-hover:opacity-100",
            isExpanded ? "object-contain" : "object-contain"
          )}
        />
      </div>

      <div className={cn("space-y-2", isExpanded ? "order-1 text-center" : "order-2")}>
        <PublicationHeader publication={publication} expanded={isExpanded} />
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-[1200ms] ease-[cubic-bezier(0.18,0.9,0.2,1)]",
          isExpanded ? "order-3 max-h-[820px] opacity-100" : "order-3 mt-1 max-h-56 opacity-100"
        )}
      >
        {isExpanded ? (
          <div className="space-y-3 text-center">
            <PublicationFigureGallery
              figures={figures}
              activeIndex={activeFigure}
              onSelect={onSelectFigure}
            />
            <p className="mx-auto max-w-[48ch] leading-relaxed text-muted-foreground md:text-lg/7">
              {publication.abstract}
            </p>
            <PublicationTagList tags={publication.tags} />
          </div>
        ) : (
          <div className="flex min-h-full flex-col">
            <p className="text-base leading-relaxed text-muted-foreground">{publication.abstract}</p>
            <PublicationTagList tags={publication.tags} centered={false} className="mt-auto pt-6" />
          </div>
        )}
      </div>
    </div>
  );
}

function PublicationHeader({
  publication,
  expanded = false,
}: {
  publication: Publication;
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
          {publication.title}
        </h3>
        <p
          className={cn(
            "mt-1 text-sm leading-relaxed text-muted-foreground",
            expanded ? "text-center md:text-base" : "md:text-base"
          )}
        >
          {publication.venue}
        </p>
      </div>
      <div
        className={cn(
          "flex items-center gap-2",
          expanded ? "absolute right-0 top-0 justify-end" : ""
        )}
      >
        <span className="inline-flex items-center gap-1 text-xs text-primary/80">
          <FileText className="size-3" />
          {publication.type}
        </span>
        <Link
          href={publication.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`Open ${publication.title}`}
        >
          <ExternalLink className="size-5" />
        </Link>
      </div>
    </div>
  );
}

function PublicationTagList({
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

function PublicationFigureGallery({
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
                "relative h-16 w-20 shrink-0 rounded-2xl border border-border/40 bg-transparent p-1.5 transition-all duration-500 ease-[cubic-bezier(0.18,0.9,0.2,1)]",
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
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image
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

function useFlipAnimation<T extends HTMLElement>(trigger: boolean) {
  const ref = useRef<T>(null);
  const previousRectRef = useRef<DOMRect | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

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
