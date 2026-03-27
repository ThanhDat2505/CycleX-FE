"use client";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function InspectorGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      // TODO: Enable validation lại khi cần
      // Nếu chưa đăng nhập hoặc không phải inspector thì redirect
      // if (!user || user.role !== "INSPECTOR") {
      //   router.replace("/login?redirect=" + encodeURIComponent(pathname));
      // }
    }
  }, [user, isLoading, router, pathname]);

  // TODO: Enable validation lại khi cần
  // if (isLoading || !user || user.role !== "INSPECTOR") {
  //   return null;
  // }
  return <>{children}</>;
}
