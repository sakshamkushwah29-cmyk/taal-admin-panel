"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { SECTION_DEFAULT_PATH, sectionOfPath } from "@/libs/admin-mode";

const AdminModeContext = createContext(null);

export const useAdminMode = () => useContext(AdminModeContext);

export function AdminModeProvider({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mode, setMode] = useState("ecommerce");

  // Keep mode in sync with the current route, falling back to saved preference.
  useEffect(() => {
    const pathSection = sectionOfPath(pathname);
    if (pathSection) {
      setMode(pathSection);
      localStorage.setItem("adminPanelMode", pathSection);
      return;
    }
    const saved = localStorage.getItem("adminPanelMode");
    if (saved === "events" || saved === "ecommerce") setMode(saved);
  }, [pathname]);

  const changeMode = useCallback(
    (nextMode) => {
      if (nextMode !== "events" && nextMode !== "ecommerce") return;
      setMode(nextMode);
      localStorage.setItem("adminPanelMode", nextMode);
      const current = sectionOfPath(pathname);
      if (current && current !== nextMode) {
        router.push(SECTION_DEFAULT_PATH[nextMode]);
      }
    },
    [pathname, router]
  );

  return (
    <AdminModeContext.Provider value={{ mode, changeMode }}>
      {children}
    </AdminModeContext.Provider>
  );
}
