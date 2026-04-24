"use client";

import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import type { RepoItem } from "@/lib/content-types";

export function RepoGrid({ items }: { items: RepoItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((item) => {
        const hasImage = Boolean(item.image?.trim());
        const hasDownload = Boolean(item.downloadPath?.trim());

        return (
          <article
            key={item.id}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-border/50 bg-secondary/40 p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:bg-secondary/60 hover:shadow-[0_22px_55px_-26px_rgba(0,0,0,0.6)]"
          >
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-background/35">
              {hasImage ? (
                <Image
                  src={item.image}
                  alt={item.alt || item.title || "Repo item preview"}
                  fill
                  className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm leading-relaxed text-muted-foreground">
                  Preview image not set yet
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="absolute inset-x-0 bottom-0 flex translate-y-4 flex-col gap-3 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-foreground">
                    {item.title || "Untitled repo item"}
                  </h3>
                </div>
                {hasDownload ? (
                  <Link
                    href={item.downloadPath}
                    download
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-transform duration-200 hover:scale-[1.02]"
                  >
                    <Download className="size-4" />
                    {item.downloadLabel || "Download"}
                  </Link>
                ) : (
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
                    <Download className="size-4" />
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
