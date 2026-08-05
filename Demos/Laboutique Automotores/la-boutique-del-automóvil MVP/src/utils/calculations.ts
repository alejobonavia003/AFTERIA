import { RemitoItem, OrdenTrabajo, PagoCliente } from '../types';

export const IVA_DEFAULT = 0.21;
export const GANANCIA_DEFAULT = 0.20;

export function calcularItemRepuesto(
  costoSinIva: number,
  cantidad: number,
  pctGanancia: number = GANANCIA_DEFAULT,
  ivaPct: number = IVA_DEFAULT
) {
  const costoConIva = Number((costoSinIva * (1 + ivaPct)).toFixed(2));
  const precioUnitarioFinal = Number((costoConIva * (1 + pctGanancia)).toFixed(2));
  const importe = Number((precioUnitarioFinal * cantidad).toFixed(2));
  const costoTotal = Number((costoConIva * cantidad).toFixed(2));
  const gananciaItems = Number((importe - costoTotal).toFixed(2));

  return {
    costoConIva,
    precioUnitarioFinal,
    importe,
    costoTotal,
    gananciaItems
  };
}

export function calcularTotalesRemito(items: RemitoItem[]) {
  let totalCostoRepuestos = 0;
  let totalPrecioRepuestos = 0;
  let totalManoObra = 0;

  items.forEach((item) => {
    if (item.tipo === 'repuesto') {
      const costoIndividual = item.costo_con_iva > 0 
        ? item.costo_con_iva 
        : item.costo_sin_iva * (1 + (item.iva_pct || IVA_DEFAULT));
      
      totalCostoRepuestos += costoIndividual * item.cantidad;
      totalPrecioRepuestos += item.importe;
    } else {
      totalManoObra += item.importe;
    }
  });

  totalCostoRepuestos = Number(totalCostoRepuestos.toFixed(2));
  totalPrecioRepuestos = Number(totalPrecioRepuestos.toFixed(2));
  totalManoObra = Number(totalManoObra.toFixed(2));

  const totalFinal = Number((totalPrecioRepuestos + totalManoObra).toFixed(2));
  const totalSinIva = Number((totalFinal / (1 + IVA_DEFAULT)).toFixed(2));
  const iva = Number((totalFinal - totalSinIva).toFixed(2));
  const margenGananciaBruta = Number((totalFinal - totalCostoRepuestos).toFixed(2));
  const porcentajeMargen = totalFinal > 0 
    ? Number(((margenGananciaBruta / totalFinal) * 100).toFixed(1)) 
    : 0;

  return {
    totalCostoRepuestos,
    totalPrecioRepuestos,
    totalManoObra,
    totalSinIva,
    iva,
    totalFinal,
    margenGananciaBruta,
    porcentajeMargen
  };
}

export function calcularMesesDeuda(fechaRemitoStr: string): number {
  if (!fechaRemitoStr) return 0;
  const fechaRemito = new Date(fechaRemitoStr);
  const hoy = new Date();
  
  if (isNaN(fechaRemito.getTime())) return 0;

  const diffAnios = hoy.getFullYear() - fechaRemito.getFullYear();
  const diffMeses = (diffAnios * 12) + (hoy.getMonth() - fechaRemito.getMonth());

  // If debt is from previous days in same month, 0. If 30+ days, at least 1 month.
  if (diffMeses <= 0) {
    const diffDays = Math.floor((hoy.getTime() - fechaRemito.getTime()) / (1000 * 3600 * 24));
    return diffDays >= 30 ? 1 : 0;
  }
  return diffMeses;
}

export function calcularDeudaPendiente(pago: PagoCliente): number {
  const totalPagado = pago.entregas.reduce((sum, e) => sum + e.monto, 0);
  return Math.max(0, Number((pago.total_trabajo - totalPagado).toFixed(2)));
}

export function formatPesos(monto: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(monto || 0);
}

export function formatFecha(fechaStr: string): string {
  if (!fechaStr) return '';
  const parts = fechaStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return fechaStr;
}
