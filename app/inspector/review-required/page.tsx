"use client";

import ReviewRequiredList from "@/app/components/inspector/ReviewRequiredList";
import InspectorHeroLayout from "@/app/components/inspector/InspectorHeroLayout";
import "@/app/components/inspector/inspector.css";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <InspectorHeroLayout
        title="Tin Cần"
        highlightTitle="Xem Xét"
        description="Các tin đăng đang trong quá trình xem xét, cần hành động từ bạn."
      >
        <ReviewRequiredList />
      </InspectorHeroLayout>
    </div>
  );
}
