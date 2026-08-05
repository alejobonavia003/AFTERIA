import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Printer,
  ArrowRightCircle,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import {
  Presupuesto,
  PresupuestoItem,
  Cliente,
  Vehiculo,
  OrdenTrabajo
} from '../types';
import { formatPesos, formatFecha } from '../utils/calculations';

interface PresupuestosModuleProps {
  presupuestos: Presupuesto[];
  clientes: Cliente[];
  vehiculos: Vehiculo[];
  searchTerm: string;
  onSavePresupuesto: (presupuesto: Presupuesto) => void;
  onConvertirARemito: (presupuesto: Presupuesto) => void;
  onPrintPresupuesto: (presupuesto: Presupuesto) => void;
}

export const PresupuestosModule: React.FC<PresupuestosModuleProps> = ({
  presupuestos,
  clientes,
  vehiculos,
  searchTerm,
  onSavePresupuesto,
  onConvertirARemito,
  onPrintPresupuesto
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const [clienteId, setClienteId] = useState<number>(clientes[0]?.id || 0);
  const [vehiculoId, setVehiculoId] = useState<number>(
    vehiculos.find((v) => v.cliente_id === (clientes[0]?.id || 0))?.id || 0
  );
  const [diagnostico, setDiagnostico] = useState('');
  const [items, setItems] = useState<PresupuestoItem[]>([
    {
      id: Date.now(),
      tipo: 'mano_obra',
      descripcion: 'Mano de obra estimada',
      cantidad: 1,
      precio_unitario: 50000,
      importe: 50000
    }
  ]);

  const filteredPresupuestos = presupuestos.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const cli = clientes.find((c) => c.id === p.cliente_id);
    const veh = vehiculos.find((v) => v.id === p.vehiculo_id);
    return (
      p.numero.toString().includes(term) ||
      cli?.razon_social.toLowerCase().includes(term) ||
      veh?.dominio.toLowerCase().includes(term)
    );
  });

  const nextNumero = presupuestos.length > 0 ? Math.max(...presupuestos.map((p) => p.numero)) + 1 : 226;

  const addItem = (tipo: 'repuesto' | 'mano_obra') => {
    setItems([
      ...items,
      {
        id: Date.now(),
        tipo,
        descripcion: tipo === 'repuesto' ? 'Repuesto estimado' : 'Servicio / Mano de obra',
        cantidad: 1,
        precio_unitario: 30000,
        importe: 30000
      }
    ]);
  };

  const updateItem = (index: number, field: keyof PresupuestoItem, val: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: val };
    item.importe = Number(item.cantidad) * Number(item.precio_unitario);
    updated[index] = item;
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totalEstimado = items.reduce((sum, i) => sum + i.importe, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newP: Presupuesto = {
      id: Date.now(),
      numero: nextNumero,
      fecha: new Date().toISOString().split('T')[0],
      cliente_id: clienteId,
      vehiculo_id: vehiculoId,
      diagnostico: diagnostico || 'Cotización preliminar de reparaciones',
      estado: 'pendiente',
      total_estimado: totalEstimado,
      items: items
    };
    onSavePresupuesto(newP);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-zinc-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            Presupuestos
          </h2>
          <p className="text-xs text-zinc-500">
            Cotizaciones previas. Un presupuesto aprobado se convierte en Remito de Trabajo en 1 solo clic.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold rounded-lg flex items-center gap-2 text-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Cancelar' : '+ Nuevo Presupuesto'}</span>
        </button>
      </div>

      {/* FORM */}
      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-zinc-900 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
            <span className="font-extrabold text-zinc-900 text-base">PRESUPUESTO Nº {nextNumero}</span>
            <span className="text-xs font-mono font-bold bg-zinc-100 p-1 rounded">
              {formatFecha(new Date().toISOString().split('T')[0])}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-50 p-4 rounded-lg">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Cliente</label>
              <select
                value={clienteId}
                onChange={(e) => {
                  const cId = Number(e.target.value);
                  setClienteId(cId);
                  const v = vehiculos.find((x) => x.cliente_id === cId);
                  if (v) setVehiculoId(v.id);
                }}
                className="w-full p-2 bg-white border border-zinc-300 rounded text-xs font-medium"
              >
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.razon_social} ({c.telefono})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Vehículo / Patente</label>
              <select
                value={vehiculoId}
                onChange={(e) => setVehiculoId(Number(e.target.value))}
                className="w-full p-2 bg-white border border-zinc-300 rounded text-xs font-medium"
              >
                {vehiculos
                  .filter((v) => v.cliente_id === clienteId)
                  .map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.marca_modelo} — [{v.dominio}]
                    </option>
                  ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-zinc-700 mb-1">Diagnóstico / Trabajo Cotizado</label>
              <textarea
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
                placeholder="Detalle del presupuesto a entregar al cliente..."
                rows={2}
                className="w-full p-2 bg-white border border-zinc-300 rounded text-xs"
              />
            </div>
          </div>

          {/* Items Table */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-zinc-800 uppercase">Ítems Cotizados</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addItem('repuesto')}
                  className="px-2.5 py-1 bg-zinc-900 text-white font-bold text-[11px] rounded"
                >
                  + Repuesto
                </button>
                <button
                  type="button"
                  onClick={() => addItem('mano_obra')}
                  className="px-2.5 py-1 bg-amber-500 text-zinc-950 font-bold text-[11px] rounded"
                >
                  + Mano de Obra
                </button>
              </div>
            </div>

            <table className="w-full text-left text-xs border border-zinc-200 rounded">
              <thead>
                <tr className="bg-zinc-100 font-bold border-b border-zinc-200">
                  <th className="p-2">Tipo</th>
                  <th className="p-2">Descripción</th>
                  <th className="p-2 text-center">Cant.</th>
                  <th className="p-2 text-right">Precio Unit ($)</th>
                  <th className="p-2 text-right">Importe ($)</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="p-2 font-mono uppercase text-[10px] font-bold">
                      {item.tipo === 'repuesto' ? 'REP' : 'M.O.'}
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.descripcion}
                        onChange={(e) => updateItem(idx, 'descripcion', e.target.value)}
                        className="w-full p-1 border border-zinc-300 rounded"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        value={item.cantidad}
                        onChange={(e) => updateItem(idx, 'cantidad', Number(e.target.value))}
                        className="w-12 p-1 border border-zinc-300 rounded text-center"
                      />
                    </td>
                    <td className="p-2 text-right">
                      <input
                        type="number"
                        value={item.precio_unitario}
                        onChange={(e) => updateItem(idx, 'precio_unitario', Number(e.target.value))}
                        className="w-28 p-1 border border-zinc-300 rounded text-right font-mono"
                      />
                    </td>
                    <td className="p-2 text-right font-mono font-bold">{formatPesos(item.importe)}</td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-zinc-200">
            <div className="text-xl font-black text-zinc-900 font-mono">
              TOTAL ESTIMADO: {formatPesos(totalEstimado)}
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 text-zinc-950 font-black rounded-lg text-sm"
            >
              Guardar Presupuesto
            </button>
          </div>
        </form>
      )}

      {/* LIST TABLE */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex justify-between items-center">
          <h3 className="font-bold text-sm text-zinc-800">Listado de Presupuestos</h3>
          <span className="text-xs text-zinc-500">{filteredPresupuestos.length} registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-100 text-zinc-700 font-bold border-b border-zinc-200">
                <th className="p-3">Nº Pres.</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Vehículo / Patente</th>
                <th className="p-3">Diagnóstico</th>
                <th className="p-3 text-right">Total Estimado</th>
                <th className="p-3 text-center">Estado</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredPresupuestos.map((p) => {
                const cli = clientes.find((c) => c.id === p.cliente_id);
                const veh = vehiculos.find((v) => v.id === p.vehiculo_id);

                return (
                  <tr key={p.id} className="hover:bg-zinc-50">
                    <td className="p-3 font-mono font-black text-zinc-900">#{p.numero}</td>
                    <td className="p-3 text-zinc-600">{formatFecha(p.fecha)}</td>
                    <td className="p-3 font-bold text-zinc-900">{cli?.razon_social}</td>
                    <td className="p-3 text-zinc-700">
                      {veh?.marca_modelo} <span className="font-mono font-bold">[{veh?.dominio}]</span>
                    </td>
                    <td className="p-3 text-zinc-600 max-w-xs truncate">{p.diagnostico}</td>
                    <td className="p-3 text-right font-mono font-bold text-zinc-900">
                      {formatPesos(p.total_estimado)}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.estado === 'convertido'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : p.estado === 'pendiente'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {p.estado === 'convertido' ? 'Convertido a Remito' : p.estado}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center items-center gap-2">
                        {p.estado !== 'convertido' && (
                          <button
                            onClick={() => onConvertirARemito(p)}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold rounded flex items-center gap-1 text-[10px] cursor-pointer"
                            title="Convertir automáticamente en Remito de Trabajo"
                          >
                            <ArrowRightCircle className="w-3.5 h-3.5" />
                            A Remito
                          </button>
                        )}
                        <button
                          onClick={() => onPrintPresupuesto(p)}
                          className="px-2.5 py-1 bg-zinc-900 text-amber-400 font-bold rounded flex items-center gap-1 text-[10px] cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Imprimir
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
