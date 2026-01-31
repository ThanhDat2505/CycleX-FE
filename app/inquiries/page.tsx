// app/inquiries/page.tsx
"use client";

import React from "react";

const InquiriesPage: React.FC = () => {
  // Mock data
  const userInquiries = [
    {
      id: 1,
      bikeTitle: "Giant Escape 3",
      message: "Is this bike still available?",
      status: "NEW",
      createdDate: new Date().toISOString(),
    },
    {
      id: 2,
      bikeTitle: "Trek FX 2",
      message: "What's the condition of the bike?",
      status: "REPLIED",
      createdDate: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const newCount = userInquiries.filter((i) => i.status === "NEW").length;
  const avgResponseTime = "12 hours";

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Inquiries</h1>
      <p className="text-gray-600 mb-8">Manage buyer inquiries and messages</p>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold mb-2">
            Total Inquiries
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {userInquiries.length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold mb-2">
            Awaiting Response
          </p>
          <p className="text-3xl font-bold text-orange-600">{newCount}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold mb-2">
            Avg Response Time
          </p>
          <p className="text-3xl font-bold text-gray-900">{avgResponseTime}</p>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Inquiries</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {userInquiries.map((inquiry) => {
            return (
              <div key={inquiry.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Inquiry on {inquiry.bikeTitle}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          inquiry.status === "NEW"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{inquiry.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(inquiry.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                  {inquiry.status === "NEW" && (
                    <button className="px-4 py-2 bg-[#FF8A00] text-white rounded-lg font-medium hover:bg-[#FF7A00] transition">
                      Reply
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InquiriesPage;
