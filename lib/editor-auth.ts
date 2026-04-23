import "server-only";

import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "editor_auth";
const DEFAULT_PASSWORD = "change-me";

function getPassword() {
  return process.env.EDITOR_PASSWORD ?? DEFAULT_PASSWORD;
}

function createToken(password: string) {
  return createHash("sha256").update(`editor:${password}`).digest("hex");
}

export function isDefaultEditorPassword() {
  return !process.env.EDITOR_PASSWORD;
}

export function isPasswordValid(password: string) {
  const expected = Buffer.from(getPassword());
  const provided = Buffer.from(password);

  return (
    expected.length === provided.length &&
    timingSafeEqual(expected, provided)
  );
}

export async function createEditorSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createToken(getPassword()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearEditorSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isEditorAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  return token === createToken(getPassword());
}
