import Link from "next/link";
import AvatarDropdown from "@/components/_ui/avatar-dropdown";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";

 export default function AppNavbar({
  logoHref,
  StatusComponent,
  statusProps,
  children,
}) {
  const router = useRouter();
  const { authUser } = useAuthUser();
  const { notifications } = useNotifications();
  const role = authUser?.role;
  const unreadCount = notifications.filter(n => n.status === "unread").length;

  console.log("Notifications from app navbar======================",notifications)

  const handleClick = () => {
    if (!role) return;
    if (role === "superadmin") {
      router.push("/admin/notifications");
    } else if (role === "event_manager") {
      router.push("/event-manager/notifications");
    } else if (role === "gatekeeper") {
      router.push("/gatekeeper/notifications");
    } else {
      router.push("/unauthorized"); 
    }
  };

  return (
    <header className="sticky top-0 z-[50] bg-card rounded-2xl shadow-lg m-5 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href={logoHref} className="font-bold cursor-pointer">
          <img src="/fulllogo.png" alt="Logo" className="h-14 w-20" />
        </Link>
        {children}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleClick}
          className="relative p-2 rounded-full hover:bg-accent transition focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="w-6 h-6 cursor-pointer text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-[1.25rem] px-1 text-xs font-semibold text-white bg-red-500 rounded-full flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        {StatusComponent && <StatusComponent {...statusProps} />}
        <AvatarDropdown />
      </div>
    </header>
  );
} 