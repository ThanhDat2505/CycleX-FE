import InspectorGuard from "../InspectorGuard";
import { Suspense } from "react";
import InspectorChat from "@/app/components/inspector/InspectorChat";

export default function InspectorChatPage() {
  // ĐÃ ẨN PHẦN CHAT: InspectorChat (ẩn theo yêu cầu, muốn bật lại chỉ cần bỏ comment dưới)
  return (
    <InspectorGuard>
      <Suspense
        fallback={<div className="chat-page-container">Đang tải...</div>}
      >
        <div className="chat-page-container">
          {/* CHAT: InspectorChat đã bị ẩn ở đây. Muốn bật lại, bỏ comment dòng dưới */}
          {/* <InspectorChat /> */}
        </div>
      </Suspense>
    </InspectorGuard>
  );
}
