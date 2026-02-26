import type { ReactNode } from "react";
import Sidebar from "@/app/components/inspector/Sidebar";
import "@/app/components/inspector/inspector.css";
type InspectorLayoutProps = {
  children: ReactNode;
};

export default function InspectorLayout({ children }: InspectorLayoutProps) {
  return (
    <div className="inspector-scope">
      <div className="dashboard-layout">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
