import React from 'react';
import { BrandLogo } from './BrandLogo';
import {
  Search,
  PlusCircle,
  FileSpreadsheet,
  AlertCircle,
  Wrench,
  DollarSign
} from 'lucide-react';
import { formatPesos } from '../utils/calculations';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onOpenNuevoRemito: () => void;
  onExportExcel: () => void;
  totalDeudaClientes: number;
  totalDeudoresCount: number;
  remitosMesCount: number;
  saldoTallerTotal: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  onOpenNuevoRemito,
  onExportExcel,
  totalDeudaClientes,
  totalDeudoresCount,
  remitosMesCount,
  saldoTallerTotal
}) => {
  return (
    <header className="bg-zinc-950 text-white border-b border-zinc-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Logo & Main Title */}
          <div className="flex items-center justify-between">
            <BrandLogo variant="light" size="md" showSubtext={true} />
            <div className="lg:hidden">
              <button
                onClick={onOpenNuevoRemito}
                className="p-2 bg-amber-500 text-zinc-950 font-bold rounded-lg flex items-center gap-1 text-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nuevo</span>
              </button>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-md mx-auto lg:mx-0 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar por Cliente, Patente (AB123CD), Remito Nº..."
                className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/80 focus:border-amber-500"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Badges & Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 text-xs">
            
            {/* Metric Badge: Deuda Total */}
            <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-[10px] text-zinc-400 font-medium leading-none">Deuda Activa Clientes</p>
                <p className="font-bold text-amber-300 font-mono mt-0.5">
                  {formatPesos(totalDeudaClientes)}{' '}
                  <span className="text-[10px] text-zinc-400 font-sans">({totalDeudoresCount})</span>
                </p>
              </div>
            </div>

            {/* Metric Badge: Saldo Taller */}
            <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
              <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] text-zinc-400 font-medium leading-none">Saldo Caja/Banco Taller</p>
                <p className="font-bold text-emerald-300 font-mono mt-0.5">
                  {formatPesos(saldoTallerTotal)}
                </p>
              </div>
            </div>

            {/* Action: Excel Export Button */}
            <button
              onClick={onExportExcel}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-700"
              title="Descargar Excel completo de gestión y métricas"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Exportar Excel</span>
            </button>

            {/* Action: New Remito Button */}
            <button
              onClick={onOpenNuevoRemito}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Nuevo Remito</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
