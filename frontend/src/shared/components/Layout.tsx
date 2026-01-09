import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, Settings, History, ParkingCircle, Menu } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/shared/ui/sheet';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/movimentacoes', label: 'Movimentações', icon: Car },
  { href: '/historico', label: 'Histórico', icon: History },
  { href: '/gestao', label: 'Gestão', icon: Settings },
];

function SidebarContent() {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <ParkingCircle className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">PARKIA</h1>
          <p className="text-xs text-muted-foreground">Estacionamento Inteligente</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn('nav-link', isActive && 'active')}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-muted p-4">
          <p className="text-xs text-muted-foreground">
            Sistema de Gestão
          </p>
          <p className="text-sm font-medium text-foreground">v1.0.0</p>
        </div>
      </div>
    </div>
  );
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2 mr-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-r">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <ParkingCircle className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">PARKIA</span>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card md:block">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 min-h-[calc(100vh-4rem)] md:min-h-screen transition-all">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

