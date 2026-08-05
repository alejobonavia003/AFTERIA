import {
  Cliente,
  Vehiculo,
  Proveedor,
  Presupuesto,
  OrdenTrabajo,
  PagoCliente,
  MovimientoCajaBanco,
  ConfigTarifario,
  Recibo
} from '../types';

export const initialClientes: Cliente[] = [
  {
    id: 1,
    razon_social: 'Pérez Juan',
    cuit: '20-28491029-4',
    telefono: '03385-15601234',
    contacto: 'Juan Pérez',
    direccion: 'Av. Independencia 450, Laboulaye',
    notas: 'Cliente habitual'
  },
  {
    id: 2,
    razon_social: 'Agropecuaria El Sol S.A.',
    cuit: '30-71122334-9',
    telefono: '03385-421980',
    contacto: 'Ing. Martinelli',
    direccion: 'Ruta 7 Km 480, Laboulaye',
    notas: 'Cuenta corriente habilitada. Flota de camionetas.'
  },
  {
    id: 3,
    razon_social: 'Transportes Deheza SAS',
    cuit: '30-71889900-1',
    telefono: '03385-428800',
    contacto: 'Luciano Deheza',
    direccion: 'Gral. Deheza 320, Laboulaye',
    notas: 'Servicios de distribución y camionetas'
  },
  {
    id: 4,
    razon_social: 'Municipalidad de Laboulaye',
    cuit: '30-67123456-2',
    telefono: '03385-426000',
    contacto: 'Mantenimiento Vehicular',
    direccion: 'Av. España 120, Laboulaye',
    notas: 'Facturación obligatoria a SAS con orden de compra'
  },
  {
    id: 5,
    razon_social: 'Gómez María Laura',
    cuit: '27-32109876-4',
    telefono: '03385-15498210',
    contacto: 'María',
    direccion: 'Dorrego 180, Laboulaye',
    notas: 'Particular - Service anual'
  },
  {
    id: 6,
    razon_social: 'Banchio Roberto',
    cuit: '20-18902134-8',
    telefono: '03385-15510099',
    contacto: 'Roberto',
    direccion: 'Italia 85, Laboulaye',
    notas: 'Cliente con cuotas pendientes'
  }
];

export const initialVehiculos: Vehiculo[] = [
  {
    id: 101,
    cliente_id: 1,
    dominio: 'AB123CD',
    marca_modelo: 'Peugeot 208 1.6 Feline',
    km_ultimo_registrado: 95398
  },
  {
    id: 102,
    cliente_id: 2,
    dominio: 'AA456EF',
    marca_modelo: 'Toyota Hilux 2.8 4x4 SRV',
    km_ultimo_registrado: 184200
  },
  {
    id: 103,
    cliente_id: 3,
    dominio: 'AF789GH',
    marca_modelo: 'Ford Ranger 3.2 Limited',
    km_ultimo_registrado: 112000
  },
  {
    id: 104,
    cliente_id: 4,
    dominio: 'AD321XY',
    marca_modelo: 'Volkswagen Amarok V6',
    km_ultimo_registrado: 145000
  },
  {
    id: 105,
    cliente_id: 5,
    dominio: 'AE901JK',
    marca_modelo: 'Volkswagen Gol Trend 1.6',
    km_ultimo_registrado: 68500
  },
  {
    id: 106,
    cliente_id: 6,
    dominio: 'AC654LM',
    marca_modelo: 'Chevrolet S10 High Country',
    km_ultimo_registrado: 198000
  }
];

export const initialProveedores: Proveedor[] = [
  {
    id: 1,
    nombre: 'Repuestos Sur',
    cuit: '30-65432109-1',
    contacto: '0358-4621000',
    producto: 'Distribución, amortiguadores, tren delantero',
    descuento_pct: 0.15
  },
  {
    id: 2,
    nombre: 'Distribuidora Córdoba Repuestos',
    cuit: '30-70891234-5',
    contacto: '0351-4890011',
    producto: 'Filtros, lubricantes, bujías, correas',
    descuento_pct: 0.20
  },
  {
    id: 3,
    nombre: 'Taller (Stock Propio)',
    cuit: '',
    contacto: 'Cristian Bongiovanni',
    producto: 'Stock almacenado en taller',
    descuento_pct: 0.20
  }
];

