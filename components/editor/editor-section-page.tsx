"use client";

import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import initialSiteContent from "@/content/site-content.json";
import { MediaAsset } from "@/components/media-asset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  ExperienceType,
  ParagraphLevel,
  RepoItem,
  RichParagraph,
  SiteContent,
  TimelineItem,
} from "@/lib/content-types";
import { FIGURE_FILE_ACCEPT } from "@/lib/media";
import type { Project } from "@/lib/projects";
import type { Publication } from "@/lib/publications";
import { cn } from "@/lib/utils";

type AuthState = "loading" | "authenticated" | "unauthenticated";
type SaveState = "idle" | "saving" | "saved" | "error";
type SectionKey = keyof SiteContent;
type EditorView = "home" | SectionKey | "contact";

const baseContent = initialSiteContent as SiteContent;

const editorSections: Array<{
  id: Exclude<EditorView, "home">;
  label: string;
  href: string;
  description: string;
}> = [
  {
    id: "site",
    label: "Site",
    href: "/editor/site",
    description: "Top bar, footer, navigation labels, and page headers.",
  },
  {
    id: "about",
    label: "About",
    href: "/editor/about",
    description: "Paragraphs and skill chips for the homepage introduction.",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    href: "/editor/portfolio",
    description: "Project cards, figures, tags, links, and base images.",
  },
  {
    id: "repo",
    label: "Repo",
    href: "/editor/repo",
    description: "Downloadable image cards shown in the public repo gallery.",
  },
  {
    id: "publications",
    label: "Publications",
    href: "/editor/publications",
    description: "Publication cards, figures, tags, abstracts, and links.",
  },
  {
    id: "cv",
    label: "CV",
    href: "/editor/cv",
    description: "Timeline entries, dates, descriptions, details, and skills.",
  },
  {
    id: "contact",
    label: "Contact",
    href: "/editor/contact",
    description: "Contact section text, labels, links, and call-to-action buttons.",
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createEmptyProject(): Project {
  return {
    slug: `project-${crypto.randomUUID().slice(0, 8)}`,
    title: "",
    subtitle: "",
    description: "",
    image: "",
    figures: [{ src: "", alt: "" }],
    url: "",
    github: "",
    tags: [],
  };
}

function createEmptyPublication(): Publication {
  return {
    slug: `publication-${crypto.randomUUID().slice(0, 8)}`,
    title: "",
    subtitle: "",
    featuredInAbout: false,
    venue: "",
    type: "",
    year: "",
    url: "",
    abstract: "",
    image: "",
    figures: [{ src: "", alt: "" }],
    tags: [],
  };
}

function createEmptyRepoItem(): RepoItem {
  const id = crypto.randomUUID();
  return {
    id,
    title: "",
    image: "",
    downloadPath: "",
    downloadLabel: "Download",
    alt: "",
  };
}

function createEmptyTimelineItem(): TimelineItem {
  return {
    id: crypto.randomUUID(),
    type: "work",
    cardPosition: 0,
    period: "",
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear(),
    title: "",
    organization: "",
    url: "",
    description: "",
    details: [],
    skills: [],
  };
}

function cloneContent(content: SiteContent): SiteContent {
  return structuredClone(content);
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex) return items;
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

function reindexTimelineCardPositions(items: TimelineItem[]) {
  return items.map((item, index) => ({
    ...item,
    cardPosition: index + 1,
  }));
}

function parseOptionalNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function createEmptyParagraph(level: ParagraphLevel = "body"): RichParagraph {
  return {
    text: "",
    level,
  };
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-foreground/80">{label}</span>
      {children}
    </label>
  );
}

function SectionCard({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-background/70 p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          {description ? (
            <p className="max-w-3xl text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

function StringListEditor({
  label,
  values,
  onChange,
  addLabel = "Add item",
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  addLabel?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground/80">{label}</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onChange([...values, ""])}
        >
          {addLabel}
        </Button>
      </div>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={`${label}-${index}`} className="flex gap-2">
            <Input
              value={value}
              onChange={(event) => {
                const next = [...values];
                next[index] = event.target.value;
                onChange(next);
              }}
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onChange(values.filter((_, item) => item !== index))}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ParagraphListEditor({
  label,
  values,
  onChange,
  addLabel = "Add paragraph",
}: {
  label: string;
  values: RichParagraph[];
  onChange: (next: RichParagraph[]) => void;
  addLabel?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground/80">{label}</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onChange([...values, createEmptyParagraph()])}
        >
          {addLabel}
        </Button>
      </div>
      <div className="space-y-3">
        {values.map((value, index) => (
          <div
            key={`${label}-${index}`}
            className="space-y-3 rounded-xl border border-border/50 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Paragraph {index + 1}
              </p>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => onChange(values.filter((_, item) => item !== index))}
              >
                Remove
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_12rem]">
              <Field label="Text">
                <Textarea
                  value={value.text}
                  rows={4}
                  onChange={(event) => {
                    const next = [...values];
                    next[index] = { ...value, text: event.target.value };
                    onChange(next);
                  }}
                />
              </Field>
              <Field label="Style level">
                <select
                  value={value.level ?? "body"}
                  onChange={(event) => {
                    const next = [...values];
                    next[index] = {
                      ...value,
                      level: event.target.value as ParagraphLevel,
                    };
                    onChange(next);
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="body">Body</option>
                  <option value="lead">Lead</option>
                  <option value="highlight">Highlight</option>
                </select>
              </Field>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CollapsibleEditorCard({
  title,
  cardKey,
  collapsed,
  preview,
  orderLabel,
  onToggle,
  onRemove,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  children,
}: {
  title: string;
  cardKey: string;
  collapsed: boolean;
  preview?: ReactNode;
  orderLabel: string;
  onToggle: () => void;
  onRemove: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/50 p-5 transition-colors">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {preview}
          <div className="space-y-0.5">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {orderLabel}
            </p>
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onMoveUp}
            disabled={!canMoveUp}
          >
            Move up
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onMoveDown}
            disabled={!canMoveDown}
          >
            Move down
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onToggle}>
            {collapsed ? (
              <>
                <ChevronDown className="mr-1 size-4" />
                Expand
              </>
            ) : (
              <>
                <ChevronUp className="mr-1 size-4" />
                Collapse
              </>
            )}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            Remove
          </Button>
        </div>
      </div>

      {!collapsed ? <div className="mt-5 space-y-5">{children}</div> : null}
    </div>
  );
}

function BaseFigurePreview({
  src,
  alt,
  aspect = "square",
}: {
  src?: string;
  alt: string;
  aspect?: "square" | "a-portrait";
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-lg border border-border/50 bg-secondary/30",
        aspect === "square" ? "h-16 w-16" : "h-20 w-14"
      )}
    >
      {src ? (
        <MediaAsset src={src} alt={alt} fill className="object-contain p-1.5" />
      ) : (
        <div className="flex h-full items-center justify-center px-2 text-center text-[10px] text-muted-foreground">
          No image
        </div>
      )}
    </div>
  );
}

function FigureRowEditor({
  figure,
  index,
  folder,
  baseImage,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onUpdate,
  onRemove,
  onSelectBase,
}: {
  figure: { src: string; alt: string };
  index: number;
  folder: string;
  baseImage: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUpdate: (
    next:
      | { src: string; alt: string }
      | ((current: { src: string; alt: string }) => { src: string; alt: string })
  ) => void;
  onRemove: () => void;
  onSelectBase: (src: string) => void;
}) {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadResult, setUploadResult] = useState("");

  async function handleUpload() {
    if (!uploadFile) return;

    setUploading(true);
    setUploadError("");
    setUploadResult("");

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { path?: string; error?: string };
      if (!response.ok || !data.path) {
        throw new Error(data.error || "Upload failed");
      }

      const uploadedPath = data.path;
      onUpdate((current) => ({ ...current, src: uploadedPath }));
      setUploadResult(uploadedPath);
      setUploadFile(null);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Could not upload image."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-border/50 p-4 transition-colors">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Figure {index + 1}
      </div>
      <div className="flex justify-start">
        <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-secondary/30">
          {figure.src ? (
            <MediaAsset
              src={figure.src}
              alt={figure.alt || `Figure ${index + 1} preview`}
              fill
              className="object-contain p-2"
            />
          ) : (
            <span className="px-3 text-center text-xs leading-relaxed text-muted-foreground">
              No image selected
            </span>
          )}
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto_auto]">
        <PathUploadField
          label="Image path"
          value={figure.src}
          folder={folder}
          accept={FIGURE_FILE_ACCEPT}
          placeholder={`/uploads/${folder}/figure.pdf`}
          uploadLabel="Select figure file"
          onChange={(path) => onUpdate((current) => ({ ...current, src: path }))}
        />
        <Field label="Alt text">
          <Input
            value={figure.alt}
            onChange={(event) => onUpdate({ ...figure, alt: event.target.value })}
          />
        </Field>
        <div className="flex items-end">
          <Button
            type="button"
            size="sm"
            variant={figure.src === baseImage ? "default" : "outline"}
            onClick={() => onSelectBase(figure.src)}
            disabled={!figure.src}
          >
            {figure.src === baseImage ? "Base figure" : "Set as base"}
          </Button>
        </div>
        <div className="flex items-end">
          <Button type="button" size="sm" variant="ghost" onClick={onRemove}>
            Remove
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!canMoveUp}
          onClick={onMoveUp}
        >
          Move up
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!canMoveDown}
          onClick={onMoveDown}
        >
          Move down
        </Button>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <Field label="Upload figure file">
          <Input
            key={uploadResult || `${folder}-${index}`}
            type="file"
            accept={FIGURE_FILE_ACCEPT}
            onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
          />
        </Field>
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleUpload}
            disabled={!uploadFile || uploading}
          >
            {uploading ? "Uploading..." : "Upload figure file"}
          </Button>
        </div>
      </div>

      {uploadResult ? (
        <p className="text-sm text-muted-foreground">
          Uploaded path: <code>{uploadResult}</code>
        </p>
      ) : null}
      {uploadError ? <p className="text-sm text-red-500">{uploadError}</p> : null}
    </div>
  );
}

function FigureListEditor({
  figures,
  baseImage,
  folder,
  onChange,
  onSelectBase,
}: {
  figures: Array<{ src: string; alt: string }>;
  baseImage: string;
  folder: string;
  onChange: (
    next:
      | Array<{ src: string; alt: string }>
      | ((current: Array<{ src: string; alt: string }>) => Array<{ src: string; alt: string }>)
  ) => void;
  onSelectBase: (src: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground/80">Figures</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onChange([...figures, { src: "", alt: "" }])}
        >
          Add figure
        </Button>
      </div>
      <div className="space-y-3">
        {figures.map((figure, index) => (
          <FigureRowEditor
            key={`figure-${index}`}
            figure={figure}
            index={index}
            folder={folder}
            baseImage={baseImage}
            canMoveUp={index > 0}
            canMoveDown={index < figures.length - 1}
            onMoveUp={() => onChange((current) => moveItem(current, index, index - 1))}
            onMoveDown={() => onChange((current) => moveItem(current, index, index + 1))}
            onUpdate={(nextFigure) => {
              onChange((current) => {
                const next = [...current];
                next[index] =
                  typeof nextFigure === "function" ? nextFigure(current[index]) : nextFigure;
                return next;
              });
            }}
            onRemove={() => onChange((current) => current.filter((_, item) => item !== index))}
            onSelectBase={onSelectBase}
          />
        ))}
      </div>
    </div>
  );
}

function FileUploadField({
  label,
  accept,
  folder,
  onUploaded,
}: {
  label: string;
  accept?: string;
  folder: string;
  onUploaded: (path: string) => void;
}) {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadResult, setUploadResult] = useState("");

  async function handleUpload() {
    if (!uploadFile) return;

    setUploading(true);
    setUploadError("");
    setUploadResult("");

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { path?: string; error?: string };
      if (!response.ok || !data.path) {
        throw new Error(data.error || "Upload failed");
      }

      onUploaded(data.path);
      setUploadResult(data.path);
      setUploadFile(null);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Could not upload file."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-border/50 p-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <Field label={label}>
          <Input
            key={uploadResult || folder}
            type="file"
            accept={accept}
            onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
          />
        </Field>
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleUpload}
            disabled={!uploadFile || uploading}
          >
            {uploading ? "Uploading..." : "Upload file"}
          </Button>
        </div>
      </div>
      {uploadResult ? (
        <p className="text-sm text-muted-foreground">
          Uploaded path: <code>{uploadResult}</code>
        </p>
      ) : null}
      {uploadError ? <p className="text-sm text-red-500">{uploadError}</p> : null}
    </div>
  );
}

