import { AuthProcessingRedirect } from "@/components/platform/auth/AuthProcessingRedirect";

export default function GoogleAuthProcessingPage() {
  return (
    <AuthProcessingRedirect
      title="Google sign-in complete"
      description="Your account is connected. Preparing your Plato dashboard now."
      destination="/dashboard"
    />
  );
}
