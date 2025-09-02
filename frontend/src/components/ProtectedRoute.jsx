"use client";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.userType)) {
        // Redirect to appropriate dashboard based on user type
        switch (user.userType) {
          case "patient":
            router.push("/dashboard/patient");
            break;
          case "doctor":
            router.push("/dashboard/doctor");
            break;
          case "admin":
            router.push("/dashboard/admin");
            break;
          default:
            router.push("/auth/login");
        }
        return;
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.userType)) {
    return null;
  }

  return children;
}
