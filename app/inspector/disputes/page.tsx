"use client";

import InspectorGuard from "../InspectorGuard";
import DisputeListClient from "@/app/components/inspector/DisputeListClient";
import InspectorHeroLayout from "@/app/components/inspector/InspectorHeroLayout";
import "@/app/components/inspector/inspector.css";

export default function DisputeListPage() {
  return (
    <InspectorGuard>
      <InspectorHeroLayout
        title="Danh Sách"
        highlightTitle="Tranh Chấp"
        description="Quản lý và xử lý các tranh chấp giữa người mua và người bán."
      >
        <DisputeListClient />
      </InspectorHeroLayout>
    </InspectorGuard>
  );
}
