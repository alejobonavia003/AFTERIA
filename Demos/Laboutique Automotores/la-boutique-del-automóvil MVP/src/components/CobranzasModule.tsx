import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Calendar,
  PlusCircle,
  FileCheck2,
  Clock
} from 'lucide-react';
import {
  PagoCliente,
  OrdenTrabajo,
  Cliente,
  Vehiculo,
  MedioPago,
  EntregaPago,
  Recibo
} from '../types';
import { formatPesos, formatFecha } from '../utils/calculations';

interface CobranzasModuleProps {
  pagos: PagoCliente[];
  ordenes: OrdenTrabajo[];
  clientes: Cliente[];
  vehiculos: Vehiculo[];
  recibos: Recibo[];
  searchTerm: string;
  onRegisterEntrega: (pagoId: number, entrega: Omit<EntregaPago, 'id'>) => void;
  onPrintRecibo: (recibo: Recibo, cliente: Cliente, remito?: OrdenTrabajo) => void;
}

export const CobranzasModule: React.FC<CobranzasModuleProps> = ({
  pagos,
  ordenes,
  clientes,
  vehiculos,
  recibos,
  searchTerm,
  onRegisterEntrega,
  onPrintRecibo
}) => {
  const [filterDeuda, setFilterDeuda] = useState<'todos' | 'con_deuda' | 'criticos' | 'pagados'>('todos');
  const [selectedPagoForEntrega, setSelectedPagoForEntrega] = useState<PagoCliente | null>(null);

  // Form State for new Entrega
  const [montoEntrega, setMontoEntrega] = useState<number>(0);
  const [medioPago, setMedioPago] = useState<MedioPago>('Efectivo');
  const [notasEntrega, setNotasEntrega] = useState('');

  // Filtered Payments
  const filteredPagos = pagos.filter((p) => {
    const ot = ordenes.find((o) => o.id === p.orden_trabajo_id);
    const cli = clientes.find((c) => c.id === p.cliente_id);
    const veh = ot ? vehiculos.find((v) => v.id === ot.vehiculo_id) : null;

    if (filterDeuda === 'con_deuda' && p.deuda_pendiente <= 0) return false;
    if (filterDeuda === 'criticos' && (p.deuda_pendiente <= 0 || p.meses_deuda < 3)) return false;
    if (filterDeuda === 'pagados' && p.deuda_pendiente > 0) return false;

    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      cli?.razon_social.toLowerCase().includes(term) ||
      ot?.numero_remito.toString().includes(term) ||
      veh?.dominio.toLowerCase().includes(term)
    );
  });

  const totalDeudaAcumulada = pagos.reduce((sum, p) => sum + p.deuda_pendiente, 0);

  const handleSaveEntregaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPagoForEntrega || montoEntrega <= 0) return;

    const nextReciboNum = recibos.length > 0 ? Math.max(...recibos.map((r) => r.numero)) + 1 : 6;

    const newEntrega: Omit<EntregaPago, 'id'> = {
      pago_cliente_id: selectedPagoForEntrega.id,
      numero_entrega: selectedPagoForEntrega.entregas.length + 1,
      monto: montoEntrega,
      fecha: new Date().toISOString().split('T')[0],
      medio_pago: medioPago,
      numero_recibo: nextReciboNum,
      notas: notasEntrega || `Entrega #${selectedPagoForEntrega.entregas.length + 1}`
    };

    onRegisterEntrega(selectedPagoForEntrega.id, newEntrega);
    setSelectedPagoForEntrega(null);
    setMontoEntrega(0);
    setNotasEntrega('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Filters */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-zinc-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-500" />
              Gestión de Cobranzas & Cuentas Corrientes
            </h2>
            <p className="text-xs text-zinc-500">
              Control de entregas parciales y cuotas. Los clientes pueden abonar en N entregas con emisión automática de recibos.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-bold text-amber-900">Total Deuda de Clientes</p>
              <p className="text-lg font-black font-mono text-red-600">{formatPesos(totalDeudaAcumulada)}</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-100">
          <button
            onClick={() => setFilterDeuda('todos')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              filterDeuda === 'todos' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            Todos ({pagos.length})
          </button>
          <button
            onClick={() => setFilterDeuda('con_deuda')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              filterDeuda === 'con_deuda' ? 'bg-amber-500 text-zinc-950 font-black' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            Con Deuda Pendiente ({pagos.filter((p) => p.deuda_pendiente > 0).length})
          </button>
          <button
            onClick={() => setFilterDeuda('criticos')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              filterDeuda === 'criticos' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            🔴 Críticos (+3 Meses) ({pagos.filter((p) => p.deuda_pendiente > 0 && p.meses_deuda >= 3).length})
          </button>
          <button
            onClick={() => setFilterDeuda('pagados')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              filterDeuda === 'pagados' ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            🟢 Totalmente Cancelados ({pagos.filter((p) => p.deuda_pendiente <= 0).length})
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-900 text-white font-bold">
                <th className="p-3">Cliente / Teléfono</th>
                <th className="p-3">Remito Nº / Vehículo</th>
                <th className="p-3 text-right">Total Trabajo</th>
                <th className="p-3 text-right">Cobrado</th>
                <th className="p-3 text-right">Deuda Pendiente</th>
                <th className="p-3 text-center">Antigüedad</th>
                <th className="p-3">Historial Entregas / Cuotas</th>
                <th className="p-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredPagos.map((pago) => {
                const ot = ordenes.find((o) => o.id === pago.orden_trabajo_id);
                const cli = clientes.find((c) => c.id === pago.cliente_id);
                const veh = ot ? vehiculos.find((v) => v.id === ot.vehiculo_id) : null;
                const totalCobrado = pago.entregas.reduce((s, e) => s + e.monto, 0);

                return (
                  <tr key={pago.id} className="hover:bg-zinc-50">
                    
                    {/* Cliente */}
                    <td className="p-3">
                      <p className="font-extrabold text-zinc-900 text-sm">{cli?.razon_social}</p>
                      <p className="text-zinc-500 font-mono text-[11px]">{cli?.telefono}</p>
                    </td>

                    {/* Remito */}
                    <td className="p-3">
                      <p className="font-mono font-bold text-amber-800">Remito #{ot?.numero_remito}</p>
                      <p className="text-zinc-600 text-[11px]">
                        {veh?.marca_modelo} <span className="font-mono font-bold">[{veh?.dominio}]</span>
                      </p>
                    </td>

                    {/* Total Trabajo */}
                    <td className="p-3 text-right font-mono font-bold text-zinc-800">
                      {formatPesos(pago.total_trabajo)}
                    </td>

                    {/* Total Cobrado */}
                    <td className="p-3 text-right font-mono font-bold text-emerald-600">
                      {formatPesos(totalCobrado)}
                    </td>

                    {/* Deuda Pendiente */}
                    <td className="p-3 text-right font-mono font-black text-sm">
                      {pago.deuda_pendiente > 0 ? (
                        <span className="text-red-600">{formatPesos(pago.deuda_pendiente)}</span>
                      ) : (
                        <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          PAGADO
                        </span>
                      )}
                    </td>

                    {/* Antigüedad de Deuda */}
                    <td className="p-3 text-center">
                      {pago.deuda_pendiente > 0 ? (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            pago.meses_deuda >= 3
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : pago.meses_deuda >= 2
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          {pago.meses_deuda >= 3 ? '🔴 ' : pago.meses_deuda >= 2 ? '🟡 ' : '🟢 '}
                          {pago.meses_deuda} {pago.meses_deuda === 1 ? 'mes' : 'meses'}
                        </span>
                      ) : (
                        <span className="text-zinc-400 font-mono">—</span>
                      )}
                    </td>

                    {/* Historial Entregas / Receipts */}
                    <td className="p-3">
                      <div className="space-y-1">
                        {pago.entregas.map((e) => {
                          const r = recibos.find((rec) => rec.numero === e.numero_recibo);
                          return (
                            <div
                              key={e.id}
                              className="flex items-center justify-between text-[11px] bg-zinc-50 border border-zinc-200 p-1.5 rounded"
                            >
                              <div>
                                <span className="font-bold text-zinc-800">
                                  Entrega #{e.numero_entrega}: {formatPesos(e.monto)}
                                </span>
                                <span className="text-zinc-500 font-mono ml-2">({formatFecha(e.fecha)})</span>
                              </div>
                              {r && cli && (
                                <button
                                  onClick={() => onPrintRecibo(r, cli, ot)}
                                  className="text-[10px] text-amber-700 hover:text-amber-900 font-bold underline flex items-center gap-0.5 cursor-pointer"
                                >
                                  <Printer className="w-3 h-3" />
                                  Recibo #{e.numero_recibo}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="p-3 text-center">
                      {pago.deuda_pendiente > 0 ? (
                        <button
                          onClick={() => {
                            setSelectedPagoForEntrega(pago);
                            setMontoEntrega(pago.deuda_pendiente);
                          }}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-lg flex items-center gap-1 text-[11px] mx-auto cursor-pointer shadow-xs"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          Registrar Entrega
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-bold text-[11px] flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Al día
                        </span>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* REGISTRAR ENTREGA MODAL */}
      {selectedPagoForEntrega && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full border-2 border-amber-500">
            <h3 className="text-base font-extrabold text-zinc-900 mb-2">
              Registrar Cobro / Entrega Parcial
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Se registrará el pago y se generará automáticamente el Recibo Oficial correspondiente.
            </p>

            <form onSubmit={handleSaveEntregaSubmit} className="space-y-4">
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs">
                <p className="font-bold text-amber-900">
                  Cliente: {clientes.find((c) => c.id === selectedPagoForEntrega.cliente_id)?.razon_social}
                </p>
                <p className="text-amber-800">
                  Deuda Pendiente Actual: <span className="font-mono font-black text-red-600">{formatPesos(selectedPagoForEntrega.deuda_pendiente)}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Monto de la Entrega ($) *</label>
                <input
                  type="number"
                  required
                  max={selectedPagoForEntrega.deuda_pendiente}
                  value={montoEntrega}
                  onChange={(e) => setMontoEntrega(Number(e.target.value))}
                  className="w-full p-2 border border-zinc-300 rounded text-sm font-mono font-bold text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Medio de Pago *</label>
                <select
                  value={medioPago}
                  onChange={(e) => setMedioPago(e.target.value as MedioPago)}
                  className="w-full p-2 border border-zinc-300 rounded text-xs font-medium"
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia Bancaria</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Tarjeta">Tarjeta de Débito/Crédito</option>
                  <option value="E-Cheq">E-Cheq</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Notas / Observaciones</label>
                <input
                  type="text"
                  value={notasEntrega}
                  onChange={(e) => setNotasEntrega(e.target.value)}
                  placeholder="Ej: Pago a cuenta entrega 2 de 3"
                  className="w-full p-2 border border-zinc-300 rounded text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPagoForEntrega(null)}
                  className="px-4 py-2 bg-zinc-200 text-zinc-800 text-xs font-bold rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs rounded-lg shadow-sm"
                >
                  Emitir Recibo & Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
