import type { ReactNode } from "react";
import Sidebar from "@/features/inspector/shared/Sidebar";

export default function InspectorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}
