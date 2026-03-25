import DisputeResolutionClient from "@/app/components/inspector/DisputeResolutionClient";
import "@/app/components/inspector/inspector.css";
import Link from "next/link";

export const metadata = {
  title: "CycleX - Xử Lý Khiếu Nại (Admin)",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminDisputeResolutionPage({ params }: PageProps) {
  const resolvedParams = await params;
  const disputeId = resolvedParams.id;
  return (
    <div className="min-h-screen bg-white">
      {/* Admin back nav */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto">
          <Link
            href={`/admin/disputes/${disputeId}`}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF8A00] transition-colors"
          >
            ← Quay lại Chi Tiết Khiếu Nại
          </Link>
        </div>
      </div>
      <DisputeResolutionClient
        disputeId={disputeId}
        backPath={`/admin/disputes/${disputeId}`}
        successPath="/admin/disputes"
      />
    </div>
  );
}
