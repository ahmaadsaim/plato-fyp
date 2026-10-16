import { ProcessingScreen } from "@/components/ui/ProcessingScreen";

export default function DashboardLoading() {
  return (
    <ProcessingScreen
      title="Preparing your dashboard"
      description="Your account is ready. We’re connecting your workspace and loading your stores."
    />
  );
}
