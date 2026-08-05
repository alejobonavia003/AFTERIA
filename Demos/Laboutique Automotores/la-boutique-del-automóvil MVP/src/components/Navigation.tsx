import React from 'react';
import {
  LayoutDashboard,
  FileCheck2,
  FileText,
  CreditCard,
  Wallet,
  Users,
  Settings
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'remitos'
  | 'presupuestos'
  | 'cobranzas'
  | 'cajabanco'
  | 'clientes'
  | 'configuracion';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  deudoresCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  deudoresCount
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Tablero & Métricas',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'remitos',
      label: 'Remitos / O.T.',
      icon: <FileCheck2 className="w-4 h-4" />
    },
    {
      id: 'presupuestos',
      label: 'Presupuestos',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: 'cobranzas',
      label: 'Cobranzas & Cta Cte',
      icon: <CreditCard className="w-4 h-4" />,
      badge: deudoresCount > 0 ? deudoresCount : undefined
    },
    {
      id: 'cajabanco',
      label: 'Libro Caja / Banco',
      icon: <Wallet className="w-4 h-4" />
    },
    {
      id: 'clientes',
      label: 'Clientes & Vehículos',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'configuracion',
      label: 'Tarifario & Ajustes',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 text-zinc-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto no-scrollbar py-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-zinc-950 font-extrabold shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold font-mono ${
                      isActive ? 'bg-zinc-950 text-amber-400' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
