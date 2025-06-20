
"use client";

export default function AppPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto relative w-full bg-background text-foreground"
    >
      {children}
    </main>
  );
}
