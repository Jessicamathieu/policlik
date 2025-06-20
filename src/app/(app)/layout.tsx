
"use client";

import { useState, useEffect } from 'react';

export default function AppPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main
      className={`flex-1 p-4 sm:p-6 md:p-8 overflow-auto relative w-full ${
        isClient ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'
      }`}
    >
      {children}
    </main>
  );
}
