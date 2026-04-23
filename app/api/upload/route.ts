import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { isEditorAuthenticated } from "@/lib/editor-auth";

export const runtime = "nodejs";

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

function sanitizeFolderPath(folder: string) {
  return folder
    .split(/[\\/]+/)
    .map((segment) => sanitizeFilename(segment))
    .filter(Boolean)
    .join(path.sep);
}

export async function POST(request: Request) {
  if (!(await isEditorAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") || "misc");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = path.extname(file.name) || ".png";
  const safeName = sanitizeFilename(path.basename(file.name, ext));
  const safeFolder = sanitizeFolderPath(folder) || "misc";
  const relativeDir = path.join("uploads", safeFolder);
  const absoluteDir = path.join(process.cwd(), "public", relativeDir);
  const finalName = `${Date.now()}-${safeName}${ext}`;
  const absolutePath = path.join(absoluteDir, finalName);
  const publicPath = `/${relativeDir.replace(/\\/g, "/")}/${finalName}`;

  await mkdir(absoluteDir, { recursive: true });
  await writeFile(absolutePath, buffer);

  return NextResponse.json({ path: publicPath });
}
