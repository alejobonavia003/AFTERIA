import React, { useState } from 'react';
import {
  Users,
  Car,
  Plus,
  Phone,
  FileText,
  Clock,
  Search,
  Wrench,
  ChevronRight
} from 'lucide-react';
import {
  Cliente,
  Vehiculo,
  OrdenTrabajo,
  Presupuesto
} from '../types';
import { formatPesos, formatFecha } from '../utils/calculations';

interface ClientesVehiculosModuleProps {
  clientes: Cliente[];
  vehiculos: Vehiculo[];
  ordenes: OrdenTrabajo[];
  presupuestos: Presupuesto[];
  searchTerm: string;
  onAddCliente: (cli: Omit<Cliente, 'id'>) => void;
  onAddVehiculo: (veh: Omit<Vehiculo, 'id'>) => void;
  onPrintRemito: (remito: OrdenTrabajo) => void;
}

export const ClientesVehiculosModule: React.FC<ClientesVehiculosModuleProps> = ({
  clientes,
  vehiculos,
  ordenes,
  presupuestos,
  searchTerm,
  onAddCliente,
  onAddVehiculo,
  onPrintRemito
}) => {
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(clientes[0] || null);
  const [isCreatingCliente, setIsCreatingCliente] = useState(false);
  const [isCreatingVehiculo, setIsCreatingVehiculo] = useState(false);

  // New Cliente state
  const [razonSocial, setRazonSocial] = useState('');
  const [cuit, setCuit] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [notas, setNotas] = useState('');

  // New Vehiculo state
  const [dominio, setDominio] = useState('');
  const [marcaModelo, setMarcaModelo] = useState('');
  const [km, setKm] = useState<number>(0);

  // Filtered Clients
  const filteredClientes = clientes.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const clientVehs = vehiculos.filter((v) => v.cliente_id === c.id);
    const hasVehMatch = clientVehs.some(
      (v) => v.dominio.toLowerCase().includes(term) || v.marca_modelo.toLowerCase().includes(term)
    );
    return (
      c.razon_social.toLowerCase().includes(term) ||
      c.telefono.toLowerCase().includes(term) ||
      (c.cuit || '').includes(term) ||
      hasVehMatch
    );
  });

  const selectedVehiculos = selectedCliente
    ? vehiculos.filter((v) => v.cliente_id === selectedCliente.id)
    : [];

  const selectedOrdenes = selectedCliente
    ? ordenes.filter((o) => o.cliente_id === selectedCliente.id)
    : [];

  const selectedPresupuestos = selectedCliente
    ? presupuestos.filter((p) => p.cliente_id === selectedCliente.id)
    : [];

  const handleSaveCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!razonSocial) return;
    onAddCliente({
      razon_social: razonSocial,
      cuit,
      telefono,
      direccion,
      notas
    });
    setIsCreatingCliente(false);
    setRazonSocial('');
    setCuit('');
    setTelefono('');
    setDireccion('');
    setNotas('');
  };

  const handleSaveVehiculo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCliente || !dominio) return;
    onAddVehiculo({
      cliente_id: selectedCliente.id,
      dominio: dominio.toUpperCase(),
      marca_modelo: marcaModelo || 'General',
      km_ultimo_registrado: km
    });
    setIsCreatingVehiculo(false);
    setDominio('');
    setMarcaModelo('');
    setKm(0);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-zinc-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            Directorio de Clientes & Historial de Vehículos
          </h2>
          <p className="text-xs text-zinc-500">
            Ficha completa por cliente: vehículos asociados y línea de tiempo con todos los service y reparaciones históricas.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingCliente(!isCreatingCliente)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-lg flex items-center gap-2 text-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Alta de Cliente</span>
        </button>
      </div>

      {/* New Client Form */}
      {isCreatingCliente && (
        <form onSubmit={handleSaveCliente} className="bg-white border-2 border-zinc-900 rounded-xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-zinc-900 uppercase">Alta de Nuevo Cliente</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Nombre / Razón Social *</label>
              <input
                type="text"
                required
                value={razonSocial}
                onChange={(e) => setRazonSocial(e.target.value)}
                placeholder="Ej: Pérez Juan"
                className="w-full p-2 border border-zinc-300 rounded"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">CUIT / DNI</label>
              <input
                type="text"
                value={cuit}
                onChange={(e) => setCuit(e.target.value)}
                placeholder="Ej: 20-12345678-9"
                className="w-full p-2 border border-zinc-300 rounded"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Teléfono *</label>
              <input
                type="text"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej: 03385-15600000"
                className="w-full p-2 border border-zinc-300 rounded"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-zinc-700 mb-1">Dirección</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Ej: Gral. Deheza 191, Laboulaye"
                className="w-full p-2 border border-zinc-300 rounded"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Notas / Observaciones</label>
              <input
                type="text"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Ej: Cliente flota / Paga en cuotas"
                className="w-full p-2 border border-zinc-300 rounded"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingCliente(false)}
              className="px-4 py-2 bg-zinc-200 text-zinc-800 text-xs font-bold rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-amber-500 text-zinc-950 font-black text-xs rounded"
            >
              Guardar Cliente
            </button>
          </div>
        </form>
      )}

      {/* Main Split View: Left Clients List, Right Client Detail & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Client List */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-3 bg-zinc-900 text-white font-bold text-xs flex justify-between items-center">
            <span>Listado de Clientes</span>
            <span>{filteredClientes.length}</span>
          </div>

          <div className="divide-y divide-zinc-200 max-h-[600px] overflow-y-auto">
            {filteredClientes.map((c) => {
              const isSelected = selectedCliente?.id === c.id;
              const vCount = vehiculos.filter((v) => v.cliente_id === c.id).length;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCliente(c)}
                  className={`p-3 cursor-pointer transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-amber-50 border-l-4 border-amber-500' : 'hover:bg-zinc-50'
                  }`}
                >
                  <div>
                    <p className="font-extrabold text-zinc-900 text-xs">{c.razon_social}</p>
                    <p className="text-zinc-500 text-[11px] font-mono">{c.telefono}</p>
                    <p className="text-[10px] text-zinc-400">{vCount} vehículos registrados</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-zinc-300'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Client Detail & Vehicle History */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCliente ? (
            <>
              {/* Selected Client Card Header */}
              <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-zinc-900">{selectedCliente.razon_social}</h3>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5">
                      CUIT: {selectedCliente.cuit || 'S/D'} | Tel: {selectedCliente.telefono}
                    </p>
                    {selectedCliente.direccion && (
                      <p className="text-xs text-zinc-600 mt-1">Dirección: {selectedCliente.direccion}</p>
                    )}
                  </div>

                  <button
                    onClick={() => setIsCreatingVehiculo(!isCreatingVehiculo)}
                    className="px-3 py-1.5 bg-zinc-900 text-amber-400 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + Agregar Vehículo
                  </button>
                </div>

                {/* Form to add vehicle */}
                {isCreatingVehiculo && (
                  <form onSubmit={handleSaveVehiculo} className="mt-4 p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-3">
                    <p className="text-xs font-bold text-zinc-800">Agregar Vehículo para {selectedCliente.razon_social}</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <label className="block font-bold text-zinc-700">Patente (Dominio) *</label>
                        <input
                          type="text"
                          required
                          value={dominio}
                          onChange={(e) => setDominio(e.target.value)}
                          placeholder="AB123CD"
                          className="w-full p-1.5 border border-zinc-300 rounded font-mono uppercase"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-700">Marca / Modelo *</label>
                        <input
                          type="text"
                          required
                          value={marcaModelo}
                          onChange={(e) => setMarcaModelo(e.target.value)}
                          placeholder="Peugeot 208"
                          className="w-full p-1.5 border border-zinc-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-700">Km Actuales</label>
                        <input
                          type="number"
                          value={km}
                          onChange={(e) => setKm(Number(e.target.value))}
                          placeholder="95000"
                          className="w-full p-1.5 border border-zinc-300 rounded font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCreatingVehiculo(false)}
                        className="px-3 py-1 bg-zinc-200 text-xs font-bold rounded"
                      >
                        Cancelar
                      </button>
                      <button type="submit" className="px-4 py-1 bg-amber-500 text-zinc-950 font-bold text-xs rounded">
                        Guardar Vehículo
                      </button>
                    </div>
                  </form>
                )}

                {/* Vehicles list for this client */}
                <div className="mt-4 pt-4 border-t border-zinc-100 flex flex-wrap gap-3">
                  {selectedVehiculos.map((v) => (
                    <div key={v.id} className="bg-zinc-100 border border-zinc-300 px-3 py-2 rounded-lg text-xs">
                      <p className="font-black text-zinc-900">{v.marca_modelo}</p>
                      <p className="font-mono font-bold text-amber-800 bg-white px-1.5 py-0.5 rounded border border-zinc-200 mt-1 inline-block">
                        {v.dominio}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{v.km_ultimo_registrado?.toLocaleString()} km</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service History Timeline */}
              <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
                <h4 className="font-extrabold text-sm text-zinc-900 flex items-center gap-2 mb-4">
                  <Wrench className="w-4 h-4 text-amber-500" />
                  Historial Técnico y de Mantenimiento ({selectedOrdenes.length} Remitos)
                </h4>

                {selectedOrdenes.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">No hay remitos de trabajo registrados aún para este cliente.</p>
                ) : (
                  <div className="space-y-4">
                    {selectedOrdenes.map((ot) => {
                      const veh = vehiculos.find((v) => v.id === ot.vehiculo_id);
                      return (
                        <div key={ot.id} className="border border-zinc-200 rounded-lg p-4 bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-mono font-black text-amber-800 text-sm">Remito #{ot.numero_remito}</span>
                              <span className="text-xs text-zinc-500 font-mono ml-3">Fecha: {formatFecha(ot.fecha)}</span>
                            </div>
                            <span className="text-xs font-black font-mono text-zinc-900">{formatPesos(ot.total_final)}</span>
                          </div>

                          <div className="text-xs text-zinc-700 mb-2">
                            <span className="font-bold">Vehículo:</span> {veh?.marca_modelo} ({veh?.dominio}) — {ot.km?.toLocaleString()} km
                          </div>

                          <p className="text-xs text-zinc-800 bg-white p-2 rounded border border-zinc-200 italic mb-3">
                            "{ot.diagnostico_trabajo_realizado}"
                          </p>

                          <div className="flex justify-between items-center text-[11px] text-zinc-500">
                            <span>Mecánico: {ot.mecanico_responsable}</span>
                            <button
                              onClick={() => onPrintRemito(ot)}
                              className="text-amber-800 font-bold underline cursor-pointer"
                            >
                              Ver Comprobante
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white p-12 text-center rounded-xl border border-zinc-200 text-zinc-400">
              Selecciona un cliente para ver sus vehículos e historial de mantenimiento.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
