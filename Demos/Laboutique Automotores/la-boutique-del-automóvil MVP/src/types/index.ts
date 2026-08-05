export type UnidadNegocio = 'Taller' | 'Personal';
export type LibroContable = 'caja' | 'banco';
export type EstadoPresupuesto = 'pendiente' | 'aprobado' | 'rechazado' | 'convertido';
export type EstadoRemito = 'abierto' | 'entregado' | 'facturado' | 'anulado';
export type TipoItem = 'repuesto' | 'mano_obra';
export type MedioPago = 'Efectivo' | 'Transferencia' | 'Cheque' | 'Tarjeta' | 'E-Cheq';

export interface Cliente {
  id: number;
  razon_social: string;
  cuit?: string;
  telefono: string;
  contacto?: string;
  direccion?: string;
  notas?: string;
}

export interface Vehiculo {
  id: number;
  cliente_id: number;
  dominio: string; // Patente
  marca_modelo: string;
  km_ultimo_registrado: number;
}

export interface Proveedor {
  id: number;
  nombre: string;
  cuit?: string;
  contacto?: string;
  producto?: string;
  descuento_pct: number; // Decimal (e.g., 0.20 for 20%)
}

export interface PresupuestoItem {
  id: number;
  presupuesto_id?: number;
  tipo: TipoItem;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  importe: number;
}

export interface Presupuesto {
  id: number;
  numero: number;
  fecha: string;
  cliente_id: number;
  vehiculo_id: number;
  diagnostico: string;
  estado: EstadoPresupuesto;
  remito_generado_id?: number;
  total_estimado: number;
  items: PresupuestoItem[];
}

export interface RemitoItem {
  id: number;
  orden_trabajo_id?: number;
  tipo: TipoItem;
  codigo_repuesto?: string;
  descripcion: string;
  proveedor_id?: number;
  costo_sin_iva: number;
  iva_pct: number; // Standard 0.21
  costo_con_iva: number;
  cantidad: number;
  pct_ganancia: number; // e.g., 0.20 for 20%
  precio_unitario_final: number;
  importe: number;
  responsable?: string; // Mecánico
}

export interface OrdenTrabajo {
  id: number;
  numero_remito: number;
  fecha: string;
  cliente_id: number;
  vehiculo_id: number;
  km: number;
  presupuesto_origen_id?: number;
  diagnostico_trabajo_realizado: string;
  mecanico_responsable: string;
  tipo_trabajo: string;
  estado: EstadoRemito;
  numero_factura?: string;
  total_costo_repuestos: number;
  total_precio_repuestos: number;
  total_mano_obra: number;
  total_sin_iva: number;
  iva: number;
  total_final: number;
  items: RemitoItem[];
}

export interface EntregaPago {
  id: number;
  pago_cliente_id: number;
  numero_entrega: number;
  monto: number;
  fecha: string;
  medio_pago: MedioPago;
  recibo_id?: number;
  numero_recibo?: number;
  notas?: string;
}

export interface PagoCliente {
  id: number;
  orden_trabajo_id: number;
  cliente_id: number;
  total_trabajo: number;
  deuda_pendiente: number;
  metodo_pago_principal: MedioPago;
  meses_deuda: number; // Calculado
  comentario?: string;
  entregas: EntregaPago[];
}

export interface Recibo {
  id: number;
  numero: number;
  fecha: string;
  cliente_id: number;
  orden_trabajo_id?: number;
  monto: number;
  medio_pago: MedioPago;
  concepto: string;
}

export interface MovimientoCajaBanco {
  id: number;
  libro: LibroContable;
  fecha: string;
  concepto: string; // Categoría de gasto/ingreso
  unidad_negocio: UnidadNegocio;
  detalle?: string;
  proveedor?: string;
  tipo_movimiento: MedioPago;
  numero_cheque?: string;
  ingreso?: number;
  egreso?: number;
  iva?: number;
  facturado_a_sas: boolean;
  saldo_acumulado: number;
}

export interface ConfigTarifario {
  hora_mano_obra: number;
  service_auto: number;
  service_camioneta: number;
  diagnostico_scanner: number;
  pct_recargo_default: number; // e.g. 0.20
}
