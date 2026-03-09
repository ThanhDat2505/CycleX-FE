import { Suspense } from "react";
import InspectorRequestDetail from "@/app/components/inspector/InspectorRequestDetail";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InspectorRequestDetail />
    </Suspense>
  );
}
