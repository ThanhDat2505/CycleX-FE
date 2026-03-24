import BuyerDisputeListClient from "@/app/components/buyer/BuyerDisputeListClient";
import "@/app/components/inspector/inspector.css";

export default function BuyerDisputesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              Danh Sách <span className="text-[#FF8A00]">Khiếu Nại</span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl">
              Quản lý các khiếu nại của bạn và theo dõi tiến trình xử lý.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <BuyerDisputeListClient />
    </div>
  );
}
