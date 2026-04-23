import { NextResponse } from "next/server";
import {
  clearEditorSession,
  createEditorSession,
  isEditorAuthenticated,
  isPasswordValid,
  isDefaultEditorPassword,
} from "@/lib/editor-auth";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    authenticated: await isEditorAuthenticated(),
    usingDefaultPassword: isDefaultEditorPassword(),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };

  if (!body.password || !isPasswordValid(body.password)) {
    return NextResponse.json(
      { ok: false, error: "Invalid password" },
      { status: 401 }
    );
  }

  await createEditorSession();
  return NextResponse.json({
    ok: true,
    usingDefaultPassword: isDefaultEditorPassword(),
  });
}

export async function DELETE() {
  await clearEditorSession();
  return NextResponse.json({ ok: true });
}
