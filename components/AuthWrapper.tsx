"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem("isLoggedIn");
    
    if (authStatus === "true") {
      setIsAuthenticated(true);
      if (pathname === "/login") {
        router.push("/");
      }
    } else {
      setIsAuthenticated(false);
      if (pathname !== "/login") {
        router.push("/login");
      }
    }
  }, [pathname, router]);

  // Prevent flicker by showing nothing until auth check is done
  if (isAuthenticated === null && pathname !== "/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
