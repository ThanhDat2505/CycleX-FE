// app/ratings/page.tsx
"use client";

import React from "react";

const RatingsPage: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Đánh Giá &amp; Nhận Xét
      </h1>
      <p className="text-gray-600 mb-8">
        Uy tín người bán và phản hồi từ khách hàng
      </p>

      <div className="bg-white rounded-lg border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
        <p className="text-gray-400 text-lg font-medium mb-2">
          Chưa có đánh giá nào
        </p>
        <p className="text-gray-400 text-sm">
          Các đánh giá từ khách hàng sẽ xuất hiện tại đây.
        </p>
      </div>
    </div>
  );
};

export default RatingsPage;