export const initialConfigTarifario: ConfigTarifario = {
  hora_mano_obra: 35000,
  service_auto: 90000,
  service_camioneta: 130000,
  diagnostico_scanner: 25000,
  pct_recargo_default: 0.20
};

export const initialPresupuestos: Presupuesto[] = [
  {
    id: 1,
    numero: 224,
    fecha: '2026-07-15',
    cliente_id: 1,
    vehiculo_id: 101,
    diagnostico: 'Desarmar suspensión de ambos lados. Cambiar amortiguadores. Regulación de convergencia.',
    estado: 'convertido',
    remito_generado_id: 2392,
    total_estimado: 236000,
    items: [
      {
        id: 101,
        tipo: 'mano_obra',
        descripcion: 'Mano de obra suspensión y alineación',
        cantidad: 1,
        precio_unitario: 150000,
        importe: 150000
      },
      {
        id: 102,
        tipo: 'repuesto',
        descripcion: 'Amortiguadores delanteros (Par)',
        cantidad: 2,
        precio_unitario: 43000,
        importe: 86000
      }
    ]
  },
  {
    id: 2,
    numero: 225,
    fecha: '2026-07-28',
    cliente_id: 5,
    vehiculo_id: 105,
    diagnostico: 'Ruido en rueda delantera derecha. Revisar frenos y disco.',
    estado: 'pendiente',
    total_estimado: 142000,
    items: [
      {
        id: 103,
        tipo: 'mano_obra',
        descripcion: 'Cambio de pastillas y rectificado de discos',
        cantidad: 1,
        precio_unitario: 70000,
        importe: 70000
      },
      {
        id: 104,
        tipo: 'repuesto',
        descripcion: 'Juego de pastillas de freno Frasle Gol',
        cantidad: 1,
        precio_unitario: 72000,
        importe: 72000
      }
    ]
  }
];

