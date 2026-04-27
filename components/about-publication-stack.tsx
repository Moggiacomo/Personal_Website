"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";
import StackingCards, {
  StackingCardItem,
} from "@/components/fancy/blocks/stacking-cards";
import { MediaAsset } from "@/components/media-asset";
import type { Publication } from "@/lib/publications";
import { cn } from "@/lib/utils";

const CHALK_PALETTE = ["#9877a2", "#8499c1", "#d990a3", "#96c8c5", "#f2dede"];

function pickBalancedPaletteColors(total: number) {
  const counts = new Map<string, number>(
    CHALK_PALETTE.map((color) => [color, 0])
  );
  const selected: string[] = [];

  for (let index = 0; index < total; index += 1) {
    const previousColor = selected[index - 1];
    const minimumCount = Math.min(...Array.from(counts.values()));
    const eligibleColors = CHALK_PALETTE.filter(
      (color) => counts.get(color) === minimumCount && color !== previousColor
    );
    const fallbackColors = CHALK_PALETTE.filter((color) => color !== previousColor);
    const pool =
      eligibleColors.length > 0
        ? eligibleColors
        : fallbackColors.length > 0
          ? fallbackColors
          : CHALK_PALETTE;
    const chosenColor =
      pool[Math.floor(Math.random() * pool.length)] ?? CHALK_PALETTE[0];

    selected.push(chosenColor);
    counts.set(chosenColor, (counts.get(chosenColor) ?? 0) + 1);
  }

  return selected;
}

export function AboutPublicationStack({
  items,
}: {
  items: Array<{
    publication: Publication;
    href: string;
  }>;
}) {
  const [cardColors, setCardColors] = useState<string[]>([]);
  const itemSignature = items.map((item) => item.publication.slug).join("|");

  useEffect(() => {
    setCardColors(pickBalancedPaletteColors(items.length));
  }, [itemSignature]);

  return (
    <StackingCards
      totalCards={items.length}
      scaleMultiplier={0.035}
      className="space-y-0"
    >
      {items.map(({ publication, href }, index) => (
        <StackingCardItem
          key={publication.slug}
          index={index + 1}
          topPosition={`${5 + index * 1.7}%`}
          className="h-[72rem]"
        >
          <Link
            href={href}
            className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {(() => {
              const mediaFirst = index % 2 === 0;

              return (
            <article
              className={cn(
                "overflow-hidden rounded-[2rem] border border-border/40 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out group-hover:-translate-y-1",
                "grid h-[42rem] gap-6 p-6 md:grid-cols-[minmax(0,0.92fr)_minmax(20rem,1.08fr)] md:p-8"
              )}
              style={{
                backgroundColor: cardColors[index] ?? "rgba(255,255,255,0.92)",
              }}
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-[1.5rem]",
                  mediaFirst ? "md:order-1" : "md:order-2"
                )}
              >
                <div className="relative h-full min-h-[22rem] w-full">
                  <div className="absolute inset-0 flex items-center justify-center p-4 md:p-3">
                    <div className="relative aspect-[1/1.4142] w-[min(100%,24rem)]">
                      <MediaAsset
                        src={publication.image}
                        alt={publication.title}
                        fill
                        className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "flex min-h-full flex-col justify-between",
                  mediaFirst ? "md:order-2" : "md:order-1"
                )}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-black/65">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-background/30 px-3 py-1">
                      <FileText className="size-3" />
                      {publication.type}
                    </span>
                    <span>{publication.year}</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-2xl font-semibold tracking-tight text-black md:text-3xl">
                      {publication.title}
                    </h4>
                    <p className="text-sm font-medium tracking-wide text-black/75 md:text-base">
                      {publication.venue}
                    </p>
                    {publication.subtitle ? (
                      <p className="text-sm leading-relaxed text-black/70 md:text-base">
                        {publication.subtitle}
                      </p>
                    ) : null}
                  </div>

                  <p className="text-sm leading-relaxed text-black/75 md:text-base">
                    {publication.abstract}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3 text-sm font-medium text-black">
                  <span>Open in Publications</span>
                  <ExternalLink className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </div>
            </article>
              )
            })()}
          </Link>
        </StackingCardItem>
      ))}
    </StackingCards>
  );
}
