import InspectorGuard from "../InspectorGuard";
import Link from "next/link";

export const metadata = {
  title: "CycleX - Inspector Chat (Upcoming)",
};

export default function InspectorChatPage() {
  return (
    <InspectorGuard>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-widest mb-4">
            Upcoming Feature
          </span>
          <h1 className="text-3xl font-black text-gray-800 mb-2">
            Inspector Chat sẽ sớm ra mắt!
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Tính năng chat giữa Inspector và Seller sẽ được cập nhật trong các
            phiên bản tiếp theo. Vui lòng quay lại Dashboard để tiếp tục kiểm
            định.
          </p>
        </div>
        <Link
          href="/inspector/dashboard"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow hover:bg-blue-700 transition"
        >
          Quay lại Dashboard
        </Link>
      </div>
    </InspectorGuard>
  );
}
