"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SellerNavContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const SellerNavContext = createContext<SellerNavContextType | undefined>(undefined);

export function SellerNavProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <SellerNavContext.Provider value={{ isSidebarOpen, toggleSidebar, closeSidebar }}>
      {children}
    </SellerNavContext.Provider>
  );
}

export function useSellerNav() {
  const context = useContext(SellerNavContext);
  if (context === undefined) {
    throw new Error("useSellerNav must be used within a SellerNavProvider");
  }
  return context;
}
