"use client";

import React from "react";

export default function ReviewRequiredList() {
  return (
    <div className="page flex items-center justify-center" style={{ minHeight: "70vh" }}>
      <div className="text-center p-10 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto">
        <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl" style={{ fontSize: "40px" }}>construction</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Tính năng sắp ra mắt</h2>
      </div>
    </div>
  );
}