export const initialOrdenesTrabajo: OrdenTrabajo[] = [
  {
    id: 1,
    numero_remito: 2392,
    fecha: '2026-07-20',
    cliente_id: 1,
    vehiculo_id: 101,
    km: 95398,
    presupuesto_origen_id: 1,
    diagnostico_trabajo_realizado: 'Service completo. Cambio de aceite y filtros. Control general del vehículo.',
    mecanico_responsable: 'Federico',
    tipo_trabajo: 'Service',
    estado: 'facturado',
    numero_factura: 'F-0001-00001243',
    total_costo_repuestos: 66150,
    total_precio_repuestos: 92610,
    total_mano_obra: 100000,
    total_sin_iva: 159190.08,
    iva: 33429.92,
    total_final: 192610,
    items: [
      {
        id: 1,
        tipo: 'mano_obra',
        descripcion: 'Mano de obra service y escaneo',
        costo_sin_iva: 0,
        iva_pct: 0.21,
        costo_con_iva: 0,
        cantidad: 1,
        pct_ganancia: 0,
        precio_unitario_final: 100000,
        importe: 100000,
        responsable: 'Federico'
      },
      {
        id: 2,
        tipo: 'repuesto',
        codigo_repuesto: 'FILTR-KIT-208',
        descripcion: 'Kit de 4 filtros (Aceite, Aire, Combustible, Habitáculo)',
        proveedor_id: 2,
        costo_sin_iva: 50000,
        iva_pct: 0.21,
        costo_con_iva: 60500,
        cantidad: 1,
        pct_ganancia: 0.37,
        precio_unitario_final: 83000,
        importe: 83000
      },
      {
        id: 3,
        tipo: 'repuesto',
        codigo_repuesto: 'LUB-10W40',
        descripcion: 'Aceite motor sintetico Total 10w40 (litros)',
        proveedor_id: 2,
        costo_sin_iva: 2700,
        iva_pct: 0.21,
        costo_con_iva: 3267,
        cantidad: 4.5,
        pct_ganancia: 0.28,
        precio_unitario_final: 2135.55,
        importe: 9610
      }
    ]
  },
  {
    id: 2,
    numero_remito: 2393,
    fecha: '2026-05-10',
    cliente_id: 2,
    vehiculo_id: 102,
    km: 184200,
    diagnostico_trabajo_realizado: 'Cambio de correa de distribución, bomba de agua y tensores.',
    mecanico_responsable: 'Juan Carlos',
    tipo_trabajo: 'Distribución',
    estado: 'entregado',
    total_costo_repuestos: 185000,
    total_precio_repuestos: 259000,
    total_mano_obra: 160000,
    total_sin_iva: 346280.99,
    iva: 72719.01,
    total_final: 419000,
    items: [
      {
        id: 4,
        tipo: 'mano_obra',
        descripcion: 'Mano de obra distribución Toyota Hilux',
        costo_sin_iva: 0,
        iva_pct: 0.21,
        costo_con_iva: 0,
        cantidad: 1,
        pct_ganancia: 0,
        precio_unitario_final: 160000,
        importe: 160000,
        responsable: 'Juan Carlos'
      },
      {
        id: 5,
        tipo: 'repuesto',
        codigo_repuesto: 'DIST-HILUX-28',
        descripcion: 'Kit Distribución Gates + Bomba Agua Dolz',
        proveedor_id: 1,
        costo_sin_iva: 152892.56,
        iva_pct: 0.21,
        costo_con_iva: 185000,
        cantidad: 1,
        pct_ganancia: 0.40,
        precio_unitario_final: 259000,
        importe: 259000
      }
    ]
  },
  {
    id: 3,
    numero_remito: 2394,
    fecha: '2026-04-15',
    cliente_id: 6,
    vehiculo_id: 106,
    km: 198000,
    diagnostico_trabajo_realizado: 'Embrague completo nuevo (Disco, placa, crapodina hidráulica). Rectificado de volante.',
    mecanico_responsable: 'Federico',
    tipo_trabajo: 'Embrague',
    estado: 'entregado',
    total_costo_repuestos: 290000,
    total_precio_repuestos: 390000,
    total_mano_obra: 190000,
    total_sin_iva: 479338.84,
    iva: 100661.16,
    total_final: 580000,
    items: [
      {
        id: 6,
        tipo: 'mano_obra',
        descripcion: 'Mano de obra bajada de caja y embrague',
        costo_sin_iva: 0,
        iva_pct: 0.21,
        costo_con_iva: 0,
        cantidad: 1,
        pct_ganancia: 0,
        precio_unitario_final: 190000,
        importe: 190000
      },
      {
        id: 7,
        tipo: 'repuesto',
        codigo_repuesto: 'EMBR-S10-LUK',
        descripcion: 'Kit Embrague LUK S10 + Crapodina',
        proveedor_id: 1,
        costo_sin_iva: 239669.42,
        iva_pct: 0.21,
        costo_con_iva: 290000,
        cantidad: 1,
        pct_ganancia: 0.34,
        precio_unitario_final: 390000,
        importe: 390000
      }
    ]
  },
  {
    id: 4,
    numero_remito: 2395,
    fecha: '2026-07-25',
    cliente_id: 3,
    vehiculo_id: 103,
    km: 112000,
    diagnostico_trabajo_realizado: 'Reparación de tren delantero, extremos de dirección y parilla de suspensión.',
    mecanico_responsable: 'Juan Carlos',
    tipo_trabajo: 'Tren Delantero',
    estado: 'abierto',
    total_costo_repuestos: 120000,
    total_precio_repuestos: 168000,
    total_mano_obra: 110000,
    total_sin_iva: 229752.06,
    iva: 48247.94,
    total_final: 278000,
    items: [
      {
        id: 8,
        tipo: 'mano_obra',
        descripcion: 'Mano de obra tren delantero Ranger',
        costo_sin_iva: 0,
        iva_pct: 0.21,
        costo_con_iva: 0,
        cantidad: 1,
        pct_ganancia: 0,
        precio_unitario_final: 110000,
        importe: 110000
      },
      {
        id: 9,
        tipo: 'repuesto',
        codigo_repuesto: 'TREN-RANGER-KIT',
        descripcion: 'Parrillas inferiores + Extremos de dirección',
        proveedor_id: 1,
        costo_sin_iva: 99173.55,
        iva_pct: 0.21,
        costo_con_iva: 120000,
        cantidad: 1,
        pct_ganancia: 0.40,
        precio_unitario_final: 168000,
        importe: 168000
      }
    ]
  }
];

