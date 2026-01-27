import DashboardClient from "./DashboardClient";
import { mockListings } from "./mockListings";

export default function DashboardScreen() {
  return <DashboardClient listings={mockListings} />;
}
