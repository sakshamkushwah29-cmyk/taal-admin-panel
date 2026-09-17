"use client";

import ROUTE_PATH from "@/libs/route-path";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";  
import useAxios from "@/hooks/useAxios";
import axiosInstance from "@/utils/axiosInstance";

const AuthContext = createContext();

export const useAuthUser = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false)
  ;
  
  const [progress, setProgress] = useState(10);
 
  useEffect(() => {
    let storedUser = localStorage.getItem("authUser");

     let interval = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + 15 : prev)); // ✅ Faster increment
    }, 100);

    setTimeout(() => {
      if (storedUser) {
        setAuthUser(JSON.parse(storedUser));
      }
      setIsAuthLoaded(true);
      clearInterval(interval);
      setProgress(100);
    }, 800); // ✅ Reduced delay for faster load
  }, []);

   const login = async (response) => {
    let { token, user } = response;
    const userData = {
      user: user,
      isAuthenticated: true,
      token: token,
      role: user.role,
    };

    setAuthUser(userData);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

   const logout = async () => {
     if (authUser?.role === "pharmacy" || authUser?.role === "pathology") {
      try {
        await axiosInstance.put(
          authUser.role === "pharmacy"
            ? "/pharmacy/change-availability-status"
            : "/pathology/change-path-availability-status",
          { availabilityStatus: "unavailable" },
          {
            headers: {
              Authorization: `${authUser.token}`,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
    setAuthUser(null);
    localStorage.removeItem("authUser");
    router.push(ROUTE_PATH.AUTH.LOGIN);
  };

  const updateUser = (user) => {
    setAuthUser((prev) => ({ ...prev, user }));
  };

  if (!isAuthLoaded) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-6 px-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-200 animate-pulse">
          Please Wait...
        </h2>

        <Progress
          value={progress}
          className="w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] h-3 md:h-4 rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300"
        />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ authUser, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