export const initialPagosClientes: PagoCliente[] = [
  {
    id: 1,
    orden_trabajo_id: 1,
    cliente_id: 1,
    total_trabajo: 192610,
    deuda_pendiente: 92610,
    metodo_pago_principal: 'Transferencia',
    meses_deuda: 0,
    comentario: 'Abonó primera entrega en efectivo, saldo paga a fin de mes.',
    entregas: [
      {
        id: 501,
        pago_cliente_id: 1,
        numero_entrega: 1,
        monto: 100000,
        fecha: '2026-07-22',
        medio_pago: 'Efectivo',
        recibo_id: 1001,
        numero_recibo: 1,
        notas: 'Entrega inicial retira auto'
      }
    ]
  },
  {
    id: 2,
    orden_trabajo_id: 2,
    cliente_id: 2,
    total_trabajo: 419000,
    deuda_pendiente: 219000,
    metodo_pago_principal: 'Cheque',
    meses_deuda: 2,
    comentario: 'Agropecuaria El Sol - Pendiente cheque de pago diferido a 60 días.',
    entregas: [
      {
        id: 502,
        pago_cliente_id: 2,
        numero_entrega: 1,
        monto: 200000,
        fecha: '2026-05-12',
        medio_pago: 'Transferencia',
        recibo_id: 1002,
        numero_recibo: 2,
        notas: 'Anticipo repuestos'
      }
    ]
  },
  {
    id: 3,
    orden_trabajo_id: 3,
    cliente_id: 6,
    total_trabajo: 580000,
    deuda_pendiente: 380000,
    metodo_pago_principal: 'Efectivo',
    meses_deuda: 3,
    comentario: 'Banchio Roberto - Deuda arrastrada desde Abril. Prometió cancelar con cosecha.',
    entregas: [
      {
        id: 503,
        pago_cliente_id: 3,
        numero_entrega: 1,
        monto: 100000,
        fecha: '2026-04-16',
        medio_pago: 'Efectivo',
        recibo_id: 1003,
        numero_recibo: 3,
        notas: 'Pago entrega 1'
      },
      {
        id: 504,
        pago_cliente_id: 3,
        numero_entrega: 2,
        monto: 100000,
        fecha: '2026-05-20',
        medio_pago: 'Efectivo',
        recibo_id: 1004,
        numero_recibo: 4,
        notas: 'Pago entrega 2'
      }
    ]
  },
  {
    id: 4,
    orden_trabajo_id: 4,
    cliente_id: 3,
    total_trabajo: 278000,
    deuda_pendiente: 0,
    metodo_pago_principal: 'Transferencia',
    meses_deuda: 0,
    comentario: 'Pagado en totalidad al retirar.',
    entregas: [
      {
        id: 505,
        pago_cliente_id: 4,
        numero_entrega: 1,
        monto: 278000,
        fecha: '2026-07-25',
        medio_pago: 'Transferencia',
        recibo_id: 1005,
        numero_recibo: 5,
        notas: 'Pago total transferencia bancaria'
      }
    ]
  }
];

export const initialRecibos: Recibo[] = [
  {
    id: 1001,
    numero: 1,
    fecha: '2026-07-22',
    cliente_id: 1,
    orden_trabajo_id: 1,
    monto: 100000,
    medio_pago: 'Efectivo',
    concepto: 'Entrega 1 - Remito Nº 2392'
  },
  {
    id: 1002,
    numero: 2,
    fecha: '2026-05-12',
    cliente_id: 2,
    orden_trabajo_id: 2,
    monto: 200000,
    medio_pago: 'Transferencia',
    concepto: 'Entrega 1 - Remito Nº 2393'
  },
  {
    id: 1003,
    numero: 3,
    fecha: '2026-04-16',
    cliente_id: 6,
    orden_trabajo_id: 3,
    monto: 100000,
    medio_pago: 'Efectivo',
    concepto: 'Entrega 1 - Remito Nº 2394'
  },
  {
    id: 1004,
    numero: 4,
    fecha: '2026-05-20',
    cliente_id: 6,
    orden_trabajo_id: 3,
    monto: 100000,
    medio_pago: 'Efectivo',
    concepto: 'Entrega 2 - Remito Nº 2394'
  },
  {
    id: 1005,
    numero: 5,
    fecha: '2026-07-25',
    cliente_id: 3,
    orden_trabajo_id: 4,
    monto: 278000,
    medio_pago: 'Transferencia',
    concepto: 'Cancelación total - Remito Nº 2395'
  }
];

