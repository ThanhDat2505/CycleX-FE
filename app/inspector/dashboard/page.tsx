import DashboardClient from "@/app/components/inspector/DashboardClient";
import { mockListings } from "@/app/mocks/inspector/mockListings";

export default function Page() {
  return (
    <div className="content-container">
      <DashboardClient listings={mockListings} />
    </div>
  );
}
