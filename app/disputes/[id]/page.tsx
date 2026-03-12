"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, LoadingSpinner } from "@/app/components/ui";
import { Dispute } from "@/app/types/dispute";
import { getDisputeById } from "@/app/services/buyerDisputeService";
import { useToast } from "@/app/contexts/ToastContext";
import { formatDate } from "@/app/utils/format";

export default function DisputeResultPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const disputeId = Number(params.id);

  useEffect(() => {
    async function fetchDispute() {
      if (isNaN(disputeId)) {
        setError("Mã khiếu nại không hợp lệ.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getDisputeById(disputeId);
        setDispute(data);
      } catch (err: any) {
        setError(err.message || "Không tìm thấy thông tin khiếu nại.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDispute();
  }, [disputeId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-500 font-bold animate-pulse uppercase tracking-wider text-xs">
          Đang tải kết quả khiếu nại...
        </p>
      </div>
    );
  }

  if (error || !dispute) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center animate-scale-in border border-gray-100">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-600">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
            Lỗi truy cập
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            {error ||
              "Khiếu nại này không tồn tại hoặc bạn không có quyền truy cập."}
          </p>
          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
              className="w-full py-4 rounded-2xl font-bold shadow-lg shadow-orange-100"
            >
              Thử lại
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/transactions")}
              className="w-full py-4 rounded-2xl font-bold border-gray-200 text-gray-500"
            >
              Quay lại giao dịch
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isSolved = dispute.status === "SOLVED";
  const isRejected = dispute.status === "REJECTED";
  const isPending = dispute.status === "PENDING";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Header Navigation */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors mb-8 font-bold text-sm uppercase tracking-widest"
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Quay lại
        </button>

        {/* Status Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div
            className={`p-8 text-center ${
              isSolved
                ? "bg-green-50"
                : isRejected
                  ? "bg-red-50"
                  : "bg-orange-50"
            }`}
          >
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm ${
                isSolved
                  ? "bg-green-100 text-green-600"
                  : isRejected
                    ? "bg-red-100 text-red-600"
                    : "bg-orange-100 text-brand-primary"
              }`}
            >
              {isSolved ? (
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : isRejected ? (
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            <h1
              className={`text-3xl font-black tracking-tight mb-2 ${
                isSolved
                  ? "text-green-900"
                  : isRejected
                    ? "text-red-900"
                    : "text-orange-900"
              }`}
            >
              {isSolved
                ? "Khiếu nại được chấp nhận"
                : isRejected
                  ? "Khiếu nại bị từ chối"
                  : "Đang chờ giải quyết"}
            </h1>
            <p
              className={`text-sm font-bold uppercase tracking-widest opacity-70 ${
                isSolved
                  ? "text-green-700"
                  : isRejected
                    ? "text-red-700"
                    : "text-orange-700"
              }`}
            >
              Mã khiếu nại: #{dispute.disputeId}
            </p>
          </div>

          {/* Admin Result Note */}
          {(isSolved || isRejected) && dispute.adminNote && (
            <div className="p-8 bg-white border-t border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-brand-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest">
                  Quyết định từ CycleX
                </h4>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <p className="text-gray-700 leading-relaxed font-medium">
                  {dispute.adminNote}
                </p>
                {dispute.resolvedAt && (
                  <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                    Giải quyết lúc: {formatDate(dispute.resolvedAt)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dispute Details Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 space-y-8">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {dispute.title}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
                  {dispute.reason}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-tighter">
                  Gửi lúc: {formatDate(dispute.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Đơn hàng
                </p>
                <p className="text-sm font-black text-gray-900 leading-tight">
                  #{dispute.orderId}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest">
                Nội dung chi tiết
              </h4>
            </div>
            <p className="text-gray-600 leading-relaxed font-medium bg-gray-50/50 p-6 rounded-2xl border border-gray-50 italic">
              &quot;{dispute.content}&quot;
            </p>
          </div>

          {/* Evidence */}
          {dispute.evidenceUrls && dispute.evidenceUrls.length > 0 && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest">
                  Bằng chứng hình ảnh
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {dispute.evidenceUrls.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm hover:shadow-md transition-all group"
                  >
                    <img
                      src={url}
                      alt={`Evidence ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center space-y-6">
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em] max-w-sm mx-auto leading-loose">
            CycleX đảm bảo tính minh bạch và công bằng cho mọi giao dịch. Quyết
            định của Ban quản trị là quyết định cuối cùng.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="rounded-2xl px-8 border-gray-200 text-gray-500 hover:bg-white hover:shadow-md transition-all"
            >
              Về Trang Chủ
            </Button>
            <Button
              variant="primary"
              onClick={() => router.push("/transactions")}
              className="rounded-2xl px-8 shadow-lg shadow-orange-100"
            >
              Xem Lịch Sử Giao Dịch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
