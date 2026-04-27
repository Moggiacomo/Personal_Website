"use client";

import { getPdfViewerSrc, isPdfPath } from "@/lib/media";
import { cn } from "@/lib/utils";

export function MediaAsset({
  src,
  alt,
  className,
  fill = false,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
}) {
  const trimmedSrc = src?.trim();

  if (!trimmedSrc) {
    return null;
  }

  const sharedClassName = cn(
    fill && "absolute inset-0 h-full w-full",
    className
  );

  if (isPdfPath(trimmedSrc)) {
    return (
      <div className={cn(sharedClassName, "pointer-events-none")}>
        <object
          data={getPdfViewerSrc(trimmedSrc)}
          type="application/pdf"
          aria-label={alt}
          className="h-full w-full border-0 bg-transparent"
        >
          <iframe
            src={getPdfViewerSrc(trimmedSrc)}
            title={alt}
            className="h-full w-full border-0 bg-transparent"
          />
        </object>
      </div>
    );
  }

  return <img src={trimmedSrc} alt={alt} className={sharedClassName} loading="lazy" />;
}
