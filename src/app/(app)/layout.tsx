import { AppHeader } from "@/components/app/app-header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-background overflow-auto">
        {children}
      </main>
    </div>
  );
}
