"use client";

import PendingListClient from "@/app/components/inspector/PendingListClient";
import InspectorHeroLayout from "@/app/components/inspector/InspectorHeroLayout";
import "@/app/components/inspector/inspector.css";

export default function Page() {
  return (
    <InspectorHeroLayout
      title="Tin Chờ"
      highlightTitle="Duyệt"
      description="Danh sách các tin đăng mới cần được kiểm định và phê duyệt."
    >
      <PendingListClient />
    </InspectorHeroLayout>
  );
}
