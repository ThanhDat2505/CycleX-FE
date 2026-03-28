// app/inquiries/page.tsx
"use client";

import React from "react";

const InquiriesPage: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Yêu Cầu Hỏi Mua</h1>
      <p className="text-gray-600 mb-8">
        Quản lý tin nhắn và câu hỏi từ người mua
      </p>

      <div className="bg-white rounded-lg border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
        <p className="text-gray-400 text-lg font-medium mb-2">
          Chưa có yêu cầu hỏi mua nào
        </p>
        <p className="text-gray-400 text-sm">
          Các câu hỏi từ người mua sẽ xuất hiện tại đây.
        </p>
      </div>
    </div>
  );
};

export default InquiriesPage;
