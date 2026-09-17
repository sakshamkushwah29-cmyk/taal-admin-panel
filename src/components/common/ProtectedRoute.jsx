"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuthUser } from "@/contexts/AuthContext";
import ROUTE_PATH from "@/libs/route-path";
import { useTitle } from "@/hooks/useTitle";

const publicRoutes = [
  ROUTE_PATH.AUTH.LOGIN,
  ROUTE_PATH.AUTH.FORGOT_PASSWORD,
  ROUTE_PATH.AUTH.RESET_PASSWORD,
];

export default function ProtectedRoute({ children }) {
  const { authUser } = useAuthUser();
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname, "pathname");

  // Auto update title
  useTitle();

  // Check if the pathname matches a public route or starts with the reset password route
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === ROUTE_PATH.AUTH.RESET_PASSWORD) {
      return pathname.startsWith("/reset-password/");
    }
    return route === pathname;
  });

  useEffect(() => {
    // Only protect routes that are not public
    if (!authUser?.isAuthenticated && !isPublicRoute) {
      router.replace(ROUTE_PATH.AUTH.LOGIN);
    }
  }, [authUser, pathname, isPublicRoute]);

  if (!authUser?.isAuthenticated && !isPublicRoute) {
    return null; // Or a loading spinner
  }

  return children;
}