
"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
       <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full bg-muted" />
          <Skeleton className="h-8 w-3/4 bg-muted" />
          <Skeleton className="h-8 w-1/2 bg-muted" />
       </div>
    </div>
  );
}
