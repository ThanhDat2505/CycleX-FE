import InspectorGuard from "../InspectorGuard";
import { Suspense } from "react";
import InspectorRequestDetail from "@/app/components/inspector/InspectorRequestDetail";

export default function Page() {
  return (
    <InspectorGuard>
      <Suspense fallback={<div>Đang tải...</div>}>
        <InspectorRequestDetail />
      </Suspense>
    </InspectorGuard>
  );
}
