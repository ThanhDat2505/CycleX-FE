import ReviewRequiredList from "@/app/components/inspector/ReviewRequiredList";
import InspectorNav from "@/app/components/inspector/InspectorNav";
import "@/app/components/inspector/inspector.css";

export const metadata = {
  title: "CycleX - Review Required",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <InspectorNav />
      <div className="container mx-auto px-6 md:px-12 lg:px-20 py-8">
        <ReviewRequiredList />
      </div>
    </div>
  );
}
