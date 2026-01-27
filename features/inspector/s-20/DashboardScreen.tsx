import DashboardClient from "./DashboardClient";
import { mockListings } from "./mockListings";

export default function DashboardScreen() {
  return (
    <div className="content-container">
      <DashboardClient listings={mockListings} />
    </div>
  );
}
