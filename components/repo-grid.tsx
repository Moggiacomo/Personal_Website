"use client";

import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import type { RepoItem } from "@/lib/content-types";

export function RepoGrid({ items }: { items: RepoItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((item) => {
        const hasImage = Boolean(item.image?.trim());
        const hasDownload = Boolean(item.downloadPath?.trim());

        return (
          <article
            key={item.id}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-border/50 bg-secondary/40 p-3 transition-all duration-300 ease-out sm:p-4 md:hover:-translate-y-1 md:hover:border-primary/40 md:hover:bg-secondary/60 md:hover:bg-secondary/60 md:hover:shadow-[0_22px_55px_-26px_rgba(0,0,0,0.6)]"
          >
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-background/35">
              {hasImage ? (
                <Image
                  src={item.image}
                  alt={item.alt || item.title || "Repo item preview"}
                  fill
                  className="object-contain p-3 transition-transform duration-500 ease-out sm:p-4 md:group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs leading-relaxed text-muted-foreground sm:px-6 sm:text-sm">
                  Preview image not set yet
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/35 to-transparent opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100" />

              <div className="absolute inset-x-0 bottom-0 flex translate-y-0 flex-col gap-2 px-3 pb-4 pt-8 opacity-100 transition-all duration-300 sm:gap-3 sm:px-4 sm:pb-5 sm:pt-10 md:translate-y-4 md:px-4 md:pb-4 md:pt-8 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                <div>
                  <h3 className="text-[0.7rem] font-semibold leading-tight tracking-tight text-foreground sm:text-sm">
                    {item.title || "Untitled repo item"}
                  </h3>
                </div>
                {hasDownload ? (
                  <Link
                    href={item.downloadPath}
                    download
                    className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-2.5 py-1.5 text-[0.7rem] font-medium text-primary-foreground shadow-sm transition-transform duration-200 hover:scale-[1.02] sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
                  >
                    <Download className="size-3.5 sm:size-4" />
                    {item.downloadLabel || "Download"}
                  </Link>
                ) : (
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-muted px-2.5 py-1.5 text-[0.7rem] font-medium text-muted-foreground sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
                    <Download className="size-3.5 sm:size-4" />
                    No file yet
                  </span>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
