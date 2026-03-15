import React from "react";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      {/* Main Content Area - Renders exactly as provided */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
