"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/contexts/AuthContext";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
// import { enableFirebaseMessaging } from "@/services/enableNotification";
// import { useEffect } from "react";
// import { onMessage } from "@/services/firebase";
// import { messaging } from "../services/firebase";
// import GarbaDance from "@/components/common/GarbaDance";

// ✅ Form Validation Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const router = useRouter();
  const { login } = useAuthUser();
  const { request: loginRequest, loading: loginLoading } = useAxios();
  const [deviceToken, setDeviceToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notificationError, setNotificationError] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  //  const getFCMToken = async () => {
  //   const token = await enableFirebaseMessaging();
  //   console.log("FCM Token:", token);
  //   if (token) {
  //     setDeviceToken(token);
  //     setNotificationError(false);
  //   } else {
  //     setNotificationError(true);
  //   }
  // };

  // useEffect(() => {
  //   getFCMToken();
  // }, []);


  // const getCurrentPositionAsync = () => {
  //   return new Promise((resolve, reject) => {
  //     navigator.geolocation.getCurrentPosition(resolve, reject);
  //   });
  // };
  




  const handleLogin = async (formData) => {
    try { 
      //  if (!deviceToken) {
      //   showToast("error", "Notification permission not granted.");
      //   return;
      // }
  
      const fullPayload = {
        ...formData,
        // deviceToken,
      };  
      const { data, error } = await loginRequest({
        method: "POST",
        url: "/superadmin/login-admin",
        payload: fullPayload,
      });
  
      if (error) {
        showToast("error", error);
      } else {
        showToast("success", data.message);
        login(data.data);
        setIsLoggedIn(true); 
        const role = data?.data?.user?.role;
        if (role === "superadmin") {
          router.push("/admin");
        } else if (role === "event_manager") {
          router.push("/event-manager");
        } else if (role === "gatekeeper") {
          router.push("/gatekeeper");
        } else if (!role) {
          router.push("/");
        } else {
          showToast("error", "Unknown role");
        }
      }
    } catch (err) {
      console.warn("⚠️ Location failed or user denied:", err);
  
       const fallbackPayload = {
        ...formData,
        // deviceToken,
      };
  
      const { data, error: fallbackError } = await loginRequest({
        method: "POST",
        url: "/admin/admin-login",
        payload: fallbackPayload,
      });
  
      if (fallbackError) {
        showToast("error", fallbackError);
      } else {
        showToast("success", data.message);
        login(data.data);
        router.push("/admin");
      }
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Welcome Back</CardTitle>
          <p className="text-muted-foreground text-sm">
            Login to access your dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    disabled={loginLoading || isLoggedIn}  
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pr-10"
                      disabled={loginLoading || isLoggedIn}  
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 dark:text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loginLoading || isLoggedIn}  
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {notificationError && (
              <div className="mb-4 text-center">
                <p className="text-red-500 text-sm mb-2">
                  You have blocked notifications. Please enable notifications from your browser settings to continue.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.open('https://support.google.com/chrome/answer/3220216', '_blank')}
                  className="w-auto"
                >
                  How to enable notifications?
                </Button>
              </div>
            )}
            <Button type="submit" className="w-full cursor-pointer" loading={loginLoading} loadingText="Logging in...">
              Login
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Forgot Password?{" "}
              <Link
                href="/forget-password"
                className="text-blue-600 hover:underline"
              >
                Click Here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
