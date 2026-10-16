import { LoginForm } from "@/components/platform/auth/LoginForm";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; email?: string }>;
}) {
  if (await getSessionUser()) redirect("/dashboard");
  const { error, email } = await searchParams;
  return <LoginForm googleError={error} initialEmail={email} />;
}
