import InspectorNav from "@/app/components/inspector/InspectorNav";
import DisputeDetailClient from "@/app/components/inspector/DisputeDetailClient";
import "@/app/components/inspector/inspector.css";

export const metadata = {
  title: "CycleX - Dispute Detail",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DisputeDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <div className="min-h-screen bg-white">
      <InspectorNav />
      <DisputeDetailClient disputeId={resolvedParams.id} />
    </div>
  );
}