function PathUploadField({
  label,
  value,
  onChange,
  onUploaded,
  folder,
  accept,
  placeholder,
  uploadLabel = "Select file",
}: {
  label: string;
  value: string;
  onChange: (path: string) => void;
  onUploaded?: (path: string) => void;
  folder: string;
  accept?: string;
  placeholder?: string;
  uploadLabel?: string;
}) {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadResult, setUploadResult] = useState("");

  async function handleUpload(file: File | null) {
    if (!file) return;

    setUploadFile(file);
    setUploading(true);
    setUploadError("");
    setUploadResult("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { path?: string; error?: string };
      if (!response.ok || !data.path) {
        throw new Error(data.error || "Upload failed");
      }

      (onUploaded ?? onChange)(data.path);
      setUploadResult(data.path);
      setUploadFile(null);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Could not upload file."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Field label={label}>
        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <Input
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
          />
          <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:bg-secondary/50">
            <input
              key={uploadResult || uploadFile?.name || folder}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(event) => void handleUpload(event.target.files?.[0] ?? null)}
            />
            {uploading ? "Uploading..." : uploadLabel}
          </label>
        </div>
      </Field>
      {uploadResult ? (
        <p className="text-sm text-muted-foreground">
          Uploaded path: <code>{uploadResult}</code>
        </p>
      ) : null}
      {uploadError ? <p className="text-sm text-red-500">{uploadError}</p> : null}
    </div>
  );
}

