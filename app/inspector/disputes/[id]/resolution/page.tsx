import InspectorNav from "@/app/components/inspector/InspectorNav";
import DisputeResolutionClient from "@/app/components/inspector/DisputeResolutionClient";
import "@/app/components/inspector/inspector.css";

export const metadata = {
  title: "CycleX - Dispute Resolution",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DisputeResolutionPage({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <InspectorNav />
      <DisputeResolutionClient disputeId={resolvedParams.id} />
    </div>
  );
}
