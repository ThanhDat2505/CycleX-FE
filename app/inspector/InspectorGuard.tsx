"use client";
// import { useAuth } from "@/app/hooks/useAuth";
// import { useRouter, usePathname } from "next/navigation";
// import { useEffect } from "react";

// TODO: Bật lại validation khi cần thiết
export default function InspectorGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  // Tạm tắt validation đăng nhập để test
  return <>{children}</>;

  /* === VALIDATION GỐC (bật lại khi cần) ===
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== "INSPECTOR") {
        router.replace("/login?redirect=" + encodeURIComponent(pathname));
      }
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading || !user || user.role !== "INSPECTOR") {
    return null;
  }
  return <>{children}</>;
  === KẾT THÚC VALIDATION GỐC === */
}
