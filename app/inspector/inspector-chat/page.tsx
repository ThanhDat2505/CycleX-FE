import { Suspense } from "react";
import InspectorChat from "@/app/components/inspector/InspectorChat";

export default function InspectorChatPage() {
  return (
    <Suspense fallback={<div className="chat-page-container">Đang tải...</div>}>
      <div className="chat-page-container">
        <InspectorChat />
      </div>
    </Suspense>
  );
}
