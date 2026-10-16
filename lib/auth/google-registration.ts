import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export interface GoogleRegistrationProfile {
  name: string;
  email: string;
  subject: string;
  expiresAt: number;
}

export const GOOGLE_REGISTRATION_COOKIE = "google_registration";
export const GOOGLE_REGISTRATION_MAX_AGE = 10 * 60;
const GOOGLE_REGISTRATION_COOKIE_PATH = "/signup";

function getSigningKey() {
  return process.env.GOOGLE_CLIENT_SECRET;
}

export function createGoogleRegistrationTicket(profile: {
  name: string;
  email: string;
  subject: string;
}) {
  const signingKey = getSigningKey();
  if (!signingKey) throw new Error("Google OAuth is not configured");

  const payload = Buffer.from(
    JSON.stringify({
      name: profile.name.trim() || profile.email,
      email: profile.email.trim().toLowerCase(),
      subject: profile.subject,
      expiresAt: Date.now() + GOOGLE_REGISTRATION_MAX_AGE * 1000,
    } satisfies GoogleRegistrationProfile)
  ).toString("base64url");
  const signature = createHmac("sha256", signingKey).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyGoogleRegistrationTicket(value?: string): GoogleRegistrationProfile | null {
  const signingKey = getSigningKey();
  if (!value || !signingKey) return null;

  const [payload, signature, ...extraParts] = value.split(".");
  if (!payload || !signature || extraParts.length > 0) return null;

  const expectedSignature = createHmac("sha256", signingKey).update(payload).digest();
  let receivedSignature: Buffer;
  try {
    receivedSignature = Buffer.from(signature, "base64url");
  } catch {
    return null;
  }
  if (
    receivedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(receivedSignature, expectedSignature)
  ) {
    return null;
  }

  try {
    const profile = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as GoogleRegistrationProfile;
    if (
      typeof profile.name !== "string" ||
      typeof profile.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email) ||
      typeof profile.subject !== "string" ||
      !profile.subject ||
      typeof profile.expiresAt !== "number" ||
      profile.expiresAt <= Date.now()
    ) {
      return null;
    }
    return profile;
  } catch {
    return null;
  }
}

export async function getGoogleRegistrationProfile() {
  const cookieStore = await cookies();
  return verifyGoogleRegistrationTicket(cookieStore.get(GOOGLE_REGISTRATION_COOKIE)?.value);
}

export async function clearGoogleRegistrationTicket() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: GOOGLE_REGISTRATION_COOKIE, path: GOOGLE_REGISTRATION_COOKIE_PATH });
}
