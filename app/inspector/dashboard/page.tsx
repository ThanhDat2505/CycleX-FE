import InspectorGuard from "../InspectorGuard";
import DashboardClient from "@/app/components/inspector/DashboardClient";
import "@/app/components/inspector/inspector.css";

export default function Page() {
  return (
    <InspectorGuard>
      <div className="min-h-screen bg-gray-50">
        <DashboardClient />
      </div>
    </InspectorGuard>
  );
}
