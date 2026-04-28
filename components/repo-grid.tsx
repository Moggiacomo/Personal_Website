"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { MediaAsset } from "@/components/media-asset";
import type { RepoItem } from "@/lib/content-types";

export function RepoGrid({ items }: { items: RepoItem[] }) {
  const visibleItems = items.filter(
    (item) =>
      Boolean(item.title?.trim()) ||
      Boolean(item.image?.trim()) ||
      Boolean(item.downloadPath?.trim())
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 2xl:grid-cols-4">
      {visibleItems.map((item) => (
        <RepoCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function RepoCard({ item }: { item: RepoItem }) {
  const hasImage = Boolean(item.image?.trim());
  const hasDownload = Boolean(item.downloadPath?.trim());
  const frameRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const footerInnerRef = useRef<HTMLDivElement>(null);
  const [footerReserve, setFooterReserve] = useState<number>(96);
  const [footerScale, setFooterScale] = useState<number>(1);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const footer = footerRef.current;
    const footerInner = footerInnerRef.current;
    if (!frame || !footer || !footerInner) {
      return;
    }

    const updateReserve = () => {
      const frameWidth = frame.clientWidth;
      const nextScale = Math.max(0.7, Math.min(1, frameWidth / 320));
      setFooterScale((current) =>
        Math.abs(current - nextScale) > 0.01 ? nextScale : current
      );

      const footerStyles = window.getComputedStyle(footer);
      const paddingBottom = Number.parseFloat(footerStyles.paddingBottom) || 0;
      const footerInnerStyles = window.getComputedStyle(footerInner);
      const rowGap =
        Number.parseFloat(footerInnerStyles.rowGap || footerInnerStyles.gap) || 0;
      const nextReserve = Math.ceil(footerInner.offsetHeight + paddingBottom + rowGap + 8);
      setFooterReserve((current) =>
        Math.abs(current - nextReserve) > 1 ? nextReserve : current
      );
    };

    updateReserve();

    const resizeObserver = new ResizeObserver(() => {
      updateReserve();
    });

    resizeObserver.observe(frame);
    resizeObserver.observe(footer);
    resizeObserver.observe(footerInner);
    window.addEventListener("resize", updateReserve);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateReserve);
    };
  }, [hasDownload, item.downloadLabel, item.title]);

  return (
    <article
      className="repo-card-shell group relative aspect-square overflow-hidden rounded-2xl border border-border/50 bg-secondary/40 transition-all duration-300 ease-out md:hover:-translate-y-1 md:hover:border-primary/40 md:hover:bg-secondary/60 md:hover:shadow-[0_22px_55px_-26px_rgba(0,0,0,0.6)]"
      style={{
        padding: `${0.28 + 0.52 * footerScale}rem`,
      }}
    >
      <div
        ref={frameRef}
        className="repo-card-frame relative isolate h-full w-full overflow-hidden rounded-xl bg-background/35"
        style={{
          ["--repo-footer-reserve" as string]: `${footerReserve}px`,
          ["--repo-footer-scale" as string]: footerScale.toString(),
          ["--repo-footer-pad" as string]: `${0.32 + 0.52 * footerScale}rem`,
          ["--repo-footer-gap" as string]: `${0.14 + 0.3 * footerScale}rem`,
          ["--repo-media-pad" as string]: `${0.32 + 0.52 * footerScale}rem`,
        }}
      >
        {hasImage ? (
          <div className="repo-card-preview absolute inset-0 overflow-hidden rounded-[inherit]">
            <MediaAsset
              src={item.image}
              alt={item.alt || item.title || "Repo item preview"}
              fill
              className="repo-card-media object-contain object-center transition-transform duration-500 ease-out md:group-hover:scale-[1.04]"
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs leading-relaxed text-muted-foreground sm:px-6 sm:text-sm">
            Preview image not set yet
          </div>
        )}

        <div
          ref={footerRef}
          className="repo-card-footer absolute inset-0 z-10 flex items-end opacity-100 transition-all duration-300 md:translate-y-4 md:flex-col md:items-start md:justify-end md:pt-8 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          <div
            ref={footerInnerRef}
            className="repo-card-footer-inner flex w-full flex-wrap items-end justify-between md:flex md:flex-col md:items-start md:justify-end md:gap-2"
            style={{
              gap: `var(--repo-footer-gap)`,
            }}
          >
            <div className="min-w-0 flex-1 md:flex-none">
              <h3
                className="repo-card-title line-clamp-2 whitespace-normal font-semibold leading-tight tracking-tight text-foreground md:whitespace-normal"
                style={{
                  fontSize: `${0.42 + 0.48 * footerScale}rem`,
                }}
              >
                {item.title || "Untitled repo item"}
              </h3>
            </div>
            {hasDownload ? (
              <Link
                href={item.downloadPath}
                download
                className="repo-card-button inline-flex w-fit shrink-0 items-center rounded-full bg-primary font-medium text-primary-foreground shadow-sm transition-transform duration-200 hover:scale-[1.02] md:w-fit"
                aria-label={item.downloadLabel || "Download"}
                style={{
                  gap: `${0.08 + 0.2 * footerScale}rem`,
                  paddingInline: `${0.2 + 0.5 * footerScale}rem`,
                  paddingBlock: `${0.14 + 0.24 * footerScale}rem`,
                  fontSize: `${0.36 + 0.36 * footerScale}rem`,
                }}
              >
                <Download
                  className="shrink-0"
                  style={{
                    width: `${0.46 + 0.34 * footerScale}rem`,
                    height: `${0.46 + 0.34 * footerScale}rem`,
                  }}
                />
                {item.downloadLabel || "Download"}
              </Link>
            ) : (
              <span
                className="repo-card-button inline-flex w-fit shrink-0 items-center rounded-full bg-muted font-medium text-muted-foreground md:w-fit"
                style={{
                  gap: `${0.08 + 0.2 * footerScale}rem`,
                  paddingInline: `${0.2 + 0.5 * footerScale}rem`,
                  paddingBlock: `${0.14 + 0.24 * footerScale}rem`,
                  fontSize: `${0.36 + 0.36 * footerScale}rem`,
                }}
              >
                <Download
                  className="shrink-0"
                  style={{
                    width: `${0.46 + 0.34 * footerScale}rem`,
                    height: `${0.46 + 0.34 * footerScale}rem`,
                  }}
                />
                No file yet
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
