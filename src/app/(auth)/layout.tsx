import { Icons } from '@/components/icons';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center space-x-2 text-primary hover:opacity-80 transition-opacity">
          <Icons.Logo className="h-8 w-8" />
          <span className="font-bold text-xl font-headline">Polimik Gestion</span>
        </Link>
      </div>
      {children}
      <footer className="absolute bottom-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Polimik Gestion. Tous droits réservés.
      </footer>
    </div>
  );
}
