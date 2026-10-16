import { SignupForm } from "@/components/platform/auth/SignupForm";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getSessionUser()) redirect("/dashboard");
  const { error } = await searchParams;
  return <SignupForm googleError={error} />;
}
