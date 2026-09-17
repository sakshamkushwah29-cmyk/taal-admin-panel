import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/_ui/toast-utils";
import ProtectedRoute from "@/components/common/ProtectedRoute";
// import NotificationListener from "@/components/common/NotificationListner";
import  socket from "@/services/socket";
import { NotificationProvider } from "@/contexts/NotificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Taal Admin",
  description: "Short description",
  icons: {
    icon: "/favicon.ico", 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <NotificationProvider>
          <ToastProvider>
            <ProtectedRoute>
              {children}
            </ProtectedRoute>
          </ToastProvider>
          </NotificationProvider>
        </AuthProvider>

      </body>
    </html>
  );
}
