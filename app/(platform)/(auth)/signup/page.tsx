import { SignupForm } from "@/components/platform/auth/SignupForm";
import { getSessionUser } from "@/lib/auth";
import { getGoogleRegistrationProfile } from "@/lib/auth/google-registration";
import { redirect } from "next/navigation";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; google?: string }>;
}) {
  if (await getSessionUser()) redirect("/dashboard");
  const { error, google } = await searchParams;
  const googleRegistration = google === "1" ? await getGoogleRegistrationProfile() : null;
  const googleError = error ?? (google === "1" && !googleRegistration ? "google_registration_expired" : undefined);
  return <SignupForm googleError={googleError} googleRegistration={googleRegistration ?? undefined} />;
}
