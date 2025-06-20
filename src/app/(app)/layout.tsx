
"use client";

// HSL CSS variables for primary and primary-foreground are now set on documentElement by RootLayout
// and Tailwind's bg-primary/text-primary-foreground classes will use them.

export default function AppPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto relative w-full bg-primary text-primary-foreground"
    >
      {children}
    </main>
  );
}
