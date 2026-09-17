"use client";

import { useLogout } from "@/hooks/useLogout";
import { FiLogOut } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export default function LogoutButton({ className = "" }) {
  const { handleLogout } = useLogout();

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      className={`cursor-pointer w-full flex items-center gap-2 ${className}`}
      aria-label="Log out of your account"
    >
      <FiLogOut className="text-lg" />
      Logout
    </Button>
  );
}
