import InspectorNav from "@/app/components/inspector/InspectorNav";
import DisputeListClient from "@/app/components/inspector/DisputeListClient";
import "@/app/components/inspector/inspector.css";

export const metadata = {
  title: "CycleX - Dispute List",
};

export default function DisputeListPage() {
  return (
    <div className="min-h-screen bg-white">
      <InspectorNav />
      <DisputeListClient />
    </div>
  );
}
