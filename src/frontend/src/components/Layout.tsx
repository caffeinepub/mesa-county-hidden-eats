import { Outlet } from '@tanstack/react-router';
import { Utensils } from 'lucide-react';

export default function Layout() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'mesa-county-hidden-eats'
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-primary/20 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 shadow-sm">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary shadow-sm">
              <Utensils className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold leading-tight text-foreground tracking-tight">Mesa County</h1>
              <p className="text-xs text-muted-foreground leading-tight font-medium">Hidden Eats</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-primary/20 bg-muted/40 py-8 mt-12">
        <div className="container px-4">
          <div className="flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <p className="font-medium">
              © {currentYear} Mesa County Hidden Eats. Discover local flavors.
            </p>
            <p>
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
