import React, { useState } from 'react';
import {
  Wallet,
  Building2,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  FileSpreadsheet,
  Filter,
  DollarSign,
  UserCheck
} from 'lucide-react';
import {
  MovimientoCajaBanco,
  LibroContable,
  UnidadNegocio,
  MedioPago
} from '../types';
import { CATEGORIAS_GASTO } from '../data/initialSeedData';
import { formatPesos, formatFecha } from '../utils/calculations';
import { exportLibroCajaBancoExcel } from '../utils/excelExport';

interface CajaBancoModuleProps {
  movimientos: MovimientoCajaBanco[];
  searchTerm: string;
  onAddMovimiento: (mov: Omit<MovimientoCajaBanco, 'id' | 'saldo_acumulado'>) => void;
}

export const CajaBancoModule: React.FC<CajaBancoModuleProps> = ({
  movimientos,
  searchTerm,
  onAddMovimiento
}) => {
  const [activeLibro, setActiveLibro] = useState<LibroContable>('caja');
  const [unidadFilter, setUnidadFilter] = useState<'todos' | UnidadNegocio>('todos');
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [concepto, setConcepto] = useState<string>(CATEGORIAS_GASTO[0]);
  const [unidadNegocio, setUnidadNegocio] = useState<UnidadNegocio>('Taller');
  const [detalle, setDetalle] = useState('');
  const [proveedorEntidad, setProveedorEntidad] = useState('');
  const [tipoMov, setTipoMov] = useState<MedioPago>('Efectivo');
  const [tipoMonto, setTipoMonto] = useState<'ingreso' | 'egreso'>('egreso');
  const [monto, setMonto] = useState<number>(0);
  const [facturadoSAS, setFacturadoSAS] = useState(false);

  // Filtered movements
  const filtered = movimientos
    .filter((m) => m.libro === activeLibro)
    .filter((m) => unidadFilter === 'todos' || m.unidad_negocio === unidadFilter)
    .filter((m) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        m.concepto.toLowerCase().includes(term) ||
        (m.detalle || '').toLowerCase().includes(term) ||
        (m.proveedor || '').toLowerCase().includes(term)
      );
    });

  // Calculate Running Totals
  const totalIngresos = filtered.reduce((s, m) => s + (m.ingreso || 0), 0);
  const totalEgresos = filtered.reduce((s, m) => s + (m.egreso || 0), 0);
  const saldoActual = totalIngresos - totalEgresos;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (monto <= 0) return;

    onAddMovimiento({
      libro: activeLibro,
      fecha: new Date().toISOString().split('T')[0],
      concepto,
      unidad_negocio: unidadNegocio,
      detalle,
      proveedor: proveedorEntidad,
      tipo_movimiento: tipoMov,
      ingreso: tipoMonto === 'ingreso' ? monto : 0,
      egreso: tipoMonto === 'egreso' ? monto : 0,
      facturado_a_sas: facturadoSAS
    });

    setIsCreating(false);
    setMonto(0);
    setDetalle('');
    setProveedorEntidad('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-zinc-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-500" />
              Contabilidad: Libro Caja & Libro Banco
            </h2>
            <p className="text-xs text-zinc-500">
              Cálculo automático de saldos acumulados con clasificación rigurosa entre Taller y Gastos Personales del dueño.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => exportLibroCajaBancoExcel(movimientos, activeLibro)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar Libro {activeLibro.toUpperCase()}</span>
            </button>

            <button
              onClick={() => setIsCreating(!isCreating)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nuevo Movimiento</span>
            </button>
          </div>
        </div>

        {/* Ledger Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-zinc-100">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveLibro('caja')}
              className={`px-4 py-2 text-xs font-black rounded-lg flex items-center gap-2 cursor-pointer transition-all ${
                activeLibro === 'caja'
                  ? 'bg-amber-500 text-zinc-950 shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <Wallet className="w-4 h-4" />
              LIBRO CAJA (Efectivo)
            </button>

            <button
              onClick={() => setActiveLibro('banco')}
              className={`px-4 py-2 text-xs font-black rounded-lg flex items-center gap-2 cursor-pointer transition-all ${
                activeLibro === 'banco'
                  ? 'bg-amber-500 text-zinc-950 shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              LIBRO BANCO (Transferencias / Cheques)
            </button>
          </div>

          {/* Unidad de Negocio Filter */}
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-600">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrar Unidad:</span>
            <select
              value={unidadFilter}
              onChange={(e) => setUnidadFilter(e.target.value as any)}
              className="p-1.5 bg-zinc-50 border border-zinc-300 rounded font-bold text-zinc-800"
            >
              <option value="todos">Todos (Taller + Personal)</option>
              <option value="Taller">Taller Mecánico</option>
              <option value="Personal">Gastos Personales (Cristian B.)</option>
            </select>
          </div>
        </div>
      </div>

      {/* FORM */}
      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-amber-500 rounded-xl p-6 shadow-xl space-y-4">
          <h3 className="font-black text-sm text-zinc-900 uppercase tracking-wider">
            Nuevo Movimiento en Libro {activeLibro.toUpperCase()}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            
            {/* Tipo Monto */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Tipo Movimiento</label>
              <select
                value={tipoMonto}
                onChange={(e) => setTipoMonto(e.target.value as any)}
                className="w-full p-2 border border-zinc-300 rounded text-xs font-bold"
              >
                <option value="egreso">🔴 Egreso (Gasto / Pago)</option>
                <option value="ingreso">🟢 Ingreso (Cobro / Saldo)</option>
              </select>
            </div>

            {/* Categoría / Concepto */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Categoría / Concepto</label>
              <select
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
                className="w-full p-2 border border-zinc-300 rounded text-xs"
              >
                {CATEGORIAS_GASTO.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Unidad de Negocio */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Unidad de Negocio *</label>
              <select
                value={unidadNegocio}
                onChange={(e) => setUnidadNegocio(e.target.value as UnidadNegocio)}
                className="w-full p-2 border border-zinc-300 rounded text-xs font-bold text-purple-900 bg-purple-50"
              >
                <option value="Taller">Taller Mecánico</option>
                <option value="Personal">Personal (Dueño)</option>
              </select>
            </div>

            {/* Monto */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Monto ($) *</label>
              <input
                type="number"
                required
                value={monto}
                onChange={(e) => setMonto(Number(e.target.value))}
                className="w-full p-2 border border-zinc-300 rounded text-xs font-mono font-extrabold"
              />
            </div>

            {/* Detalle */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-zinc-700 mb-1">Detalle / Observación</label>
              <input
                type="text"
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
                placeholder="Ej: Nafta camioneta taller / Compra repuestos"
                className="w-full p-2 border border-zinc-300 rounded text-xs"
              />
            </div>

            {/* Proveedor / Entidad */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Proveedor / Entidad</label>
              <input
                type="text"
                value={proveedorEntidad}
                onChange={(e) => setProveedorEntidad(e.target.value)}
                placeholder="Ej: YPF / Repuestos Sur / Vea"
                className="w-full p-2 border border-zinc-300 rounded text-xs"
              />
            </div>

            {/* Facturado SAS checkbox */}
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="sas"
                checked={facturadoSAS}
                onChange={(e) => setFacturadoSAS(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded"
              />
              <label htmlFor="sas" className="text-xs font-bold text-zinc-800 cursor-pointer">
                Facturado a SAS
              </label>
            </div>

          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-zinc-200 text-zinc-800 text-xs font-bold rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-amber-500 text-zinc-950 font-black text-xs rounded"
            >
              Guardar Movimiento
            </button>
          </div>
        </form>
      )}

      {/* Movement Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 bg-zinc-900 text-white flex justify-between items-center">
          <span className="font-extrabold text-xs uppercase tracking-wider">
            Movimientos Registrados — Libro {activeLibro.toUpperCase()}
          </span>
          <span className="text-xs font-mono font-bold text-amber-400">
            SALDO ACUMULADO LIBRO: {formatPesos(saldoActual)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-100 text-zinc-700 font-bold border-b border-zinc-200">
                <th className="p-3">Fecha</th>
                <th className="p-3">Concepto / Categoría</th>
                <th className="p-3">Unidad Negocio</th>
                <th className="p-3">Detalle</th>
                <th className="p-3">Proveedor / Entidad</th>
                <th className="p-3 text-right">Ingreso ($)</th>
                <th className="p-3 text-right">Egreso ($)</th>
                <th className="p-3 text-center">Fact. SAS</th>
                <th className="p-3 text-right">Saldo Acumulado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-50 font-sans">
                  <td className="p-3 text-zinc-600 font-mono">{formatFecha(m.fecha)}</td>
                  <td className="p-3 font-bold text-zinc-900">{m.concepto}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        m.unidad_negocio === 'Taller'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-purple-100 text-purple-800 border border-purple-200'
                      }`}
                    >
                      {m.unidad_negocio}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-600 max-w-xs truncate">{m.detalle || '—'}</td>
                  <td className="p-3 text-zinc-700">{m.proveedor || '—'}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-600">
                    {m.ingreso ? formatPesos(m.ingreso) : '—'}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-red-600">
                    {m.egreso ? formatPesos(m.egreso) : '—'}
                  </td>
                  <td className="p-3 text-center">
                    {m.facturado_a_sas ? (
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">SÍ</span>
                    ) : (
                      <span className="text-zinc-400">NO</span>
                    )}
                  </td>
                  <td className="p-3 text-right font-mono font-black text-zinc-900">
                    {formatPesos(m.saldo_acumulado)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