function RepoEditorCard({
  item,
  index,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging,
  isDropTarget,
}: {
  item: RepoItem;
  index: number;
  onChange: (next: RepoItem | ((current: RepoItem) => RepoItem)) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOver: () => void;
  onDrop: () => void;
  isDragging: boolean;
  isDropTarget: boolean;
}) {
  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        onDragOver();
      }}
      onDrop={onDrop}
      className={cn(
        "rounded-2xl border border-border/50 bg-background/70 p-4 shadow-sm transition-all",
        isDragging && "opacity-60",
        isDropTarget && "border-primary/60 bg-primary/5"
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Repo Item {index + 1}
          </p>
          <p className="text-sm font-medium text-foreground">
            {item.title || "Untitled item"}
          </p>
        </div>
        <button
          type="button"
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          className="rounded-md border border-border/50 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          Drag
        </button>
      </div>

      <div className="relative mb-4 aspect-square overflow-hidden rounded-xl border border-border/50 bg-secondary/30">
        {item.image ? (
          <MediaAsset
            src={item.image}
            alt={item.alt || item.title || `Repo item ${index + 1}`}
            fill
            className="object-contain p-4"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
            Upload a figure file to preview this repo card
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Field label="Title">
          <Input
            value={item.title}
            onChange={(event) => onChange({ ...item, title: event.target.value })}
          />
        </Field>

        <PathUploadField
          label="Image path"
          value={item.image}
          folder={`repo/${slugify(item.title) || item.id}`}
          accept={FIGURE_FILE_ACCEPT}
          uploadLabel="Select figure file"
          onChange={(path) => onChange((current) => ({ ...current, image: path }))}
        />

        <PathUploadField
          label="Download file path"
          value={item.downloadPath}
          folder={`repo/${slugify(item.title) || item.id}`}
          accept={FIGURE_FILE_ACCEPT}
          uploadLabel="Select file"
          onChange={(path) =>
            onChange((current) => ({ ...current, downloadPath: path }))
          }
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Download button label">
            <Input
              value={item.downloadLabel ?? ""}
              onChange={(event) =>
                onChange({ ...item, downloadLabel: event.target.value })
              }
            />
          </Field>
          <Field label="Alt text">
            <Input
              value={item.alt ?? ""}
              onChange={(event) => onChange({ ...item, alt: event.target.value })}
            />
          </Field>
        </div>

        <FileUploadField
          label="Upload preview/download file"
          accept={FIGURE_FILE_ACCEPT}
          folder={`repo/${slugify(item.title) || item.id}`}
          onUploaded={(path) =>
            onChange((current) => ({
              ...current,
              image: path,
              downloadPath: path,
            }))
          }
        />

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="ghost" size="sm" disabled={!canMoveUp} onClick={onMoveUp}>
            Move up
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!canMoveDown}
            onClick={onMoveDown}
          >
            Move down
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}

function EditorNav({ currentSection }: { currentSection: EditorView }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/editor"
        className={cn(
          "rounded-md px-3 py-2 text-sm font-medium transition-colors",
          currentSection === "home"
            ? "bg-secondary text-foreground"
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
        )}
      >
        Overview
      </Link>
      {editorSections.map((section) => (
        <Link
          key={section.id}
          href={section.href}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium transition-colors",
            currentSection === section.id
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
          )}
        >
          {section.label}
        </Link>
      ))}
    </div>
  );
}

function EditorShell({
  currentSection,
  usingDefaultPassword,
  statusText,
  onLogout,
  children,
}: {
  currentSection: EditorView;
  usingDefaultPassword: boolean;
  statusText: string;
  onLogout: () => Promise<void>;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
              Content Editor
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Update your website without editing code
            </h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Each editor page maps to a website section. Save changes back into
              <code> content/site-content.json</code>, and upload figures directly
              where they belong.
            </p>
            {usingDefaultPassword ? (
              <p className="text-sm text-amber-600">
                You are using the default editor password. Set{" "}
                <code>EDITOR_PASSWORD</code> to secure this page.
              </p>
            ) : null}
            {statusText ? (
              <p className="text-sm text-muted-foreground">{statusText}</p>
            ) : null}
          </div>
          <Button type="button" variant="outline" onClick={onLogout}>
            Log out
          </Button>
        </div>
        <EditorNav currentSection={currentSection} />
      </div>
      {children}
    </main>
  );
}

function HomeEditorIntro() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {editorSections.map((section) => (
        <Link
          key={section.id}
          href={section.href}
          className="rounded-2xl border border-border/60 bg-background/70 p-6 shadow-sm transition-colors hover:border-primary/40 hover:bg-background"
        >
          <h2 className="text-lg font-semibold tracking-tight">{section.label}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {section.description}
          </p>
        </Link>
      ))}
    </div>
  );
}

