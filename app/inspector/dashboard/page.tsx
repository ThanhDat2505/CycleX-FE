import DashboardClient from "@/app/components/inspector/DashboardClient";
import InspectorNav from "@/app/components/inspector/InspectorNav";
import "@/app/components/inspector/inspector.css";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <InspectorNav />
      <div className="container mx-auto px-4 py-8">
        <DashboardClient />
      </div>
    </div>
  );
}
