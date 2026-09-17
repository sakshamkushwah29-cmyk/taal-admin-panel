"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
 import { z } from "zod";
import { useRouter, usePathname, useParams } from "next/navigation";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import Link from "next/link";
import ROUTE_PATH from "@/libs/route-path";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";   
import { zodResolver } from "@hookform/resolvers/zod";


const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const router = useRouter();
  const pathname = usePathname();
  const resetToken = pathname.split("/")[2]; 
const params = useParams()


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(resetPasswordSchema),
  });

  const { request: resetPasswordRequest, loading: resetPasswordLoading } =
    useAxios();

  const [showPassword, setShowPassword] = useState(false);  
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);  

  const handleResetPassword = async (payload) => {
    const { data, error } = await resetPasswordRequest({
      method: "PUT",
      url: "/superadmin/reset-password",
      payload: {password: payload.password, token: params.resetToken },
      authRequired: true,
      headers: {
        Authorization: `${params.resetToken}`,
      },
    });

    if (error) {
      showToast("error", error);
    } else {
      showToast("success", data.message);
      router.push(ROUTE_PATH.AUTH.LOGIN);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">
            Reset Password
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Enter your new password to reset your account.
          </p>
        </CardHeader>

        <CardContent>
          {!resetToken ? (
            <p className="text-center text-red-500 font-medium">
              Invalid or expired reset token.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit(handleResetPassword)}
              className="space-y-4"
            >
               <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Enter new password"
                        className="pr-10"
                      />
                    )}
                  />
                   <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 dark:text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
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

               <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Controller
                    name="confirmPassword"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="Confirm new password"
                        className="pr-10"
                      />
                    )}
                  />
                   <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 dark:text-gray-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

               <Button
                type="submit"
                className="w-full"
               disabled={resetPasswordLoading}
              >
               {resetPasswordLoading ? "Resetting..." : "Reset Password"} 
               </Button>
            </form>
          )}

          {/* Back to Login */}
          <p className="text-sm text-center text-muted-foreground mt-4">
            Remembered your password?{" "}
            <Link
              href={ROUTE_PATH.AUTH.LOGIN}
              className="text-blue-600 hover:underline"
            >
              Go back to login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