export function EditorSectionPage({ section }: { section: EditorView }) {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [usingDefaultPassword, setUsingDefaultPassword] = useState(false);
  const [draft, setDraft] = useState<SiteContent>(() => cloneContent(baseContent));
  const draftRef = useRef(draft);
  const [saveState, setSaveState] = useState<Record<SectionKey, SaveState>>({
    site: "idle",
    about: "idle",
    portfolio: "idle",
    repo: "idle",
    publications: "idle",
    cv: "idle",
  });
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({});
  const [draggingRepoIndex, setDraggingRepoIndex] = useState<number | null>(null);
  const [dropRepoIndex, setDropRepoIndex] = useState<number | null>(null);

  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const response = await fetch("/api/editor-login", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to check editor session");
        }
        const data = (await response.json()) as {
          authenticated: boolean;
          usingDefaultPassword: boolean;
        };
        if (!active) return;
        setUsingDefaultPassword(data.usingDefaultPassword);
        setAuthState(data.authenticated ? "authenticated" : "unauthenticated");
      } catch {
        if (active) {
          setAuthState("unauthenticated");
        }
      }
    };

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (authState !== "authenticated") return;

    let active = true;

    const loadContent = async () => {
      try {
        const response = await fetch("/api/content", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load content");
        }
        const content = (await response.json()) as SiteContent;
        if (active) {
          draftRef.current = content;
          setDraft(content);
        }
      } catch {
        if (active) {
          const fallbackContent = cloneContent(baseContent);
          draftRef.current = fallbackContent;
          setDraft(fallbackContent);
        }
      }
    };

    loadContent();

    return () => {
      active = false;
    };
  }, [authState]);

  const statusText = useMemo(() => {
    if (section === "home") return "";
    const currentState = saveState[section === "contact" ? "site" : section];
    if (currentState === "saving") return `Saving ${section}...`;
    if (currentState === "error") return `Could not save ${section}.`;
    if (currentState === "saved") return "Changes saved.";
    return "";
  }, [saveState, section]);

  function updateSection<K extends SectionKey>(
    key: K,
    value: SiteContent[K] | ((current: SiteContent[K]) => SiteContent[K])
  ) {
    const current = draftRef.current;
    const next = {
      ...current,
      [key]: typeof value === "function" ? value(current[key]) : value,
    };
    draftRef.current = next;
    setDraft(next);
  }

  function updateSectionAndAutoSave<K extends SectionKey>(
    key: K,
    value: SiteContent[K] | ((current: SiteContent[K]) => SiteContent[K])
  ) {
    const current = draftRef.current;
    const next = {
      ...current,
      [key]: typeof value === "function" ? value(current[key]) : value,
    };
    draftRef.current = next;
    setDraft(next);
    queueMicrotask(() => {
      void saveSection(key, next);
    });
  }

  function toggleCard(cardKey: string) {
    setCollapsedCards((current) => ({
      ...current,
      [cardKey]: !current[cardKey],
    }));
  }

  async function saveSection(
    currentSection: SectionKey,
    snapshot: SiteContent = draftRef.current
  ) {
    setSaveState((current) => ({ ...current, [currentSection]: "saving" }));

    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snapshot),
      });

      if (response.status === 401) {
        setAuthState("unauthenticated");
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      setSaveState((current) => ({ ...current, [currentSection]: "saved" }));
      window.setTimeout(() => {
        setSaveState((current) => ({
          ...current,
          [currentSection]:
            current[currentSection] === "saved"
              ? "idle"
              : current[currentSection],
        }));
      }, 1500);
    } catch {
      setSaveState((current) => ({ ...current, [currentSection]: "error" }));
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");

    try {
      const response = await fetch("/api/editor-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await response.json()) as {
        error?: string;
        usingDefaultPassword?: boolean;
      };

      if (!response.ok) {
        throw new Error(data.error || "Invalid password");
      }

      setUsingDefaultPassword(Boolean(data.usingDefaultPassword));
      setAuthState("authenticated");
      setPassword("");
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "Could not log in to the editor."
      );
    }
  }

  async function handleLogout() {
    await fetch("/api/editor-login", { method: "DELETE" });
    setAuthState("unauthenticated");
  }

  if (authState === "loading") {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
        <div className="w-full rounded-2xl border border-border/60 bg-background/80 p-8 shadow-sm">
          <p className="text-sm text-muted-foreground">Checking editor access...</p>
        </div>
      </main>
    );
  }

  if (authState === "unauthenticated") {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
        <div className="w-full rounded-3xl border border-border/60 bg-background/90 p-8 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
              Editor Access
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Sign in to edit site content
            </h1>
            <p className="text-sm text-muted-foreground">
              This page is protected by a simple password cookie. Set{" "}
              <code>EDITOR_PASSWORD</code> in your environment before deploying it
              publicly.
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            <Field label="Password">
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter editor password"
              />
            </Field>
            {loginError ? (
              <p className="text-sm text-red-500">{loginError}</p>
            ) : null}
            <Button type="submit">Unlock editor</Button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <EditorShell
      currentSection={section}
      usingDefaultPassword={usingDefaultPassword}
      statusText={statusText}
      onLogout={handleLogout}
    >
      {section === "home" ? (
        <HomeEditorIntro />
      ) : section === "site" ? (
        <SectionCard
          title="Site Chrome"
          description="Update the top bar, footer text, editor button label, and the headers shown on each main page."
          actions={
            <Button type="button" onClick={() => saveSection("site")}>
              Save Site
            </Button>
          }
        >
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <PathUploadField
                label="Brand icon path"
                value={draft.site.branding.icon ?? ""}
                folder="branding"
                accept="image/*"
                placeholder="/icon.svg"
                uploadLabel="Select icon"
                onChange={(path) =>
                  updateSection("site", (current) => ({
                    ...current,
                    branding: {
                      ...current.branding,
                      icon: path,
                    },
                  }))
                }
                onUploaded={(path) =>
                  updateSectionAndAutoSave("site", (current) => ({
                    ...current,
                    branding: {
                      ...current.branding,
                      icon: path,
                    },
                  }))
                }
              />
              <Field label="Main title">
                <Input
                  value={draft.site.branding.name}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      branding: {
                        ...draft.site.branding,
                        name: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Subtitle">
                <Input
                  value={draft.site.branding.title}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      branding: {
                        ...draft.site.branding,
                        title: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Footer copyright name">
                <Input
                  value={draft.site.footer.copyrightName}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      footer: {
                        ...draft.site.footer,
                        copyrightName: event.target.value,
                      },
                    })
                  }
                />
              </Field>
            </div>

            <Field label="Top bar description">
              <Textarea
                value={draft.site.branding.description}
                rows={3}
                onChange={(event) =>
                  updateSection("site", {
                    ...draft.site,
                    branding: {
                      ...draft.site.branding,
                      description: event.target.value,
                    },
                  })
                }
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Top bar About button">
                <Input
                  value={draft.site.navigation.about}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      navigation: {
                        ...draft.site.navigation,
                        about: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Top bar CV button">
                <Input
                  value={draft.site.navigation.cv}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      navigation: {
                        ...draft.site.navigation,
                        cv: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Top bar Publications button">
                <Input
                  value={draft.site.navigation.publications}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      navigation: {
                        ...draft.site.navigation,
                        publications: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Top bar Portfolio button">
                <Input
                  value={draft.site.navigation.portfolio}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      navigation: {
                        ...draft.site.navigation,
                        portfolio: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Top bar Contact button">
                <Input
                  value={draft.site.navigation.contact}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      navigation: {
                        ...draft.site.navigation,
                        contact: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Top bar Repo button">
                <Input
                  value={draft.site.navigation.repo}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      navigation: {
                        ...draft.site.navigation,
                        repo: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Footer editor button">
                <Input
                  value={draft.site.navigation.editor}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      navigation: {
                        ...draft.site.navigation,
                        editor: event.target.value,
                      },
                    })
                  }
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="GitHub link">
                <Input
                  value={draft.site.social.github ?? ""}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      social: {
                        ...draft.site.social,
                        github: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="LinkedIn link">
                <Input
                  value={draft.site.social.linkedin ?? ""}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      social: {
                        ...draft.site.social,
                        linkedin: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Twitter/X link">
                <Input
                  value={draft.site.social.twitter ?? ""}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      social: {
                        ...draft.site.social,
                        twitter: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Instagram link">
                <Input
                  value={draft.site.social.instagram ?? ""}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      social: {
                        ...draft.site.social,
                        instagram: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="YouTube link">
                <Input
                  value={draft.site.social.youtube ?? ""}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      social: {
                        ...draft.site.social,
                        youtube: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Email link">
                <Input
                  value={draft.site.social.email ?? ""}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      social: {
                        ...draft.site.social,
                        email: event.target.value,
                      },
                    })
                  }
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="About page header">
                <Input
                  value={draft.site.headers.about}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      headers: {
                        ...draft.site.headers,
                        about: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Core Skills header">
                <Input
                  value={draft.site.headers.coreSkills}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      headers: {
                        ...draft.site.headers,
                        coreSkills: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Featured Projects header">
                <Input
                  value={draft.site.headers.featuredProjects}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      headers: {
                        ...draft.site.headers,
                        featuredProjects: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Featured Publications header">
                <Input
                  value={draft.site.headers.featuredPublications}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      headers: {
                        ...draft.site.headers,
                        featuredPublications: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Portfolio page header">
                <Input
                  value={draft.site.headers.portfolio}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      headers: {
                        ...draft.site.headers,
                        portfolio: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Publications page header">
                <Input
                  value={draft.site.headers.publications}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      headers: {
                        ...draft.site.headers,
                        publications: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Repo page header">
                <Input
                  value={draft.site.headers.repo}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      headers: {
                        ...draft.site.headers,
                        repo: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="CV page header">
                <Input
                  value={draft.site.headers.cv}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      headers: {
                        ...draft.site.headers,
                        cv: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Contact page header">
                <Input
                  value={draft.site.headers.contact}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      headers: {
                        ...draft.site.headers,
                        contact: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Footer secondary text">
                <Input
                  value={draft.site.footer.builtWith}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      footer: {
                        ...draft.site.footer,
                        builtWith: event.target.value,
                      },
                    })
                  }
                />
              </Field>
            </div>
          </div>
        </SectionCard>
      ) : section === "contact" ? (
        <SectionCard
          title="Contact"
          description="Update the contact section text, labels, links, and call-to-action button."
          actions={
            <Button type="button" onClick={() => saveSection("site")}>
              Save Contact
            </Button>
          }
        >
          <div className="space-y-6">
            <ParagraphListEditor
              label="Header text"
              addLabel="Add paragraph"
              values={draft.site.pageIntro.contact}
              onChange={(contact) =>
                updateSection("site", {
                  ...draft.site,
                  pageIntro: {
                    ...draft.site.pageIntro,
                    contact,
                  },
                })
              }
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Contact section title">
                <Input
                  value={draft.site.contact.sectionTitle}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      contact: {
                        ...draft.site.contact,
                        sectionTitle: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Contact headline">
                <Input
                  value={draft.site.contact.headline}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      contact: {
                        ...draft.site.contact,
                        headline: event.target.value,
                      },
                    })
                  }
                />
              </Field>
            </div>

            <Field label="Contact description">
              <Textarea
                value={draft.site.contact.description}
                rows={4}
                onChange={(event) =>
                  updateSection("site", {
                    ...draft.site,
                    contact: {
                      ...draft.site.contact,
                      description: event.target.value,
                    },
                  })
                }
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Email label">
                <Input
                  value={draft.site.contact.emailLabel}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      contact: {
                        ...draft.site.contact,
                        emailLabel: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Email text">
                <Input
                  value={draft.site.contact.emailValue}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      contact: {
                        ...draft.site.contact,
                        emailValue: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Email link">
                <Input
                  value={draft.site.contact.emailHref}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      contact: {
                        ...draft.site.contact,
                        emailHref: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Location label">
                <Input
                  value={draft.site.contact.locationLabel}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      contact: {
                        ...draft.site.contact,
                        locationLabel: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Location text">
                <Input
                  value={draft.site.contact.locationValue}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      contact: {
                        ...draft.site.contact,
                        locationValue: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Availability label">
                <Input
                  value={draft.site.contact.availabilityLabel}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      contact: {
                        ...draft.site.contact,
                        availabilityLabel: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Availability text">
                <Input
                  value={draft.site.contact.availabilityValue}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      contact: {
                        ...draft.site.contact,
                        availabilityValue: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Primary button label">
                <Input
                  value={draft.site.contact.primaryButtonLabel}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      contact: {
                        ...draft.site.contact,
                        primaryButtonLabel: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Primary button link">
                <Input
                  value={draft.site.contact.primaryButtonHref}
                  onChange={(event) =>
                    updateSection("site", {
                      ...draft.site,
                      contact: {
                        ...draft.site.contact,
                        primaryButtonHref: event.target.value,
                      },
                    })
                  }
                />
              </Field>
            </div>
          </div>
        </SectionCard>
      ) : section === "about" ? (
        <SectionCard
          title="About"
          description="Edit the text blocks and the skill chips shown in the About section."
          actions={
            <Button type="button" onClick={() => saveSection("about")}>
              Save About
            </Button>
          }
        >
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <PathUploadField
                label="Background image path"
                value={draft.about.backgroundImage ?? ""}
                folder="about"
                accept="image/*"
                placeholder="/uploads/about/background.png"
                uploadLabel="Select background"
                onChange={(path) =>
                  updateSection("about", (current) => ({
                    ...current,
                    backgroundImage: path,
                  }))
                }
                onUploaded={(path) =>
                  updateSectionAndAutoSave("about", (current) => ({
                    ...current,
                    backgroundImage: path,
                  }))
                }
              />
            </div>
            <ParagraphListEditor
              label="Paragraphs"
              addLabel="Add paragraph"
              values={draft.about.paragraphs}
              onChange={(paragraphs) =>
                updateSection("about", { ...draft.about, paragraphs })
              }
            />
            <StringListEditor
              label="Skills"
              addLabel="Add skill"
              values={draft.about.skills}
              onChange={(skills) => updateSection("about", { ...draft.about, skills })}
            />
            <StringListEditor
              label="Scroll words"
              addLabel="Add word"
              values={draft.about.morphWords}
              onChange={(morphWords) =>
                updateSection("about", { ...draft.about, morphWords })
              }
            />
          </div>
        </SectionCard>
      ) : section === "portfolio" ? (
        <SectionCard
          title="Portfolio"
          description="Manage project cards, links, figure sets, and base images."
          actions={
            <Button type="button" onClick={() => saveSection("portfolio")}>
              Save Portfolio
            </Button>
          }
        >
          <div className="space-y-5">
            <ParagraphListEditor
              label="Header text"
              addLabel="Add paragraph"
              values={draft.site.pageIntro.portfolio}
              onChange={(portfolio) =>
                updateSection("site", {
                  ...draft.site,
                  pageIntro: {
                    ...draft.site.pageIntro,
                    portfolio,
                  },
                })
              }
            />

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  updateSection("portfolio", [...draft.portfolio, createEmptyProject()])
                }
              >
                Add project
              </Button>
            </div>

            {draft.portfolio.map((project, index) => (
              <CollapsibleEditorCard
                key={`project-${index}`}
                title={project.title || `Project ${index + 1}`}
                cardKey={`portfolio-${index}`}
                collapsed={collapsedCards[`portfolio-${index}`] ?? true}
                orderLabel={`Project ${index + 1}`}
                preview={
                  <BaseFigurePreview
                    src={project.image}
                    alt={`${project.title || `Project ${index + 1}`} base figure`}
                    aspect="square"
                  />
                }
                onToggle={() => toggleCard(`portfolio-${index}`)}
                onRemove={() =>
                  updateSection(
                    "portfolio",
                    draft.portfolio.filter((_, item) => item !== index)
                  )
                }
                canMoveUp={index > 0}
                canMoveDown={index < draft.portfolio.length - 1}
                onMoveUp={() =>
                  updateSection("portfolio", moveItem(draft.portfolio, index, index - 1))
                }
                onMoveDown={() =>
                  updateSection("portfolio", moveItem(draft.portfolio, index, index + 1))
                }
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Title">
                    <Input
                      value={project.title}
                      onChange={(event) => {
                        const next = [...draft.portfolio];
                        const title = event.target.value;
                        next[index] = {
                          ...project,
                          title,
                          slug: slugify(title) || project.slug,
                        };
                        updateSection("portfolio", next);
                      }}
                    />
                  </Field>
                  <Field label="Subtitle">
                    <Input
                      value={project.subtitle ?? ""}
                      onChange={(event) => {
                        const next = [...draft.portfolio];
                        next[index] = { ...project, subtitle: event.target.value };
                        updateSection("portfolio", next);
                      }}
                      placeholder="Optional"
                    />
                  </Field>
                  <PathUploadField
                    label="Base image path"
                    value={project.image}
                    folder={`portfolio/${project.slug || slugify(project.title) || `project-${index + 1}`}`}
                    accept={FIGURE_FILE_ACCEPT}
                    uploadLabel="Select figure file"
                    onChange={(path) =>
                      updateSection("portfolio", (current) => {
                        const next = [...current];
                        next[index] = { ...next[index], image: path };
                        return next;
                      })
                    }
                    onUploaded={(path) =>
                      updateSectionAndAutoSave("portfolio", (current) => {
                        const next = [...current];
                        next[index] = { ...next[index], image: path };
                        return next;
                      })
                    }
                  />
                  <Field label="Live URL">
                    <Input
                      value={project.url}
                      onChange={(event) => {
                        const next = [...draft.portfolio];
                        next[index] = { ...project, url: event.target.value };
                        updateSection("portfolio", next);
                      }}
                    />
                  </Field>
                  <Field label="GitHub URL">
                    <Input
                      value={project.github}
                      onChange={(event) => {
                        const next = [...draft.portfolio];
                        next[index] = { ...project, github: event.target.value };
                        updateSection("portfolio", next);
                      }}
                    />
                  </Field>
                </div>

                <Field label="Description">
                  <Textarea
                    value={project.description}
                    onChange={(event) => {
                      const next = [...draft.portfolio];
                      next[index] = { ...project, description: event.target.value };
                      updateSection("portfolio", next);
                    }}
                    rows={4}
                  />
                </Field>

                <StringListEditor
                  label="Tags"
                  addLabel="Add tag"
                  values={project.tags}
                  onChange={(tags) => {
                    const next = [...draft.portfolio];
                    next[index] = { ...project, tags };
                    updateSection("portfolio", next);
                  }}
                />

                <FigureListEditor
                  baseImage={project.image}
                  figures={project.figures ?? []}
                  folder={`portfolio/${project.slug || slugify(project.title) || `project-${index + 1}`}`}
                  onChange={(figures) =>
                    updateSection("portfolio", (current) => {
                      const next = [...current];
                      next[index] = {
                        ...next[index],
                        figures:
                          typeof figures === "function"
                            ? figures(next[index].figures ?? [])
                            : figures,
                      };
                      return next;
                    })
                  }
                  onSelectBase={(image) => {
                    updateSection("portfolio", (current) => {
                      const next = [...current];
                      next[index] = { ...next[index], image };
                      return next;
                    });
                  }}
                />
              </CollapsibleEditorCard>
            ))}
          </div>
        </SectionCard>
      ) : section === "repo" ? (
        <SectionCard
          title="Repo"
          description="Manage the downloadable image cards shown on the public repo page."
          actions={
            <Button type="button" onClick={() => saveSection("repo")}>
              Save Repo
            </Button>
          }
        >
          <div className="space-y-5">
            <ParagraphListEditor
              label="Header text"
              addLabel="Add paragraph"
              values={draft.site.pageIntro.repo}
              onChange={(repo) =>
                updateSection("site", {
                  ...draft.site,
                  pageIntro: {
                    ...draft.site.pageIntro,
                    repo,
                  },
                })
              }
            />

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => updateSection("repo", [...draft.repo, createEmptyRepoItem()])}
              >
                Add repo item
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {draft.repo.map((item, index) => (
                <RepoEditorCard
                  key={item.id}
                  item={item}
                  index={index}
                onChange={(nextItem) => {
                  updateSection("repo", (current) => {
                    const next = [...current];
                    next[index] =
                      typeof nextItem === "function" ? nextItem(current[index]) : nextItem;
                    return next;
                  });
                }}
                  onRemove={() =>
                    updateSection(
                      "repo",
                      draft.repo.filter((_, repoIndex) => repoIndex !== index)
                    )
                  }
                  onMoveUp={() => updateSection("repo", moveItem(draft.repo, index, index - 1))}
                  onMoveDown={() =>
                    updateSection("repo", moveItem(draft.repo, index, index + 1))
                  }
                  canMoveUp={index > 0}
                  canMoveDown={index < draft.repo.length - 1}
                  onDragStart={() => {
                    setDraggingRepoIndex(index);
                    setDropRepoIndex(index);
                  }}
                  onDragEnd={() => {
                    setDraggingRepoIndex(null);
                    setDropRepoIndex(null);
                  }}
                  onDragOver={() => setDropRepoIndex(index)}
                  onDrop={() => {
                    if (draggingRepoIndex === null) return;
                    updateSection("repo", moveItem(draft.repo, draggingRepoIndex, index));
                    setDraggingRepoIndex(null);
                    setDropRepoIndex(null);
                  }}
                  isDragging={draggingRepoIndex === index}
                  isDropTarget={
                    dropRepoIndex === index &&
                    draggingRepoIndex !== null &&
                    draggingRepoIndex !== index
                  }
                />
              ))}
            </div>
          </div>
        </SectionCard>
      ) : section === "publications" ? (
        <SectionCard
          title="Publications"
          description="Edit publication cards with their details, images, and figure sets."
          actions={
            <Button type="button" onClick={() => saveSection("publications")}>
              Save Publications
            </Button>
          }
        >
          <div className="space-y-5">
            <ParagraphListEditor
              label="Header text"
              addLabel="Add paragraph"
              values={draft.site.pageIntro.publications}
              onChange={(publications) =>
                updateSection("site", {
                  ...draft.site,
                  pageIntro: {
                    ...draft.site.pageIntro,
                    publications,
                  },
                })
              }
            />

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  updateSection(
                    "publications",
                    [...draft.publications, createEmptyPublication()]
                  )
                }
              >
                Add publication
              </Button>
            </div>

            {draft.publications.map((publication, index) => (
              <CollapsibleEditorCard
                key={`publication-${index}`}
                title={publication.title || `Publication ${index + 1}`}
                cardKey={`publications-${index}`}
                collapsed={collapsedCards[`publications-${index}`] ?? true}
                orderLabel={`Publication ${index + 1}`}
                preview={
                  <BaseFigurePreview
                    src={publication.image}
                    alt={`${publication.title || `Publication ${index + 1}`} base figure`}
                    aspect="a-portrait"
                  />
                }
                onToggle={() => toggleCard(`publications-${index}`)}
                onRemove={() =>
                  updateSection(
                    "publications",
                    draft.publications.filter((_, item) => item !== index)
                  )
                }
                canMoveUp={index > 0}
                canMoveDown={index < draft.publications.length - 1}
                onMoveUp={() =>
                  updateSection(
                    "publications",
                    moveItem(draft.publications, index, index - 1)
                  )
                }
                onMoveDown={() =>
                  updateSection(
                    "publications",
                    moveItem(draft.publications, index, index + 1)
                  )
                }
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Title">
                    <Input
                      value={publication.title}
                      onChange={(event) => {
                        const next = [...draft.publications];
                        const title = event.target.value;
                        next[index] = {
                          ...publication,
                          title,
                          slug: slugify(title) || publication.slug,
                        };
                        updateSection("publications", next);
                      }}
                    />
                  </Field>
                  <Field label="Subtitle">
                    <Input
                      value={publication.subtitle ?? ""}
                      onChange={(event) => {
                        const next = [...draft.publications];
                        next[index] = {
                          ...publication,
                          subtitle: event.target.value,
                        };
                        updateSection("publications", next);
                      }}
                      placeholder="Optional"
                    />
                  </Field>
                  <Field label="Venue">
                    <Input
                      value={publication.venue}
                      onChange={(event) => {
                        const next = [...draft.publications];
                        next[index] = { ...publication, venue: event.target.value };
                        updateSection("publications", next);
                      }}
                    />
                  </Field>
                  <Field label="Type">
                    <Input
                      value={publication.type}
                      onChange={(event) => {
                        const next = [...draft.publications];
                        next[index] = { ...publication, type: event.target.value };
                        updateSection("publications", next);
                      }}
                    />
                  </Field>
                  <Field label="Year">
                    <Input
                      value={publication.year}
                      onChange={(event) => {
                        const next = [...draft.publications];
                        next[index] = { ...publication, year: event.target.value };
                        updateSection("publications", next);
                      }}
                    />
                  </Field>
                  <Field label="URL">
                    <Input
                      value={publication.url}
                      onChange={(event) => {
                        const next = [...draft.publications];
                        next[index] = { ...publication, url: event.target.value };
                        updateSection("publications", next);
                      }}
                    />
                  </Field>
                  <PathUploadField
                    label="Base image path"
                    value={publication.image}
                    folder={`publications/${publication.slug || slugify(publication.title) || `publication-${index + 1}`}`}
                    accept={FIGURE_FILE_ACCEPT}
                    uploadLabel="Select figure file"
                    onChange={(path) =>
                      updateSection("publications", (current) => {
                        const next = [...current];
                        next[index] = { ...next[index], image: path };
                        return next;
                      })
                    }
                    onUploaded={(path) =>
                      updateSectionAndAutoSave("publications", (current) => {
                        const next = [...current];
                        next[index] = { ...next[index], image: path };
                        return next;
                      })
                    }
                  />
                </div>

                <Field label="Abstract">
                  <Textarea
                    value={publication.abstract}
                    onChange={(event) => {
                      const next = [...draft.publications];
                      next[index] = { ...publication, abstract: event.target.value };
                      updateSection("publications", next);
                    }}
                    rows={4}
                  />
                </Field>

                <label className="flex items-center gap-3 rounded-xl border border-border/50 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={Boolean(publication.featuredInAbout)}
                    onChange={(event) => {
                      const next = [...draft.publications];
                      next[index] = {
                        ...publication,
                        featuredInAbout: event.target.checked,
                      };
                      updateSection("publications", next);
                    }}
                    className="size-4"
                  />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground">
                      Feature in About
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Shows this publication in the stacking cards section on the About page.
                    </p>
                  </div>
                </label>

                <StringListEditor
                  label="Tags"
                  addLabel="Add tag"
                  values={publication.tags}
                  onChange={(tags) => {
                    const next = [...draft.publications];
                    next[index] = { ...publication, tags };
                    updateSection("publications", next);
                  }}
                />

                <FigureListEditor
                  baseImage={publication.image}
                  figures={publication.figures ?? []}
                  folder={`publications/${publication.slug || slugify(publication.title) || `publication-${index + 1}`}`}
                  onChange={(figures) =>
                    updateSection("publications", (current) => {
                      const next = [...current];
                      next[index] = {
                        ...next[index],
                        figures:
                          typeof figures === "function"
                            ? figures(next[index].figures ?? [])
                            : figures,
                      };
                      return next;
                    })
                  }
                  onSelectBase={(image) => {
                    updateSection("publications", (current) => {
                      const next = [...current];
                      next[index] = { ...next[index], image };
                      return next;
                    });
                  }}
                />
              </CollapsibleEditorCard>
            ))}
          </div>
        </SectionCard>
      ) : (
        <SectionCard
          title="Curriculum Vitae"
          description="Manage the CV timeline entries, dates, labels, descriptions, details, and skill lists."
          actions={
            <Button type="button" onClick={() => saveSection("cv")}>
              Save CV
            </Button>
          }
        >
          <div className="space-y-5">
            <ParagraphListEditor
              label="Header text"
              addLabel="Add paragraph"
              values={draft.site.pageIntro.cv}
              onChange={(cv) =>
                updateSection("site", {
                  ...draft.site,
                  pageIntro: {
                    ...draft.site.pageIntro,
                    cv,
                  },
                })
              }
            />

            <div className="grid gap-4 md:grid-cols-2">
              <PathUploadField
                label="CV document path"
                value={draft.cv.documentPath ?? ""}
                folder="documents/cv"
                accept=".pdf,application/pdf"
                placeholder="/uploads/documents/cv/cv.pdf"
                uploadLabel="Select PDF"
                onChange={(path) =>
                  updateSection("cv", (current) => ({
                    ...current,
                    documentPath: path,
                  }))
                }
                onUploaded={(path) =>
                  updateSectionAndAutoSave("cv", (current) => ({
                    ...current,
                    documentPath: path,
                  }))
                }
              />
              <Field label="Download button label">
                <Input
                  value={draft.cv.documentLabel ?? ""}
                  onChange={(event) =>
                    updateSection("cv", {
                      ...draft.cv,
                      documentLabel: event.target.value,
                    })
                  }
                  placeholder="Download CV"
                />
              </Field>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  updateSection("cv", {
                    items: reindexTimelineCardPositions([
                      ...draft.cv.items,
                      createEmptyTimelineItem(),
                    ]),
                  })
                }
              >
                Add CV item
              </Button>
            </div>

            {draft.cv.items.map((item, index) => (
              <CollapsibleEditorCard
                key={item.id || `cv-${index}`}
                title={item.title || `CV item ${index + 1}`}
                cardKey={`cv-${item.id || index}`}
                collapsed={collapsedCards[`cv-${item.id || index}`] ?? true}
                orderLabel={`Item ${index + 1}`}
                onToggle={() => toggleCard(`cv-${item.id || index}`)}
                onRemove={() =>
                  updateSection("cv", {
                    items: reindexTimelineCardPositions(
                      draft.cv.items.filter((_, entry) => entry !== index)
                    ),
                  })
                }
                canMoveUp={index > 0}
                canMoveDown={index < draft.cv.items.length - 1}
                onMoveUp={() =>
                  updateSection("cv", {
                    items: reindexTimelineCardPositions(
                      moveItem(draft.cv.items, index, index - 1)
                    ),
                  })
                }
                onMoveDown={() =>
                  updateSection("cv", {
                    items: reindexTimelineCardPositions(
                      moveItem(draft.cv.items, index, index + 1)
                    ),
                  })
                }
              >
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Field label="ID">
                    <Input
                      value={item.id}
                      onChange={(event) => {
                        const next = [...draft.cv.items];
                        next[index] = { ...item, id: event.target.value };
                        updateSection("cv", { items: next });
                      }}
                    />
                  </Field>
                  <Field label="Type">
                    <select
                      className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                      value={item.type}
                      onChange={(event) => {
                        const next = [...draft.cv.items];
                        next[index] = {
                          ...item,
                          type: event.target.value as ExperienceType,
                        };
                        updateSection("cv", { items: next });
                      }}
                    >
                      <option value="work">Work</option>
                      <option value="education">Education</option>
                      <option value="other">Other</option>
                    </select>
                  </Field>
                  <Field label="Card position">
                    <Input
                      type="number"
                      min="1"
                      value={item.cardPosition ?? index + 1}
                      onChange={(event) => {
                        const next = [...draft.cv.items];
                        next[index] = {
                          ...item,
                          cardPosition:
                            parseOptionalNumber(event.target.value) ?? index + 1,
                        };
                        updateSection("cv", { items: next });
                      }}
                    />
                  </Field>
                  <Field label="Period label">
                    <Input
                      value={item.period}
                      onChange={(event) => {
                        const next = [...draft.cv.items];
                        next[index] = { ...item, period: event.target.value };
                        updateSection("cv", { items: next });
                      }}
                    />
                  </Field>
                  <Field label="Start year">
                    <Input
                      type="number"
                      value={item.startYear}
                      onChange={(event) => {
                        const next = [...draft.cv.items];
                        next[index] = {
                          ...item,
                          startYear: Number(event.target.value) || item.startYear,
                        };
                        updateSection("cv", { items: next });
                      }}
                    />
                  </Field>
                  <Field label="Start month">
                    <Input
                      type="number"
                      min="1"
                      max="12"
                      value={item.startMonth ?? ""}
                      onChange={(event) => {
                        const next = [...draft.cv.items];
                        next[index] = {
                          ...item,
                          startMonth: parseOptionalNumber(event.target.value),
                        };
                        updateSection("cv", { items: next });
                      }}
                      placeholder="Optional"
                    />
                  </Field>
                  <Field label="End year">
                    <Input
                      type="number"
                      value={item.endYear}
                      onChange={(event) => {
                        const next = [...draft.cv.items];
                        next[index] = {
                          ...item,
                          endYear: Number(event.target.value) || item.endYear,
                        };
                        updateSection("cv", { items: next });
                      }}
                    />
                  </Field>
                  <Field label="End month">
                    <Input
                      type="number"
                      min="1"
                      max="12"
                      value={item.endMonth ?? ""}
                      onChange={(event) => {
                        const next = [...draft.cv.items];
                        next[index] = {
                          ...item,
                          endMonth: parseOptionalNumber(event.target.value),
                        };
                        updateSection("cv", { items: next });
                      }}
                      placeholder="Optional"
                    />
                  </Field>
                  <Field label="Title">
                    <Input
                      value={item.title}
                      onChange={(event) => {
                        const next = [...draft.cv.items];
                        next[index] = { ...item, title: event.target.value };
                        updateSection("cv", { items: next });
                      }}
                    />
                  </Field>
                  <Field label="Organization">
                    <Input
                      value={item.organization}
                      onChange={(event) => {
                        const next = [...draft.cv.items];
                        next[index] = { ...item, organization: event.target.value };
                        updateSection("cv", { items: next });
                      }}
                    />
                  </Field>
                  <Field label="URL">
                    <Input
                      value={item.url ?? ""}
                      onChange={(event) => {
                        const next = [...draft.cv.items];
                        next[index] = { ...item, url: event.target.value };
                        updateSection("cv", { items: next });
                      }}
                      placeholder="Optional"
                    />
                  </Field>
                </div>

                <Field label="Description">
                  <Textarea
                    value={item.description}
                    onChange={(event) => {
                      const next = [...draft.cv.items];
                      next[index] = { ...item, description: event.target.value };
                      updateSection("cv", { items: next });
                    }}
                    rows={4}
                  />
                </Field>

                <StringListEditor
                  label="Details"
                  addLabel="Add detail"
                  values={item.details ?? []}
                  onChange={(details) => {
                    const next = [...draft.cv.items];
                    next[index] = { ...item, details };
                    updateSection("cv", { items: next });
                  }}
                />

                <StringListEditor
                  label="Skills"
                  addLabel="Add skill"
                  values={item.skills ?? []}
                  onChange={(skills) => {
                    const next = [...draft.cv.items];
                    next[index] = { ...item, skills };
                    updateSection("cv", { items: next });
                  }}
                />
              </CollapsibleEditorCard>
            ))}
          </div>
        </SectionCard>
      )}
    </EditorShell>
  );
}
