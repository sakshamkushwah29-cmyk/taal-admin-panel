"use client";

import { useAuthUser } from "@/contexts/AuthContext";

/**
 * Custom hook to handle logout functionality
 */
export function useLogout() {
  const { logout } = useAuthUser();

  // Return the logout function for reuse
  return { handleLogout: logout };
}
