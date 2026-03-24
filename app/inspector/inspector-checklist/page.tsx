import InspectorGuard from "../InspectorGuard";
import { Suspense } from "react";
import InspectorChecklist from "@/app/components/inspector/InspectorChecklist";

export const metadata = {
  title: "CycleX - Perform Inspection",
};

export default function InspectorChecklistPage() {
  return (
    <InspectorGuard>
      <Suspense fallback={<div>Đang tải...</div>}>
        <InspectorChecklist />
      </Suspense>
    </InspectorGuard>
  );
}
