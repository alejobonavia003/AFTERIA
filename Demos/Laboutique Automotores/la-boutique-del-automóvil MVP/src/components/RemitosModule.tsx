import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Trash2,
  Printer,
  Calculator,
  Search,
  UserPlus,
  Car,
  Wrench,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import {
  OrdenTrabajo,
  RemitoItem,
  Cliente,
  Vehiculo,
  Proveedor,
  PagoCliente,
  TipoItem,
  ConfigTarifario
} from '../types';
import {
  calcularItemRepuesto,
  calcularTotalesRemito,
  formatPesos,
  formatFecha,
  IVA_DEFAULT,
  GANANCIA_DEFAULT
} from '../utils/calculations';

interface RemitosModuleProps {
  ordenes: OrdenTrabajo[];
  clientes: Cliente[];
  vehiculos: Vehiculo[];
  proveedores: Proveedor[];
  pagos: PagoCliente[];
  config: ConfigTarifario;
  mecanicos: string[];
  tiposTrabajo: string[];
  searchTerm: string;
  onSaveRemito: (remito: OrdenTrabajo, pagoInicial?: number) => void;
  onPrintRemito: (remito: OrdenTrabajo) => void;
  onAddClienteInline: (cli: Omit<Cliente, 'id'>) => Cliente;
  onAddVehiculoInline: (veh: Omit<Vehiculo, 'id'>) => Vehiculo;
}

