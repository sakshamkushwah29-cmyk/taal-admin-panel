"use client";

import { FiUser, FiLock, FiChevronDown } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/_ui/logout";
import { useAuthUser } from "@/contexts/AuthContext";

export default function AvatarDropdown() {
  const { authUser } = useAuthUser();

  const user = authUser?.user;
  const userName = user?.name ?? "User";
  const userEmail = user?.email ?? "Not Available";
  const userRole = user?.role ?? "User";
  const userInitial = userName?.charAt(0).toUpperCase() ?? "U";
  const avatarUrl = user?.avatar;

  if (!user) return null; // Optionally show a skeleton or fallback


  console.log(authUser, "useAuthUser");

  return (
    <DropdownMenu>
      {/* Avatar Button */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
        >
          {/* {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="User Avatar"
              width={36}
              height={36}
              className="rounded-full border-2 border-border object-cover"
            />
          ) : (
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold">
              {userInitial}
            </div>
          )} */}
          <span className="hidden sm:block text-sm font-medium truncate max-w-[120px]">
            {userName}
          </span>
          <FiChevronDown className="text-lg" />
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown Menu */}
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-4 py-3 border-b">
          <p className="text-sm font-semibold truncate">{userName}</p>
          <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
        </div>

        <DropdownMenuItem asChild>
          <Link
            href={userRole === "superadmin" ? "/admin/view-profile" : userRole === "pharmacy" ? "/pharmacy/view-profile" : userRole === "pathology" ? "/pathology/view-profile" : "/unauthorized"}
            className="flex items-center gap-3 w-full"
          >
            <FiUser className="text-lg" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href={userRole === "superadmin" ? "/admin/change-password" : userRole === "pharmacy" ? "/pharmacy/change-password" : userRole === "pathology" ?  "/pathology/change-password" : "/unauthorized"}
            className="flex items-center gap-3 w-full"
          >
            <FiLock className="text-lg" />
            Change Password
          </Link>
        </DropdownMenuItem>

        <div className="border-t my-2" />

        <DropdownMenuItem asChild>
          <LogoutButton className="w-full flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-all cursor-pointer" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
