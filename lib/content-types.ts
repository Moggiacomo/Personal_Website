import type { Project } from "@/lib/projects";
import type { Publication } from "@/lib/publications";

export type ExperienceType = "work" | "education" | "other";
export type ParagraphLevel = "body" | "lead" | "highlight";

export interface RichParagraph {
  text: string;
  level?: ParagraphLevel;
}

export interface TimelineItem {
  id: string;
  type: ExperienceType;
  period: string;
  startYear: number;
  startMonth?: number;
  endYear: number;
  endMonth?: number;
  title: string;
  organization: string;
  url?: string;
  description: string;
  details?: string[];
  skills?: string[];
}

export interface AboutContent {
  paragraphs: RichParagraph[];
  skills: string[];
}

export interface SiteBrandingContent {
  name: string;
  title: string;
  description: string;
}

export interface SiteNavigationContent {
  about: string;
  cv: string;
  publications: string;
  portfolio: string;
  repo: string;
  contact: string;
  editor: string;
}

export interface SiteFooterContent {
  copyrightName: string;
  builtWith: string;
}

export interface SiteContactContent {
  sectionTitle: string;
  headline: string;
  description: string;
  emailLabel: string;
  emailValue: string;
  emailHref: string;
  locationLabel: string;
  locationValue: string;
  availabilityLabel: string;
  availabilityValue: string;
  primaryButtonLabel: string;
  primaryButtonHref: string;
}

export interface SiteHeadersContent {
  about: string;
  coreSkills: string;
  featuredProjects: string;
  portfolio: string;
  publications: string;
  repo: string;
  cv: string;
  contact: string;
}

export interface SitePageIntroContent {
  portfolio: RichParagraph[];
  publications: RichParagraph[];
  repo: RichParagraph[];
  cv: RichParagraph[];
  contact: RichParagraph[];
}

export interface SiteChromeContent {
  branding: SiteBrandingContent;
  navigation: SiteNavigationContent;
  footer: SiteFooterContent;
  headers: SiteHeadersContent;
  pageIntro: SitePageIntroContent;
  contact: SiteContactContent;
}

export interface CVContent {
  documentPath?: string;
  documentLabel?: string;
  items: TimelineItem[];
}

export interface RepoItem {
  id: string;
  title: string;
  image: string;
  downloadPath: string;
  downloadLabel?: string;
  alt?: string;
}

export interface SiteContent {
  site: SiteChromeContent;
  about: AboutContent;
  portfolio: Project[];
  publications: Publication[];
  repo: RepoItem[];
  cv: CVContent;
}
