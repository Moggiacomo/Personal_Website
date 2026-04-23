import { NextResponse } from "next/server";
import { readSiteContent, writeSiteContent } from "@/lib/content-store";
import type { SiteContent } from "@/lib/content-types";
import { isEditorAuthenticated } from "@/lib/editor-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const content = await readSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  if (!(await isEditorAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as SiteContent;
  await writeSiteContent(body);
  return NextResponse.json({ ok: true });
}
