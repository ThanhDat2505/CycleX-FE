import { Suspense } from "react";
import InspectorSummary from "@/app/components/inspector/InspectorSummary";

export const metadata = {
  title: "Inspection Summary - CycleX",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InspectorSummary />
    </Suspense>
  );
}
