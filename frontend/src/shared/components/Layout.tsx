import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, Settings, History, ParkingCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/movimentacoes', label: 'Movimentações', icon: Car },
  { href: '/historico', label: 'Histórico', icon: History },
  { href: '/gestao', label: 'Gestão', icon: Settings },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
        <div className="flex h-full flex-col">
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
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

