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

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const footer = footerRef.current;
    const footerInner = footerInnerRef.current;
    if (!frame || !footer || !footerInner) {
      return;
    }

    const updateReserve = () => {
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
      className="repo-card-shell group relative aspect-square overflow-hidden rounded-2xl border border-border/50 bg-secondary/40 p-3 transition-all duration-300 ease-out sm:p-4 md:hover:-translate-y-1 md:hover:border-primary/40 md:hover:bg-secondary/60 md:hover:shadow-[0_22px_55px_-26px_rgba(0,0,0,0.6)]"
    >
      <div
        ref={frameRef}
        className="repo-card-frame relative isolate h-full w-full overflow-hidden rounded-xl bg-background/35"
        style={{
          ["--repo-footer-reserve" as string]: `${footerReserve}px`,
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
            className="repo-card-footer-inner grid w-full grid-cols-[minmax(0,1fr)_auto] items-end gap-3 md:flex md:flex-col md:items-start md:justify-end md:gap-2"
          >
            <div className="min-w-0 flex-1 md:flex-none">
              <h3 className="repo-card-title truncate font-semibold leading-tight tracking-tight text-foreground md:whitespace-normal">
                {item.title || "Untitled repo item"}
              </h3>
            </div>
            {hasDownload ? (
              <Link
                href={item.downloadPath}
                download
                className="repo-card-button inline-flex shrink-0 items-center gap-1.5 justify-self-end rounded-full bg-primary font-medium text-primary-foreground shadow-sm transition-transform duration-200 hover:scale-[1.02] md:w-fit md:justify-self-auto"
              >
                <Download className="size-3.5 sm:size-4" />
                {item.downloadLabel || "Download"}
              </Link>
            ) : (
              <span className="repo-card-button inline-flex shrink-0 items-center gap-1.5 justify-self-end rounded-full bg-muted font-medium text-muted-foreground md:w-fit md:justify-self-auto">
                <Download className="size-3.5 sm:size-4" />
                No file yet
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
