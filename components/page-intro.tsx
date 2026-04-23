"use client";

import type { ParagraphLevel, RichParagraph } from "@/lib/content-types";
import { cn } from "@/lib/utils";

function getParagraphClass(level: ParagraphLevel = "body") {
  if (level === "lead") {
    return "text-lg leading-relaxed text-foreground";
  }

  if (level === "highlight") {
    return "text-base font-semibold leading-relaxed text-foreground";
  }

  return "leading-relaxed text-muted-foreground";
}

export function PageIntro({
  paragraphs,
  className,
}: {
  paragraphs: RichParagraph[];
  className?: string;
}) {
  if (!paragraphs.length) return null;

  return (
    <div className={cn("space-y-6 text-muted-foreground", className)}>
      {paragraphs.map((paragraph, index) => (
        <p key={`paragraph-${index}`} className={getParagraphClass(paragraph.level)}>
          {paragraph.text}
        </p>
      ))}
    </div>
  );
}

