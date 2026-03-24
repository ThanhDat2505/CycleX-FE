import DisputeDetailClient from "@/app/components/inspector/DisputeDetailClient";
import "@/app/components/inspector/inspector.css";
import Link from "next/link";

export const metadata = {
  title: "CycleX - Chi Tiết Khiếu Nại (Admin)",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminDisputeDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <div className="min-h-screen bg-white">
      {/* Admin back nav */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/admin/disputes"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF8A00] transition-colors"
          >
            ← Quay lại Quản Lý Khiếu Nại
          </Link>
        </div>
      </div>
      <DisputeDetailClient disputeId={resolvedParams.id} viewerRole="ADMIN" />
    </div>
  );
}