export const RemitosModule: React.FC<RemitosModuleProps> = ({
  ordenes,
  clientes,
  vehiculos,
  proveedores,
  pagos,
  config,
  mecanicos,
  tiposTrabajo,
  searchTerm,
  onSaveRemito,
  onPrintRemito,
  onAddClienteInline,
  onAddVehiculoInline
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedRemito, setSelectedRemito] = useState<OrdenTrabajo | null>(null);

  // Form State for new/editing Remito
  const [clienteId, setClienteId] = useState<number>(clientes[0]?.id || 0);
  const [vehiculoId, setVehiculoId] = useState<number>(
    vehiculos.find((v) => v.cliente_id === (clientes[0]?.id || 0))?.id || 0
  );
  const [km, setKm] = useState<number>(95000);
  const [mecanico, setMecanico] = useState<string>(mecanicos[0] || 'Federico');
  const [tipoTrabajo, setTipoTrabajo] = useState<string>(tiposTrabajo[0] || 'Service');
  const [diagnostico, setDiagnostico] = useState<string>('');
  const [pagoInicial, setPagoInicial] = useState<number>(0);

  // Items State
  const [items, setItems] = useState<RemitoItem[]>([
    {
      id: Date.now(),
      tipo: 'mano_obra',
      descripcion: 'Mano de obra Service Completo',
      costo_sin_iva: 0,
      iva_pct: 0.21,
      costo_con_iva: 0,
      cantidad: 1,
      pct_ganancia: 0,
      precio_unitario_final: config.service_auto || 90000,
      importe: config.service_auto || 90000
    }
  ]);

  // Inline client/vehicle modal state
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [newRazonSocial, setNewRazonSocial] = useState('');
  const [newTelefono, setNewTelefono] = useState('');
  const [newDominio, setNewDominio] = useState('');
  const [newMarcaModelo, setNewMarcaModelo] = useState('');

  // Filtered Remitos
  const filteredRemitos = ordenes.filter((o) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const cli = clientes.find((c) => c.id === o.cliente_id);
    const veh = vehiculos.find((v) => v.id === o.vehiculo_id);
    return (
      o.numero_remito.toString().includes(term) ||
      cli?.razon_social.toLowerCase().includes(term) ||
      veh?.dominio.toLowerCase().includes(term) ||
      veh?.marca_modelo.toLowerCase().includes(term)
    );
  });

  const nextRemitoNum = ordenes.length > 0 ? Math.max(...ordenes.map((o) => o.numero_remito)) + 1 : 2396;

  // Handle Client Change & Update Available Vehicles
  const handleClienteChange = (cId: number) => {
    setClienteId(cId);
    const availableVeh = vehiculos.filter((v) => v.cliente_id === cId);
    if (availableVeh.length > 0) {
      setVehiculoId(availableVeh[0].id);
      setKm(availableVeh[0].km_ultimo_registrado || 0);
    } else {
      setVehiculoId(0);
    }
  };

  // Add Item to Form
  const handleAddItem = (tipo: TipoItem) => {
    if (tipo === 'repuesto') {
      const defaultCostoSinIva = 20000;
      const { costoConIva, precioUnitarioFinal, importe } = calcularItemRepuesto(
        defaultCostoSinIva,
        1,
        config.pct_recargo_default || 0.20,
        0.21
      );

      const newItem: RemitoItem = {
        id: Date.now(),
        tipo: 'repuesto',
        codigo_repuesto: 'REP',
        descripcion: 'Nuevo Repuesto',
        proveedor_id: proveedores[0]?.id || 3,
        costo_sin_iva: defaultCostoSinIva,
        iva_pct: 0.21,
        costo_con_iva: costoConIva,
        cantidad: 1,
        pct_ganancia: config.pct_recargo_default || 0.20,
        precio_unitario_final: precioUnitarioFinal,
        importe: importe
      };
      setItems([...items, newItem]);
    } else {
      const newItem: RemitoItem = {
        id: Date.now(),
        tipo: 'mano_obra',
        descripcion: 'Mano de Obra adicional',
        costo_sin_iva: 0,
        iva_pct: 0.21,
        costo_con_iva: 0,
        cantidad: 1,
        pct_ganancia: 0,
        precio_unitario_final: config.hora_mano_obra || 35000,
        importe: config.hora_mano_obra || 35000
      };
      setItems([...items, newItem]);
    }
  };

  // Update Item in Form
  const handleItemChange = (index: number, field: keyof RemitoItem, val: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: val };

    if (item.tipo === 'repuesto') {
      const costoSinIva = Number(item.costo_sin_iva) || 0;
      const cant = Number(item.cantidad) || 1;
      const pctGan = Number(item.pct_ganancia) || 0;

      const calc = calcularItemRepuesto(costoSinIva, cant, pctGan, item.iva_pct || 0.21);
      item.costo_con_iva = calc.costoConIva;
      item.precio_unitario_final = calc.precioUnitarioFinal;
      item.importe = calc.importe;
    } else {
      item.importe = Number(item.precio_unitario_final) * Number(item.cantidad);
    }

    updated[index] = item;
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculate live totals for current items
  const totalesLive = calcularTotalesRemito(items);

  // Submit New Remito
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || items.length === 0) {
      alert('Por favor selecciona un cliente y agrega al menos un ítem al remito.');
      return;
    }

    const newRemito: OrdenTrabajo = {
      id: Date.now(),
      numero_remito: nextRemitoNum,
      fecha: new Date().toISOString().split('T')[0],
      cliente_id: clienteId,
      vehiculo_id: vehiculoId,
      km: km,
      diagnostico_trabajo_realizado: diagnostico || `${tipoTrabajo} realizado por ${mecanico}`,
      mecanico_responsable: mecanico,
      tipo_trabajo: tipoTrabajo,
      estado: 'entregado',
      total_costo_repuestos: totalesLive.totalCostoRepuestos,
      total_precio_repuestos: totalesLive.totalPrecioRepuestos,
      total_mano_obra: totalesLive.totalManoObra,
      total_sin_iva: totalesLive.totalSinIva,
      iva: totalesLive.iva,
      total_final: totalesLive.totalFinal,
      items: items
    };

    onSaveRemito(newRemito, pagoInicial);
    setIsCreating(false);
  };

  // Handle Quick Inline Client & Vehicle Creation
  const handleSaveInlineCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRazonSocial) return;

    const createdCli = onAddClienteInline({
      razon_social: newRazonSocial,
      telefono: newTelefono || 'S/D'
    });

    let createdVehId = 0;
    if (newDominio || newMarcaModelo) {
      const createdVeh = onAddVehiculoInline({
        cliente_id: createdCli.id,
        dominio: newDominio.toUpperCase() || 'S/D',
        marca_modelo: newMarcaModelo || 'General',
        km_ultimo_registrado: km
      });
      createdVehId = createdVeh.id;
    }

    setClienteId(createdCli.id);
    if (createdVehId) setVehiculoId(createdVehId);
    setShowClienteModal(false);
    setNewRazonSocial('');
    setNewTelefono('');
    setNewDominio('');
    setNewMarcaModelo('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-zinc-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-amber-500" />
            Órdenes de Trabajo & Remitos
          </h2>
          <p className="text-xs text-zinc-500">
            Módulo central del taller. Genera remitos con cálculo exacto de repuestos (+IVA y recargo) y Mano de Obra.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold rounded-lg flex items-center gap-2 text-xs transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Cancelar y Volver' : '+ Generar Nuevo Remito'}</span>
        </button>
      </div>

      {/* CREATION FORM */}
      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-amber-500/80 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-2 text-amber-800 font-black text-base">
              <Calculator className="w-5 h-5" />
              <span>NUEVO REMITO Nº {nextRemitoNum}</span>
            </div>
            <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-1 rounded">
              FECHA: {formatFecha(new Date().toISOString().split('T')[0])}
            </span>
          </div>

          {/* Client & Vehicle Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-50 p-4 rounded-lg border border-zinc-200">
            
            {/* Cliente Select */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-zinc-700">Cliente *</label>
                <button
                  type="button"
                  onClick={() => setShowClienteModal(true)}
                  className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3 h-3" />
                  + Nuevo
                </button>
              </div>
              <select
                value={clienteId}
                onChange={(e) => handleClienteChange(Number(e.target.value))}
                className="w-full p-2 bg-white border border-zinc-300 rounded-lg text-xs font-medium text-zinc-900"
              >
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.razon_social} ({c.telefono})
                  </option>
                ))}
              </select>
            </div>

            {/* Vehiculo Select */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Vehículo / Patente *</label>
              <select
                value={vehiculoId}
                onChange={(e) => {
                  const vId = Number(e.target.value);
                  setVehiculoId(vId);
                  const v = vehiculos.find((x) => x.id === vId);
                  if (v) setKm(v.km_ultimo_registrado || 0);
                }}
                className="w-full p-2 bg-white border border-zinc-300 rounded-lg text-xs font-medium text-zinc-900"
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

            {/* Kilometraje */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Kilometraje (Km)</label>
              <input
                type="number"
                value={km}
                onChange={(e) => setKm(Number(e.target.value))}
                className="w-full p-2 bg-white border border-zinc-300 rounded-lg text-xs font-mono font-bold text-zinc-900"
              />
            </div>

            {/* Mecánico */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Mecánico Responsable</label>
              <select
                value={mecanico}
                onChange={(e) => setMecanico(e.target.value)}
                className="w-full p-2 bg-white border border-zinc-300 rounded-lg text-xs font-medium text-zinc-900"
              >
                {mecanicos.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Trabajo */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Tipo de Trabajo</label>
              <select
                value={tipoTrabajo}
                onChange={(e) => setTipoTrabajo(e.target.value)}
                className="w-full p-2 bg-white border border-zinc-300 rounded-lg text-xs font-medium text-zinc-900"
              >
                {tiposTrabajo.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Diagnostico libre */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-zinc-700 mb-1">Diagnóstico / Trabajo Realizado Detallado</label>
              <textarea
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
                placeholder="Ej: Service completo. Cambio de aceite Total 10w40, kit de filtros, revisión de frenos y escaneo computarizado."
                rows={2}
                className="w-full p-2 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900"
              />
            </div>

          </div>

          {/* Items Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider">
                Detalle de Repuestos y Mano de Obra
              </h4>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAddItem('repuesto')}
                  className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[11px] rounded flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-amber-400" />
                  + Agregar Repuesto
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem('mano_obra')}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-[11px] rounded flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  + Agregar Mano de Obra
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-zinc-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-zinc-100 text-zinc-700 font-bold border-b border-zinc-200">
                    <th className="p-2 w-20">Tipo</th>
                    <th className="p-2">Descripción</th>
                    <th className="p-2 w-28">Proveedor</th>
                    <th className="p-2 w-24 text-right">Costo s/IVA</th>
                    <th className="p-2 w-24 text-right">Costo c/IVA</th>
                    <th className="p-2 w-20 text-center">% Gan.</th>
                    <th className="p-2 w-16 text-center">Cant.</th>
                    <th className="p-2 w-28 text-right">P. Unit. Final</th>
                    <th className="p-2 w-28 text-right">Importe</th>
                    <th className="p-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {items.map((item, index) => (
                    <tr key={item.id} className={item.tipo === 'mano_obra' ? 'bg-amber-50/40' : 'bg-white'}>
                      
                      {/* Tipo badge */}
                      <td className="p-2 font-bold">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-mono ${
                            item.tipo === 'repuesto' ? 'bg-blue-100 text-blue-800' : 'bg-amber-200 text-amber-900'
                          }`}
                        >
                          {item.tipo === 'repuesto' ? 'Rep' : 'M.O.'}
                        </span>
                      </td>

                      {/* Descripción */}
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.descripcion}
                          onChange={(e) => handleItemChange(index, 'descripcion', e.target.value)}
                          className="w-full p-1 border border-zinc-300 rounded text-xs"
                          placeholder="Nombre repuesto o tarea"
                        />
                      </td>

                      {/* Proveedor */}
                      <td className="p-2">
                        {item.tipo === 'repuesto' ? (
                          <select
                            value={item.proveedor_id || 3}
                            onChange={(e) => handleItemChange(index, 'proveedor_id', Number(e.target.value))}
                            className="w-full p-1 border border-zinc-300 rounded text-[11px]"
                          >
                            {proveedores.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.nombre}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-zinc-400 italic text-[11px]">—</span>
                        )}
                      </td>

                      {/* Costo Sin IVA */}
                      <td className="p-2 text-right">
                        {item.tipo === 'repuesto' ? (
                          <input
                            type="number"
                            value={item.costo_sin_iva}
                            onChange={(e) => handleItemChange(index, 'costo_sin_iva', Number(e.target.value))}
                            className="w-full p-1 border border-zinc-300 rounded text-xs text-right font-mono"
                          />
                        ) : (
                          <span className="text-zinc-400 italic text-[11px]">—</span>
                        )}
                      </td>

                      {/* Costo Con IVA 21% */}
                      <td className="p-2 text-right font-mono text-zinc-600 bg-zinc-50">
                        {item.tipo === 'repuesto' ? formatPesos(item.costo_con_iva) : '—'}
                      </td>

                      {/* % Ganancia */}
                      <td className="p-2 text-center">
                        {item.tipo === 'repuesto' ? (
                          <div className="flex items-center justify-center gap-0.5">
                            <input
                              type="number"
                              step="0.05"
                              value={item.pct_ganancia}
                              onChange={(e) => handleItemChange(index, 'pct_ganancia', Number(e.target.value))}
                              className="w-12 p-1 border border-zinc-300 rounded text-xs text-center font-mono font-bold"
                            />
                          </div>
                        ) : (
                          <span className="text-zinc-400 italic text-[11px]">—</span>
                        )}
                      </td>

                      {/* Cantidad */}
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          step="0.5"
                          value={item.cantidad}
                          onChange={(e) => handleItemChange(index, 'cantidad', Number(e.target.value))}
                          className="w-12 p-1 border border-zinc-300 rounded text-xs text-center font-bold"
                        />
                      </td>

                      {/* Precio Unitario Final */}
                      <td className="p-2 text-right">
                        {item.tipo === 'mano_obra' ? (
                          <input
                            type="number"
                            value={item.precio_unitario_final}
                            onChange={(e) => handleItemChange(index, 'precio_unitario_final', Number(e.target.value))}
                            className="w-full p-1 border border-zinc-300 rounded text-xs text-right font-mono font-bold"
                          />
                        ) : (
                          <span className="font-mono font-bold">{formatPesos(item.precio_unitario_final)}</span>
                        )}
                      </td>

                      {/* Importe Total Linea */}
                      <td className="p-2 text-right font-mono font-black text-zinc-900">
                        {formatPesos(item.importe)}
                      </td>

                      {/* Delete item */}
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Summary Footer & Margin Calculation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900 text-white p-5 rounded-xl">
            <div>
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                Análisis de Rentabilidad Taller (En Tiempo Real)
              </p>
              <div className="space-y-1 text-xs text-zinc-300 font-mono">
                <div className="flex justify-between">
                  <span>Costo Total Repuestos (c/IVA):</span>
                  <span>{formatPesos(totalesLive.totalCostoRepuestos)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Venta Total Repuestos:</span>
                  <span>{formatPesos(totalesLive.totalPrecioRepuestos)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mano de Obra Neta:</span>
                  <span>{formatPesos(totalesLive.totalManoObra)}</span>
                </div>
                <div className="border-t border-zinc-700 my-1 pt-1 flex justify-between font-bold text-emerald-400">
                  <span>Ganancia Bruta Taller:</span>
                  <span>
                    {formatPesos(totalesLive.margenGananciaBruta)} ({totalesLive.porcentajeMargen}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between items-end">
              <div className="text-right">
                <p className="text-xs text-zinc-400 uppercase">TOTAL FINAL REMITO</p>
                <p className="text-3xl font-black text-amber-400 font-mono mt-0.5">
                  {formatPesos(totalesLive.totalFinal)}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-4 w-full justify-end">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-zinc-300">Cobro Inicial ($):</label>
                  <input
                    type="number"
                    value={pagoInicial}
                    onChange={(e) => setPagoInicial(Number(e.target.value))}
                    placeholder="0.00"
                    className="w-28 p-1.5 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono font-bold text-white text-right"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  Confirmar y Emitir Remito
                </button>
              </div>
            </div>
          </div>

        </form>
      )}

      {/* REMITOS LIST TABLE */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex justify-between items-center">
          <h3 className="font-bold text-sm text-zinc-800">Historial de Remitos Emitidos</h3>
          <span className="text-xs text-zinc-500">{filteredRemitos.length} registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-100 text-zinc-700 font-bold border-b border-zinc-200">
                <th className="p-3">Nº Remito</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Vehículo / Patente</th>
                <th className="p-3">Mecánico</th>
                <th className="p-3">Tipo Trabajo</th>
                <th className="p-3 text-right">Costo Rep.</th>
                <th className="p-3 text-right">Total Final</th>
                <th className="p-3 text-right">Cobrado</th>
                <th className="p-3 text-right">Deuda</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredRemitos.map((o) => {
                const cli = clientes.find((c) => c.id === o.cliente_id);
                const veh = vehiculos.find((v) => v.id === o.vehiculo_id);
                const pago = pagos.find((p) => p.orden_trabajo_id === o.id);
                const cobrado = pago ? pago.entregas.reduce((s, e) => s + e.monto, 0) : 0;
                const deuda = Math.max(0, o.total_final - cobrado);

                return (
                  <tr key={o.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="p-3 font-mono font-black text-amber-800">#{o.numero_remito}</td>
                    <td className="p-3 text-zinc-600">{formatFecha(o.fecha)}</td>
                    <td className="p-3 font-bold text-zinc-900">{cli?.razon_social || 'N/A'}</td>
                    <td className="p-3 text-zinc-700">
                      {veh?.marca_modelo}{' '}
                      <span className="font-mono bg-zinc-100 px-1 py-0.5 rounded border border-zinc-200 font-bold text-zinc-800">
                        {veh?.dominio}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-600">{o.mecanico_responsable}</td>
                    <td className="p-3">
                      <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                        {o.tipo_trabajo}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-zinc-500">{formatPesos(o.total_costo_repuestos)}</td>
                    <td className="p-3 text-right font-mono font-bold text-zinc-900">{formatPesos(o.total_final)}</td>
                    <td className="p-3 text-right font-mono text-emerald-700 font-bold">{formatPesos(cobrado)}</td>
                    <td className="p-3 text-right font-mono font-black text-red-600">
                      {deuda > 0 ? formatPesos(deuda) : <span className="text-emerald-600 text-[10px]">PAGADO</span>}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onPrintRemito(o)}
                        className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-bold rounded flex items-center gap-1 text-[11px] mx-auto cursor-pointer"
                        title="Imprimir / Ver comprobante"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Imprimir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Add Client Modal */}
      {showClienteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-base font-bold text-zinc-900 mb-4">Alta Rápida de Cliente y Vehículo</h3>
            <form onSubmit={handleSaveInlineCliente} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700">Nombre / Razón Social *</label>
                <input
                  type="text"
                  required
                  value={newRazonSocial}
                  onChange={(e) => setNewRazonSocial(e.target.value)}
                  className="w-full p-2 border border-zinc-300 rounded text-xs"
                  placeholder="Ej: Banchio Roberto"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700">Teléfono</label>
                <input
                  type="text"
                  value={newTelefono}
                  onChange={(e) => setNewTelefono(e.target.value)}
                  className="w-full p-2 border border-zinc-300 rounded text-xs"
                  placeholder="Ej: 03385-15498011"
                />
              </div>

              <div className="border-t border-zinc-200 pt-3">
                <p className="text-xs font-bold text-amber-800 mb-2">Datos del Vehículo</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700">Patente (Dominio)</label>
                    <input
                      type="text"
                      value={newDominio}
                      onChange={(e) => setNewDominio(e.target.value)}
                      className="w-full p-2 border border-zinc-300 rounded text-xs uppercase font-mono"
                      placeholder="AB123CD"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700">Marca / Modelo</label>
                    <input
                      type="text"
                      value={newMarcaModelo}
                      onChange={(e) => setNewMarcaModelo(e.target.value)}
                      className="w-full p-2 border border-zinc-300 rounded text-xs"
                      placeholder="Peugeot 208"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowClienteModal(false)}
                  className="px-3 py-1.5 bg-zinc-200 text-zinc-800 text-xs font-bold rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 text-zinc-950 font-black text-xs rounded"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
