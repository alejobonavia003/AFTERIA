import React, { useState } from 'react';
import {
  Settings,
  DollarSign,
  Truck,
  Layers,
  Users2,
  Save,
  Plus,
  Trash2
} from 'lucide-react';
import {
  ConfigTarifario,
  Proveedor
} from '../types';
import { formatPesos } from '../utils/calculations';

interface ConfiguracionModuleProps {
  config: ConfigTarifario;
  proveedores: Proveedor[];
  mecanicos: string[];
  tiposTrabajo: string[];
  categoriasGasto: string[];
  onSaveConfig: (cfg: ConfigTarifario) => void;
  onAddProveedor: (prov: Omit<Proveedor, 'id'>) => void;
  onAddMecanico: (nombre: string) => void;
  onAddTipoTrabajo: (tipo: string) => void;
  onAddCategoria: (cat: string) => void;
}

export const ConfiguracionModule: React.FC<ConfiguracionModuleProps> = ({
  config,
  proveedores,
  mecanicos,
  tiposTrabajo,
  categoriasGasto,
  onSaveConfig,
  onAddProveedor,
  onAddMecanico,
  onAddTipoTrabajo,
  onAddCategoria
}) => {
  const [tarifario, setTarifario] = useState<ConfigTarifario>(config);

  // Form states
  const [newProvNombre, setNewProvNombre] = useState('');
  const [newProvDescuento, setNewProvDescuento] = useState(0.20);
  const [newMecanico, setNewMecanico] = useState('');
  const [newTipo, setNewTipo] = useState('');
  const [newCat, setNewCat] = useState('');

  const handleSaveTarifario = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(tarifario);
    alert('¡Tarifario y % de recargo guardados con éxito!');
  };

  const handleCreateProv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvNombre) return;
    onAddProveedor({
      nombre: newProvNombre,
      descuento_pct: newProvDescuento
    });
    setNewProvNombre('');
    setNewProvDescuento(0.20);
  };

  const handleCreateMecanico = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMecanico) return;
    onAddMecanico(newMecanico);
    setNewMecanico('');
  };

  const handleCreateTipo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTipo) return;
    onAddTipoTrabajo(newTipo);
    setNewTipo('');
  };

  const handleCreateCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat) return;
    onAddCategoria(newCat);
    setNewCat('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
        <h2 className="text-lg font-extrabold text-zinc-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-500" />
          Configuración del Sistema, Precios de Referencia y Proveedores
        </h2>
        <p className="text-xs text-zinc-500">
          Ajusta los valores por defecto del taller para que la secretaria cargue presupuestos y remitos con mayor rapidez.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tarifario MO & Recargos */}
        <form onSubmit={handleSaveTarifario} className="bg-white p-5 rounded-xl border border-zinc-200 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-zinc-900 flex items-center gap-2 border-b border-zinc-200 pb-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Tarifario de Mano de Obra & Recargo General
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Hora Mano de Obra ($)</label>
              <input
                type="number"
                value={tarifario.hora_mano_obra}
                onChange={(e) => setTarifario({ ...tarifario, hora_mano_obra: Number(e.target.value) })}
                className="w-full p-2 border border-zinc-300 rounded font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Service Completo Auto ($)</label>
              <input
                type="number"
                value={tarifario.service_auto}
                onChange={(e) => setTarifario({ ...tarifario, service_auto: Number(e.target.value) })}
                className="w-full p-2 border border-zinc-300 rounded font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Service Completo Camioneta / Pick-Up ($)</label>
              <input
                type="number"
                value={tarifario.service_camioneta}
                onChange={(e) => setTarifario({ ...tarifario, service_camioneta: Number(e.target.value) })}
                className="w-full p-2 border border-zinc-300 rounded font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Diagnóstico / Escaneo Computarizado ($)</label>
              <input
                type="number"
                value={tarifario.diagnostico_scanner}
                onChange={(e) => setTarifario({ ...tarifario, diagnostico_scanner: Number(e.target.value) })}
                className="w-full p-2 border border-zinc-300 rounded font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">% Recargo Default Repuestos (ej: 0.20 = 20%)</label>
              <input
                type="number"
                step="0.01"
                value={tarifario.pct_recargo_default}
                onChange={(e) => setTarifario({ ...tarifario, pct_recargo_default: Number(e.target.value) })}
                className="w-full p-2 border border-zinc-300 rounded font-mono font-bold text-amber-800 bg-amber-50"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Save className="w-4 h-4" />
            Guardar Tarifario
          </button>
        </form>

        {/* Catálogo de Proveedores */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-zinc-900 flex items-center gap-2 border-b border-zinc-200 pb-2">
            <Truck className="w-4 h-4 text-blue-600" />
            Proveedores de Repuestos
          </h3>

          <form onSubmit={handleCreateProv} className="flex gap-2">
            <input
              type="text"
              placeholder="Nombre Proveedor..."
              value={newProvNombre}
              onChange={(e) => setNewProvNombre(e.target.value)}
              className="flex-1 p-2 border border-zinc-300 rounded text-xs"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-zinc-900 text-amber-400 font-bold text-xs rounded cursor-pointer"
            >
              + Agregar
            </button>
          </form>

          <div className="divide-y divide-zinc-200 text-xs">
            {proveedores.map((p) => (
              <div key={p.id} className="py-2 flex justify-between items-center">
                <span className="font-bold text-zinc-800">{p.nombre}</span>
                <span className="font-mono text-zinc-500">{(p.descuento_pct * 100).toFixed(0)}% desc. habitual</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de Mecánicos */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-zinc-900 flex items-center gap-2 border-b border-zinc-200 pb-2">
            <Users2 className="w-4 h-4 text-purple-600" />
            Mecánicos Responsables
          </h3>

          <form onSubmit={handleCreateMecanico} className="flex gap-2">
            <input
              type="text"
              placeholder="Nombre mecánico..."
              value={newMecanico}
              onChange={(e) => setNewMecanico(e.target.value)}
              className="flex-1 p-2 border border-zinc-300 rounded text-xs"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-zinc-900 text-amber-400 font-bold text-xs rounded cursor-pointer"
            >
              + Agregar
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {mecanicos.map((m) => (
              <span key={m} className="px-2.5 py-1 bg-purple-100 text-purple-900 font-bold rounded-full text-xs">
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Tipos de Trabajo */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-zinc-900 flex items-center gap-2 border-b border-zinc-200 pb-2">
            <Layers className="w-4 h-4 text-amber-600" />
            Tipos de Servicios / Trabajos
          </h3>

          <form onSubmit={handleCreateTipo} className="flex gap-2">
            <input
              type="text"
              placeholder="Nuevo tipo servicio..."
              value={newTipo}
              onChange={(e) => setNewTipo(e.target.value)}
              className="flex-1 p-2 border border-zinc-300 rounded text-xs"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-zinc-900 text-amber-400 font-bold text-xs rounded cursor-pointer"
            >
              + Agregar
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {tiposTrabajo.map((t) => (
              <span key={t} className="px-2.5 py-1 bg-amber-100 text-amber-900 font-semibold rounded text-xs">
                {t}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
