import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { SiteContent } from "@/lib/content-types";
import defaultContent from "@/content/site-content.json";

const CONTENT_PATH = path.join(process.cwd(), "content", "site-content.json");

export async function readSiteContent(): Promise<SiteContent> {
  try {
    const file = await readFile(CONTENT_PATH, "utf8");
    return JSON.parse(file) as SiteContent;
  } catch {
    return defaultContent as SiteContent;
  }
}

export async function writeSiteContent(content: SiteContent) {
  await mkdir(path.dirname(CONTENT_PATH), { recursive: true });
  await writeFile(CONTENT_PATH, JSON.stringify(content, null, 2), "utf8");
}
