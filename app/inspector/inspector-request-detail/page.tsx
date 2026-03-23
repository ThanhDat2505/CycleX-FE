import { Suspense } from "react";
import InspectorRequestDetail from "@/app/components/inspector/InspectorRequestDetail";

export default function Page() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <InspectorRequestDetail />
    </Suspense>
  );
}