export const initialMovimientosCajaBanco: MovimientoCajaBanco[] = [
  {
    id: 1,
    libro: 'caja',
    fecha: '2026-07-01',
    concepto: 'Saldo inicial',
    unidad_negocio: 'Taller',
    detalle: 'Apertura de caja mensual',
    proveedor: '',
    tipo_movimiento: 'Efectivo',
    ingreso: 350000,
    egreso: 0,
    facturado_a_sas: false,
    saldo_acumulado: 350000
  },
  {
    id: 2,
    libro: 'caja',
    fecha: '2026-07-05',
    concepto: 'Combustible',
    unidad_negocio: 'Taller',
    detalle: 'Carga nafta camioneta auxilio taller',
    proveedor: 'YPF Laboulaye',
    tipo_movimiento: 'Efectivo',
    ingreso: 0,
    egreso: 48000,
    facturado_a_sas: true,
    saldo_acumulado: 302000
  },
  {
    id: 3,
    libro: 'caja',
    fecha: '2026-07-10',
    concepto: 'Gastos generales',
    unidad_negocio: 'Personal',
    detalle: 'Supermercado compra familiar Cristian B.',
    proveedor: 'Supermercado Vea',
    tipo_movimiento: 'Efectivo',
    ingreso: 0,
    egreso: 85000,
    facturado_a_sas: false,
    saldo_acumulado: 217000
  },
  {
    id: 4,
    libro: 'caja',
    fecha: '2026-07-22',
    concepto: 'Pago cliente',
    unidad_negocio: 'Taller',
    detalle: 'Cobro parcial Remito 2392 (Juan Pérez)',
    proveedor: 'Pérez Juan',
    tipo_movimiento: 'Efectivo',
    ingreso: 100000,
    egreso: 0,
    facturado_a_sas: false,
    saldo_acumulado: 317000
  },
  {
    id: 5,
    libro: 'banco',
    fecha: '2026-07-02',
    concepto: 'Pago proveedor',
    unidad_negocio: 'Taller',
    detalle: 'Factura Repuestos Sur kit distribuciones',
    proveedor: 'Repuestos Sur',
    tipo_movimiento: 'Transferencia',
    ingreso: 0,
    egreso: 240000,
    facturado_a_sas: true,
    saldo_acumulado: 1250000
  },
  {
    id: 6,
    libro: 'banco',
    fecha: '2026-07-15',
    concepto: 'Sueldo mecánicos',
    unidad_negocio: 'Taller',
    detalle: 'Liquidación quincena Federico y Juan Carlos',
    proveedor: '',
    tipo_movimiento: 'Transferencia',
    ingreso: 0,
    egreso: 520000,
    facturado_a_sas: false,
    saldo_acumulado: 730000
  },
  {
    id: 7,
    libro: 'banco',
    fecha: '2026-07-25',
    concepto: 'Pago cliente',
    unidad_negocio: 'Taller',
    detalle: 'Cobro total Remito 2395 (Transportes Deheza)',
    proveedor: 'Transportes Deheza SAS',
    tipo_movimiento: 'Transferencia',
    ingreso: 278000,
    egreso: 0,
    facturado_a_sas: true,
    saldo_acumulado: 1008000
  },
  {
    id: 8,
    libro: 'banco',
    fecha: '2026-07-26',
    concepto: 'Impuestos y servicios',
    unidad_negocio: 'Personal',
    detalle: 'Pago tarjeta de crédito personal Cristian B.',
    proveedor: 'Banco Macro',
    tipo_movimiento: 'Transferencia',
    ingreso: 0,
    egreso: 195000,
    facturado_a_sas: false,
    saldo_acumulado: 813000
  }
];

export const CATEGORIAS_GASTO = [
  'Sueldos',
  'Sueldo administrativo',
  'Sueldo mecánicos',
  'Honorarios',
  'Impuestos y servicios',
  'Ingresos brutos',
  'Comisiones',
  'Combustible',
  'Librería/Papelería',
  'Artículos de limpieza',
  'Servicios',
  'Servicios de terceros',
  'Herramientas / bienes de uso',
  'Gastos bancarios',
  'Gastos generales',
  'Pago proveedor',
  'Pago cliente',
  'Ingreso a caja chica',
  'Ingreso a caja grande',
  'Vuelto cliente',
  'Saldo inicial'
];

export const TIPOS_TRABAJO = [
  'Service',
  'Distribución',
  'Tren Delantero',
  'Frenos',
  'Embrague',
  'Refrigeración',
  'Alineación y Balanceo',
  'Suspensión',
  'Inyección y Scanner',
  'Servicios de terceros',
  'Mano de obra general'
];

export const MECANICOS = [
  'Federico',
  'Juan Carlos',
  'Cristian Bongiovanni'
];
