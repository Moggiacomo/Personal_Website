import type { LucideIcon } from "lucide-react";
import {
  ExternalLink,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
  Youtube,
} from "lucide-react";

export function hasUsableLink(value?: string | null) {
  return Boolean(value?.trim());
}

export function getExternalLinkIcon(url?: string | null): LucideIcon {
  const normalized = url?.trim().toLowerCase() ?? "";

  if (normalized.startsWith("mailto:")) return Mail;
  if (normalized.includes("github.com")) return Github;
  if (normalized.includes("linkedin.com")) return Linkedin;
  if (normalized.includes("twitter.com") || normalized.includes("x.com")) return Twitter;
  if (normalized.includes("instagram.com")) return Instagram;
  if (normalized.includes("youtube.com") || normalized.includes("youtu.be")) return Youtube;

  return ExternalLink;
}
