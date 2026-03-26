"use client";

import React, { useEffect } from "react";
import AdminDisputeListClient from "@/app/components/admin/AdminDisputeListClient";
import "@/app/components/inspector/inspector.css";

export default function AdminDisputesPage() {
  useEffect(() => {
    document.title = "Disputes | CycleX Admin";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full px-4 py-1.5 mb-4">
              <span className="text-brand-primary text-xs animate-pulse">
                ●
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-primary">
                Quản trị hệ thống CycleX
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              Quản Lý <span className="text-[#FF8A00]">Khiếu Nại</span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl">
              Theo dõi và quản lý toàn bộ khiếu nại trên hệ thống.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <AdminDisputeListClient />
    </div>
  );
}
