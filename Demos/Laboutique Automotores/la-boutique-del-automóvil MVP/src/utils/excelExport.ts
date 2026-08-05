import * as XLSX from 'xlsx';
import {
  OrdenTrabajo,
  Cliente,
  Vehiculo,
  PagoCliente,
  MovimientoCajaBanco
} from '../types';
import { formatPesos, formatFecha } from './calculations';

export function exportRendimientoMensualExcel(
  ordenes: OrdenTrabajo[],
  clientes: Cliente[],
  vehiculos: Vehiculo[],
  pagos: PagoCliente[],
  periodoNombre: string = 'Julio 2026'
) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Detalle de Ventas y Remitos
  const remitosRows = ordenes.map((ot) => {
    const cli = clientes.find((c) => c.id === ot.cliente_id);
    const veh = vehiculos.find((v) => v.id === ot.vehiculo_id);
    const pago = pagos.find((p) => p.orden_trabajo_id === ot.id);
    const totalCobrado = pago ? pago.entregas.reduce((acc, e) => acc + e.monto, 0) : 0;
    const saldoPendiente = ot.total_final - totalCobrado;
    const margen = ot.total_final - ot.total_costo_repuestos;

    return {
      'Nº Remito': ot.numero_remito,
      'Fecha': formatFecha(ot.fecha),
      'Cliente': cli ? cli.razon_social : 'Desconocido',
      'Vehículo': veh ? `${veh.marca_modelo} (${veh.dominio})` : '',
      'Dominio': veh?.dominio || '',
      'Km': ot.km,
      'Mecánico': ot.mecanico_responsable,
      'Tipo Trabajo': ot.tipo_trabajo,
      'Costo Repuestos ($)': ot.total_costo_repuestos,
      'Precio Repuestos ($)': ot.total_precio_repuestos,
      'Mano de Obra ($)': ot.total_mano_obra,
      'Total Facturado ($)': ot.total_final,
      'Margen Bruto Taller ($)': margen,
      '% Margen': ot.total_final > 0 ? `${((margen / ot.total_final) * 100).toFixed(1)}%` : '0%',
      'Total Cobrado ($)': totalCobrado,
      'Deuda Pendiente ($)': Math.max(0, saldoPendiente),
      'Estado Remito': ot.estado.toUpperCase()
    };
  });

  const wsRemitos = XLSX.utils.json_to_sheet(remitosRows);
  XLSX.utils.book_append_sheet(wb, wsRemitos, 'Detalle Remitos');

  // Sheet 2: Resumen por Mecánico
  const mecanicosMap: Record<string, { totalFacturado: number; remitosCount: number; manoObra: number }> = {};
  ordenes.forEach((ot) => {
    const mec = ot.mecanico_responsable || 'Sin asignar';
    if (!mecanicosMap[mec]) {
      mecanicosMap[mec] = { totalFacturado: 0, remitosCount: 0, manoObra: 0 };
    }
    mecanicosMap[mec].totalFacturado += ot.total_final;
    mecanicosMap[mec].remitosCount += 1;
    mecanicosMap[mec].manoObra += ot.total_mano_obra;
  });

  const mecRows = Object.keys(mecanicosMap).map((mec) => ({
    'Mecánico Responsable': mec,
    'Cantidad Trabalos': mecanicosMap[mec].remitosCount,
    'Mano de Obra Generada ($)': mecanicosMap[mec].manoObra,
    'Total Facturado ($)': mecanicosMap[mec].totalFacturado,
    'Promedio por Trabajo ($)': Math.round(mecanicosMap[mec].totalFacturado / mecanicosMap[mec].remitosCount)
  }));

  const wsMecanicos = XLSX.utils.json_to_sheet(mecRows);
  XLSX.utils.book_append_sheet(wb, wsMecanicos, 'Rendimiento Mecánicos');

  // Sheet 3: Rendimiento por Tipo de Trabajo
  const tiposMap: Record<string, { total: number; count: number }> = {};
  ordenes.forEach((ot) => {
    const tipo = ot.tipo_trabajo || 'General';
    if (!tiposMap[tipo]) {
      tiposMap[tipo] = { total: 0, count: 0 };
    }
    tiposMap[tipo].total += ot.total_final;
    tiposMap[tipo].count += 1;
  });

  const tiposRows = Object.keys(tiposMap).map((tipo) => ({
    'Tipo de Servicio / Trabajo': tipo,
    'Cantidad Trabajos': tiposMap[tipo].count,
    'Total Facturado ($)': tiposMap[tipo].total,
    '% del Total': `${((tiposMap[tipo].total / (ordenes.reduce((sum, o) => sum + o.total_final, 0) || 1)) * 100).toFixed(1)}%`
  }));

  const wsTipos = XLSX.utils.json_to_sheet(tiposRows);
  XLSX.utils.book_append_sheet(wb, wsTipos, 'Rendimiento Servicios');

  // Trigger download
  const filename = `LaBoutique_Rendimiento_Mensual_${periodoNombre.replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export function exportEstadoDeudoresExcel(
  pagos: PagoCliente[],
  ordenes: OrdenTrabajo[],
  clientes: Cliente[],
  vehiculos: Vehiculo[]
) {
  const wb = XLSX.utils.book_new();

  const deudoresRows = pagos
    .filter((p) => p.deuda_pendiente > 0)
    .map((p) => {
      const ot = ordenes.find((o) => o.id === p.orden_trabajo_id);
      const cli = clientes.find((c) => c.id === p.cliente_id);
      const veh = ot ? vehiculos.find((v) => v.id === ot.vehiculo_id) : null;
      const totalPagado = p.entregas.reduce((sum, e) => sum + e.monto, 0);

      return {
        'Cliente': cli ? cli.razon_social : 'Desconocido',
        'Teléfono': cli?.telefono || '',
        'Remito Nº': ot ? ot.numero_remito : 'N/A',
        'Fecha Trab.': ot ? formatFecha(ot.fecha) : '',
        'Vehículo / Patente': veh ? `${veh.marca_modelo} (${veh.dominio})` : '',
        'Total Trabajo ($)': p.total_trabajo,
        'Total Pagado ($)': totalPagado,
        'Deuda Pendiente ($)': p.deuda_pendiente,
        'Meses de Deuda': p.meses_deuda,
        'Estado Alerta': p.meses_deuda >= 3 ? '🔴 ALERTA (+3 meses)' : p.meses_deuda >= 2 ? '🟡 ATENCIÓN (+2 meses)' : '🟢 Al día',
        'Comentarios': p.comentario || ''
      };
    });

  const ws = XLSX.utils.json_to_sheet(deudoresRows);
  XLSX.utils.book_append_sheet(wb, ws, 'Deudores y Cuentas Corrientes');

  XLSX.writeFile(wb, `LaBoutique_Cuentas_Corrientes_Deuda.xlsx`);
}

export function exportLibroCajaBancoExcel(
  movimientos: MovimientoCajaBanco[],
  libroFilter: 'caja' | 'banco' | 'todos' = 'todos'
) {
  const wb = XLSX.utils.book_new();

  const filtered = movimientos.filter((m) => libroFilter === 'todos' || m.libro === libroFilter);

  const rows = filtered.map((m) => ({
    'ID': m.id,
    'Libro': m.libro.toUpperCase(),
    'Fecha': formatFecha(m.fecha),
    'Concepto / Categoría': m.concepto,
    'Unidad de Negocio': m.unidad_negocio,
    'Detalle': m.detalle || '',
    'Proveedor / Entidad': m.proveedor || '',
    'Medio Pago': m.tipo_movimiento,
    'Nº Cheque': m.numero_cheque || '',
    'Ingreso ($)': m.ingreso || 0,
    'Egreso ($)': m.egreso || 0,
    'Facturado SAS': m.facturado_a_sas ? 'SÍ' : 'NO',
    'Saldo Acumulado ($)': m.saldo_acumulado
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Movimientos Contables');

  // Summary Sheet (Taller vs Personal)
  const tallerIngresos = filtered.filter(m => m.unidad_negocio === 'Taller').reduce((s, m) => s + (m.ingreso || 0), 0);
  const tallerEgresos = filtered.filter(m => m.unidad_negocio === 'Taller').reduce((s, m) => s + (m.egreso || 0), 0);
  const personalEgresos = filtered.filter(m => m.unidad_negocio === 'Personal').reduce((s, m) => s + (m.egreso || 0), 0);

  const summaryRows = [
    { 'Concepto': 'Ingresos Taller', 'Monto ($)': tallerIngresos },
    { 'Concepto': 'Egresos Taller', 'Monto ($)': tallerEgresos },
    { 'Concepto': 'Resultado Neto Taller', 'Monto ($)': tallerIngresos - tallerEgresos },
    { 'Concepto': 'Gastos Personales Dueño (Cristian B.)', 'Monto ($)': personalEgresos },
    { 'Concepto': 'Total Egresos Combinados', 'Monto ($)': tallerEgresos + personalEgresos }
  ];

  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen Taller vs Personal');

  XLSX.writeFile(wb, `LaBoutique_Libro_${libroFilter.toUpperCase()}_Contabilidad.xlsx`);
}
