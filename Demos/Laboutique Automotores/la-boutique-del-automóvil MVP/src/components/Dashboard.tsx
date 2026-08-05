import React from 'react';
import {
  FileSpreadsheet,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Wrench,
  BarChart3,
  PieChart,
  UserCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';
import {
  OrdenTrabajo,
  Cliente,
  PagoCliente,
  MovimientoCajaBanco,
  Vehiculo
} from '../types';
import { formatPesos, formatFecha } from '../utils/calculations';
import { exportRendimientoMensualExcel, exportEstadoDeudoresExcel } from '../utils/excelExport';

interface DashboardProps {
  ordenes: OrdenTrabajo[];
  clientes: Cliente[];
  vehiculos: Vehiculo[];
  pagos: PagoCliente[];
  movimientos: MovimientoCajaBanco[];
  onNavigateTab: (tab: any) => void;
}

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#06b6d4', '#64748b'];

export const Dashboard: React.FC<DashboardProps> = ({
  ordenes,
  clientes,
  vehiculos,
  pagos,
  movimientos,
  onNavigateTab
}) => {
  // 1. Total Facturado
  const totalFacturado = ordenes.reduce((sum, o) => sum + o.total_final, 0);
  const totalCostoRepuestos = ordenes.reduce((sum, o) => sum + o.total_costo_repuestos, 0);
  const margenTotalTaller = totalFacturado - totalCostoRepuestos;
  const pctMargenPromedio = totalFacturado > 0 ? ((margenTotalTaller / totalFacturado) * 100).toFixed(1) : '0';

  // 2. Deuda Activa
  const deudoresList = pagos.filter((p) => p.deuda_pendiente > 0);
  const totalDeudaActiva = deudoresList.reduce((sum, p) => sum + p.deuda_pendiente, 0);
  const deudoresCriticosCount = deudoresList.filter((p) => p.meses_deuda >= 3).length;

  // 3. Saldo Caja / Banco (Taller vs Personal)
  const tallerIngresos = movimientos.filter((m) => m.unidad_negocio === 'Taller').reduce((sum, m) => sum + (m.ingreso || 0), 0);
  const tallerEgresos = movimientos.filter((m) => m.unidad_negocio === 'Taller').reduce((sum, m) => sum + (m.egreso || 0), 0);
  const saldoTallerNeto = tallerIngresos - tallerEgresos;

  const personalEgresos = movimientos.filter((m) => m.unidad_negocio === 'Personal').reduce((sum, m) => sum + (m.egreso || 0), 0);

  // 4. Data for Charts: Facturación por Tipo de Trabajo
  const tiposMap: Record<string, number> = {};
  ordenes.forEach((o) => {
    const tipo = o.tipo_trabajo || 'General';
    tiposMap[tipo] = (tiposMap[tipo] || 0) + o.total_final;
  });
  const dataTiposTrabajo = Object.keys(tiposMap).map((key) => ({
    name: key,
    facturado: tiposMap[key]
  }));

  // 5. Data for Charts: Facturación por Mecánico
  const mecanicoMap: Record<string, { total: number; mo: number }> = {};
  ordenes.forEach((o) => {
    const mec = o.mecanico_responsable || 'Taller';
    if (!mecanicoMap[mec]) mecanicoMap[mec] = { total: 0, mo: 0 };
    mecanicoMap[mec].total += o.total_final;
    mecanicoMap[mec].mo += o.total_mano_obra;
  });
  const dataMecanicos = Object.keys(mecanicoMap).map((key) => ({
    mecanico: key,
    FacturadoTotal: mecanicoMap[key].total,
    ManoDeObra: mecanicoMap[key].mo
  }));

  // 6. Data for Charts: Gastos por Categoría
  const gastosCatMap: Record<string, number> = {};
  movimientos.filter((m) => (m.egreso || 0) > 0).forEach((m) => {
    gastosCatMap[m.concepto] = (gastosCatMap[m.concepto] || 0) + (m.egreso || 0);
  });
  const dataGastosCategoria = Object.keys(gastosCatMap).map((key) => ({
    name: key,
    value: gastosCatMap[key]
  }));

  // 7. Data for Taller vs Personal Chart
  const dataTallerVS = [
    { name: 'Ingresos Taller', monto: tallerIngresos },
    { name: 'Egresos Taller', monto: tallerEgresos },
    { name: 'Gastos Personales Dueño', monto: personalEgresos }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner & Fast Actions */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-xl p-6 shadow-md border border-zinc-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>Tablero Ejecutivo de Control & Rendimiento</span>
            </div>
            <h1 className="text-2xl font-black text-white">La Boutique del Automóvil</h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Panel general de facturación, caja, deudas de clientes y reportes automáticos en Excel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => exportRendimientoMensualExcel(ordenes, clientes, vehiculos, pagos, 'Julio 2026')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Descargar Excel Rendimiento Mensual</span>
            </button>

            <button
              onClick={() => exportEstadoDeudoresExcel(pagos, ordenes, clientes, vehiculos)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar Excel Deudores</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Facturación Total */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Facturación Total</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-zinc-900 font-mono mt-2">
            {formatPesos(totalFacturado)}
          </p>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <span>Margen Bruto: {formatPesos(margenTotalTaller)} ({pctMargenPromedio}%)</span>
          </div>
        </div>

        {/* KPI 2: Deuda Clientes */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Deuda Pendiente</span>
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-red-600 font-mono mt-2">
            {formatPesos(totalDeudaActiva)}
          </p>
          <div className="mt-2 text-[11px] text-zinc-500 font-medium flex items-center justify-between">
            <span>{deudoresList.length} clientes con saldo</span>
            {deudoresCriticosCount > 0 && (
              <span className="text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                {deudoresCriticosCount} alerte (+3m)
              </span>
            )}
          </div>
        </div>

        {/* KPI 3: Saldo Neto Taller */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Resultado Caja/Banco Taller</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700 font-mono mt-2">
            {formatPesos(saldoTallerNeto)}
          </p>
          <div className="mt-2 text-[11px] text-zinc-500 font-medium">
            <span>Ingresos: {formatPesos(tallerIngresos)}</span>
          </div>
        </div>

        {/* KPI 4: Gastos Personales Dueño */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Gastos Personales Dueño</span>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-900 font-mono mt-2">
            {formatPesos(personalEgresos)}
          </p>
          <div className="mt-2 text-[11px] text-purple-700 font-medium">
            <span>Separado de la contabilidad Taller</span>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Rendimiento por Tipo de Trabajo */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-500" />
              Facturación por Tipo de Trabajo
            </h3>
            <span className="text-xs text-zinc-500 font-mono">{ordenes.length} Remitos</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataTiposTrabajo} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip formatter={(value: number) => [formatPesos(value), 'Total Facturado']} />
                <Bar dataKey="facturado" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Facturación y Mano de Obra por Mecánico */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-500" />
              Rendimiento por Mecánico Responsable
            </h3>
            <span className="text-xs text-zinc-500 font-mono">Facturación vs MO</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataMecanicos} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="mecanico" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip formatter={(value: number) => formatPesos(value)} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="FacturadoTotal" name="Total Facturado" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ManoDeObra" name="Mano de Obra Generada" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Categorías de Gasto */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-500" />
              Distribución de Gastos por Categoría
            </h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={dataGastosCategoria}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {dataGastosCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatPesos(value)} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Taller vs Personal Balance */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              Separación Contable: Taller vs Gastos Personales
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataTallerVS} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip formatter={(value: number) => formatPesos(value)} />
                <Bar dataKey="monto" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Critical Debtors Alert List */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-sm font-extrabold text-zinc-900">
              Atención Secretaria: Clientes con Deuda Antigüedad +60 y +90 días
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('cobranzas')}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 underline cursor-pointer"
          >
            Ir a Gestión de Cobranzas →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-100 text-zinc-700 font-bold border-b border-zinc-200">
                <th className="p-3">Cliente</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3">Remito Nº</th>
                <th className="p-3 text-right">Total Trab.</th>
                <th className="p-3 text-right">Deuda Pendiente</th>
                <th className="p-3 text-center">Antigüedad</th>
                <th className="p-3">Comentarios / Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {deudoresList.map((pago) => {
                const cli = clientes.find((c) => c.id === pago.cliente_id);
                const ot = ordenes.find((o) => o.id === pago.orden_trabajo_id);
                const isCritico = pago.meses_deuda >= 3;

                return (
                  <tr key={pago.id} className={isCritico ? 'bg-red-50/50' : 'hover:bg-zinc-50'}>
                    <td className="p-3 font-bold text-zinc-900">{cli?.razon_social}</td>
                    <td className="p-3 text-zinc-600 font-mono">{cli?.telefono}</td>
                    <td className="p-3 font-mono font-bold text-zinc-800">#{ot?.numero_remito}</td>
                    <td className="p-3 text-right font-mono">{formatPesos(pago.total_trabajo)}</td>
                    <td className="p-3 text-right font-mono font-black text-red-600">
                      {formatPesos(pago.deuda_pendiente)}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          pago.meses_deuda >= 3
                            ? 'bg-red-100 text-red-700 border border-red-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {pago.meses_deuda} {pago.meses_deuda === 1 ? 'mes' : 'meses'}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-600 italic">{pago.comentario || 'Sin observaciones'}</td>
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
