import { LoginForm } from "@/components/platform/auth/LoginForm";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getSessionUser()) redirect("/dashboard");
  const { error } = await searchParams;
  return <LoginForm googleError={error} />;
}
