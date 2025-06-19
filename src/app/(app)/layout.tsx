
"use client";

// Les variables CSS globales --page-main-color et --page-main-contrast-color
// sont déjà définies sur documentElement par RootLayout.

export default function AppPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Ce main représente la zone de contenu pour les pages du groupe (app).
    // La structure externe (min-h-screen, flex-col) est gérée par le body de RootLayout.
    // AppHeader est déjà dans RootLayout.
    <main
      className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto relative w-full" // Assure qu'il prend toute la largeur dans son conteneur flex parent
      style={{
        backgroundColor: 'var(--page-main-color)',
        color: 'var(--page-main-contrast-color)',
      }}
    >
      {children}
    </main>
  );
}
