
"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4 bg-muted" />
          <Skeleton className="h-4 w-1/2 bg-muted" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
            <Skeleton className="h-24 bg-muted" />
            <Skeleton className="h-24 bg-muted" />
            <Skeleton className="h-24 bg-muted" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null; // Le useEffect ci-dessus gérera la redirection
  }
  
  return (
    <main
      className="flex-1 overflow-auto bg-background text-foreground"
    >
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 overflow-x-hidden">
        {children}
      </div>
    </main>
  );
}
