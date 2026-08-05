# Especificación funcional y técnica — Sistema de gestión para Taller Mecánico

> Documento preparado para que un agente de IA (o un equipo de desarrollo) entienda el negocio y pueda diseñar/construir un sistema de gestión real, para uso diario de una **secretaria administrativa** en un taller mecánico. Está basado en el análisis de 3 planillas Excel que el taller usa actualmente: `Contabilidad_taller.xlsx`, `Presupuestos.xlsx` y `Remitos_de_trabajos_con_IVA_.xlsx`.

---

## 1. Contexto del negocio

- **Rubro:** Taller mecánico integral (service, distribución, tren delantero, suspensión, frenos, refrigeración, embrague, etc.) para autos y camionetas.
- **Ubicación:** Gral. Deheza 191, Laboulaye (6120), Córdoba, Argentina.
- **Titular:** Cristian Bongiovanni (monotributista/responsable inscripto — se ve facturación con IVA 21%).
- **Moneda:** Pesos argentinos (ARS). IVA estándar detectado: **21%**.
- **Particularidad importante:** el dueño mezcla en la contabilidad gastos del **Taller** con gastos **Personales** (existe el campo "Unidad de negocio" = `Taller` / `Personal`). El sistema nuevo debe permitir seguir separando esto, aunque lo ideal a futuro es que queden en circuitos distintos.
- **Hoy todo el proceso vive en Excel**, con múltiples hojas "de carga" (data entry) y hojas de tablas dinámicas para reportes (deuda por cliente, gastos por categoría, etc.), lo cual es lento, propenso a errores (se detectaron `#REF!`, `#N/A`, `#DIV/0!` en las planillas actuales) y depende de que alguien sepa "actualizar" tablas dinámicas manualmente.

**Objetivo del sistema nuevo:** reemplazar estas 3 planillas por una aplicación (web o de escritorio) simple, con formularios guiados, que una secretaria sin conocimientos técnicos pueda usar todos los días para: presupuestar, generar remitos/órdenes de trabajo, cobrar (incluso en cuotas), imprimir remitos y recibos, llevar la caja y el banco, y ver de un vistazo quién le debe plata al taller.

---

## 2. Usuarios y roles

| Rol | Uso principal | Permisos sugeridos |
|---|---|---|
| **Secretaria (usuario principal)** | Carga diaria: clientes, presupuestos, remitos, cobros, caja/banco. Imprime documentos. | Alta/baja/modificación en todos los módulos operativos. No debería poder borrar registros contables cerrados, solo anularlos con motivo. |
| **Dueño / Administrador** | Ve reportes, precios de referencia, márgenes, deuda total, gastos personales vs. taller. | Todo lo anterior + configuración de precios, % de recargo, usuarios, backups. |
| **Mecánico (opcional, uso liviano)** | Puede figurar como "responsable" de un trabajo. Uso opcional de una pantalla simple tipo tablet para marcar trabajos como terminados. | Solo lectura/carga de sus propias órdenes de trabajo, sin ver precios ni cobranzas. |

---

## 3. Flujo de trabajo end-to-end (lo que pasa en la vida real)

```
1. Cliente trae el vehículo o llama
        │
        ▼
2. PRESUPUESTO
   - Se registra cliente + vehículo (si es nuevo, se da de alta)
   - Se anota diagnóstico / trabajo a realizar
   - Se cargan repuestos estimados (costo, cantidad) y mano de obra (MO)
   - Sistema calcula precio de repuestos aplicando % de ganancia y MO según tarifario
   - Se imprime/entrega presupuesto al cliente
        │
        ▼ (cliente aprueba)
3. ORDEN DE TRABAJO / REMITO
   - Se genera a partir del presupuesto (o directo, sin presupuesto previo)
   - Se registra kilometraje, mecánico responsable, tipo de trabajo
   - Se cargan los repuestos REALMENTE usados (costo con/sin IVA, proveedor,
     cantidad, % ganancia) y la MO real
   - Sistema calcula: total costo, total precio repuestos, total MO,
     total sin IVA, IVA, TOTAL FINAL
   - Se imprime el REMITO (documento que se entrega al cliente con el vehículo)
        │
        ▼
4. COBRANZA
   - El cliente paga todo en el momento (Efectivo/Transferencia/Tarjeta/Cheque)
     → se cierra el remito, no hay deuda
   - O paga en cuotas/entregas parciales (hasta 6 entregas registradas hoy en
     Excel) → queda un saldo pendiente ("Deuda") y un contador de "meses de deuda"
   - Cada pago genera un RECIBO numerado que se imprime/entrega
        │
        ▼
5. CAJA Y BANCO
   - Todo ingreso de dinero (cobro a cliente) y todo egreso (pago a proveedor,
     sueldos, impuestos, combustible, etc.) se asienta en Caja o en Banco
   - Cada movimiento tiene: fecha, concepto, unidad de negocio (Taller/Personal),
     detalle, proveedor, tipo de movimiento, IVA, si fue "facturado a SAS"
        │
        ▼
6. REPORTES / TABLERO
   - Deuda total y por cliente
   - Ingresos vs. egresos por período
   - Gastos por categoría (sueldos, combustible, impuestos, etc.)
   - Rentabilidad por trabajo (precio cobrado vs. costo real)
```

---

## 4. Módulos del sistema

### 4.1 Clientes y Vehículos
- Alta rápida de cliente desde la pantalla de presupuesto/remito (no debe obligar a ir a otro módulo).
- Un cliente puede tener **más de un vehículo**.
- Buscador por nombre, por dominio (patente) o por teléfono — la secretaria en general busca "por apellido" o "por patente".
- Campo CUIT opcional (solo lo tienen clientes empresa: transportes, municipalidad, agropecuarias, etc.).

### 4.2 Proveedores
- Catálogo de proveedores de repuestos con **% de descuento** que cada uno le hace al taller (dato clave para calcular costo real y margen).
- Proveedor especial `"Taller"` = repuesto que sale del stock propio / no tiene proveedor externo cargado. Regla del negocio: cuando no se tiene el costo real (por ejemplo, comprado en Mercado Libre y no lo pasaron), se aplica **20% de recargo por defecto**.

### 4.3 Catálogo de repuestos y mano de obra (referencia de precios)
- Lista de repuestos más usados con precio **promedio** y precio **máximo** histórico por mes (para que la secretaria no tenga que inventar un precio cada vez).
- Tarifario de mano de obra:
  - Hora de mano de obra: valor de referencia
  - Service auto: valor de referencia
  - Service camioneta: valor de referencia
  - Diagnóstico (conectar scanner): valor de referencia (puede ser $0 si es cortesía)
- % de recargo general sobre repuestos (hoy 20% como default).

### 4.4 Presupuestos
- Documento **previo** al trabajo, no obligatorio pero recomendado.
- Numeración correlativa propia.
- Estado: `Pendiente` → `Aprobado` → `Convertido a remito` / `Rechazado` / `Vencido`.
- Un presupuesto puede convertirse en remito con un clic, sin recargar todo de nuevo.

### 4.5 Órdenes de trabajo / Remitos (módulo central)
- Es el corazón del sistema: cada visita de un vehículo genera un remito.
- Cada remito tiene una o varias **líneas de ítem** (repuestos y mano de obra), y cada ítem calcula automáticamente su importe.
- Debe permitir imprimir el remito en formato similar al actual (membrete, cliente, vehículo, km, dominio, detalle del trabajo, tabla de ítems, total).
- Debe guardar el **mecánico responsable** y el **tipo de trabajo** (Service, Distribución, Tren delantero, Frenos, Embrague, Refrigeración, etc.) para poder sacar reportes de productividad y de qué tipo de trabajo es más frecuente/rentable.

### 4.6 Cobranzas / Cuenta corriente de clientes
- Por cada remito, controla: total del trabajo, cuánto se cobró, cuánto queda de **deuda**, método de pago, y **hasta 6 pagos parciales** con su fecha y su número de recibo (hoy estructurado así en Excel, pero el sistema nuevo debería permitir **N pagos parciales sin límite fijo**, es una limitación artificial de Excel).
- Debe calcular automáticamente **meses de deuda** (desde la fecha del remito hasta hoy o hasta el pago total).
- Pantalla de "Deuda por cliente" tipo tablero: lista de clientes con saldo pendiente, ordenable por antigüedad de deuda y por monto, con alerta visual para deudas de +2 o +3 meses.

### 4.7 Recibos
- Documento que se imprime cada vez que un cliente paga (total o parcial).
- Numeración correlativa propia, distinta a la del remito.
- Guarda: cliente, fecha, monto, medio de pago (efectivo, transferencia, cheque, "cpd" = a confirmar/cuenta corriente, etc.), y a qué remito(s) corresponde.

### 4.8 Caja y Banco (módulo contable)
- Dos libros separados, igual que hoy: **Libro Caja** (efectivo) y **Libro Banco** (transferencias, cheques, tarjeta).
- Cada movimiento: fecha, concepto (categoría de gasto/ingreso), unidad de negocio (Taller/Personal), detalle, proveedor, tipo de movimiento, número de cheque (si aplica), monto ingreso o egreso, IVA, si está "facturado a SAS".
- El sistema debe calcular **saldo acumulado** automáticamente (hoy se calcula a mano en Excel y se pierde el hilo si alguien borra una fila).
- Categorías de gasto (para que la secretaria elija de una lista desplegable, no escriba libre):
  `Sueldos, Sueldo administrativo, Sueldo mecánicos, Honorarios, Impuestos y servicios, Ingresos brutos, Comisiones, Combustible, Librería/Papelería, Artículos de limpieza, Servicios, Servicios de terceros, Herramientas / bienes de uso, Gastos bancarios, Gastos generales, Pago proveedor, Pago cliente, Ingreso a caja chica, Ingreso a caja grande, Vuelto cliente, Saldo inicial`
  (categorías tomadas de las planillas históricas del taller; deben quedar editables por el administrador).

### 4.9 Reportes y tablero (dashboard)
Mínimo indispensable para que la secretaria y el dueño no vuelvan a depender de tablas dinámicas manuales:
1. **Deuda total y por cliente**, con antigüedad.
2. **Ingresos vs. egresos** por mes / por unidad de negocio (Taller vs. Personal).
3. **Gastos por categoría** (torta o barra) por período.
4. **Facturación por mecánico / tipo de trabajo** (quién generó más trabajo y de qué tipo).
5. **Margen por remito**: precio cobrado − costo real de repuestos − referencia de MO, para ver qué tan rentable fue cada trabajo.
6. **Repuestos más usados** y su evolución de precio (ya lo llevan a mano en la hoja "% recargo").

---

## 5. Modelo de datos propuesto

> Nombres de tabla y campo en `snake_case`. Los ejemplos usan datos ficticios (no los reales de las planillas, por privacidad de los clientes del taller).

### 5.1 `clientes`
| Campo | Tipo | Ejemplo |
|---|---|---|
| id | int (PK) | 145 |
| razon_social | texto | "Pérez Juan" |
| cuit | texto (nullable) | "20-12345678-9" |
| telefono | texto | "3385-600000" |
| contacto | texto | "" |
| direccion | texto (nullable) | "" |
| notas | texto (nullable) | "Cliente frecuente" |

### 5.2 `vehiculos`
| Campo | Tipo | Ejemplo |
|---|---|---|
| id | int (PK) | 301 |
| cliente_id | int (FK → clientes) | 145 |
| dominio | texto (patente, nullable si no se sabe) | "AB123CD" |
| marca_modelo | texto | "Peugeot 208" |
| km_ultimo_registrado | int | 95398 |

### 5.3 `proveedores`
| Campo | Tipo | Ejemplo |
|---|---|---|
| id | int (PK) | 12 |
| nombre | texto | "Repuestos Sur" |
| cuit | texto (nullable) | "30-11111111-2" |
| contacto | texto (teléfono) | "3385-500000" |
| producto | texto (qué vende) | "Repuestos de distribución" |
| descuento_pct | decimal | 0.20 |

### 5.4 `presupuestos`
| Campo | Tipo | Ejemplo |
|---|---|---|
| id | int (PK) | 1 |
| numero | int (correlativo, único) | 224 |
| fecha | fecha | 2026-07-15 |
| cliente_id | int (FK) | 145 |
| vehiculo_id | int (FK) | 301 |
| diagnostico | texto largo | "Desarmar suspensión de ambos lados. Cambiar amortiguadores. Regulación de convergencia." |
| estado | enum | `pendiente` \| `aprobado` \| `rechazado` \| `convertido` |
| remito_generado_id | int (FK, nullable) | null |
| total_estimado | decimal | 236000.00 |

### 5.5 `presupuesto_items`
| Campo | Tipo | Ejemplo |
|---|---|---|
| id | int (PK) | 1 |
| presupuesto_id | int (FK) | 1 |
| tipo | enum | `repuesto` \| `mano_obra` |
| descripcion | texto | "Amortiguador delantero" |
| cantidad | decimal | 2 |
| precio_unitario | decimal | 43000.00 |
| importe | decimal (cantidad × precio_unitario) | 86000.00 |

### 5.6 `ordenes_trabajo` (Remitos)
| Campo | Tipo | Ejemplo |
|---|---|---|
| id | int (PK) | 1 |
| numero_remito | int (correlativo, único, distinto al de presupuesto) | 2392 |
| fecha | fecha | 2026-07-20 |
| cliente_id | int (FK) | 145 |
| vehiculo_id | int (FK) | 301 |
| km | int | 95398 |
| presupuesto_origen_id | int (FK, nullable) | 1 |
| diagnostico_trabajo_realizado | texto largo | "Service completo. Cambio de aceite y filtros. Control general del vehículo." |
| mecanico_responsable | texto o FK a `mecanicos` | "Federico" |
| tipo_trabajo | texto | "Service" |
| estado | enum | `abierto` \| `entregado` \| `facturado` \| `anulado` |
| numero_factura | texto (nullable) | "" |
| total_costo_repuestos | decimal (calculado) | 66150.00 |
| total_precio_repuestos | decimal (calculado) | 92610.00 |
| total_mano_obra | decimal (calculado) | 100000.00 |
| total_sin_iva | decimal (calculado) | 159190.08 |
| iva | decimal (calculado, 21%) | 33429.92 |
| total_final | decimal (calculado) | 192620.00 |

### 5.7 `remito_items`
| Campo | Tipo | Ejemplo |
|---|---|---|
| id | int (PK) | 1 |
| orden_trabajo_id | int (FK) | 1 |
| tipo | enum | `repuesto` \| `mano_obra` |
| codigo_repuesto | texto (nullable) | "Kit distribución" |
| proveedor_id | int (FK, nullable) | 12 |
| costo_sin_iva | decimal | 20000.00 |
| iva_pct | decimal | 0.21 |
| costo_con_iva | decimal (calculado) | 24200.00 |
| cantidad | decimal | 1 |
| pct_ganancia | decimal | 0.20 |
| precio_unitario_final | decimal (calculado: costo_con_iva × (1+pct_ganancia)) | 29040.00 |
| importe | decimal (calculado: precio_unitario_final × cantidad) | 29040.00 |
| responsable | texto (opcional, mecánico que hizo esa tarea) | "Juan Carlos" |

> **Regla de cálculo detectada en las planillas actuales:** costo sin IVA → + IVA (21%) = costo con IVA → + % de ganancia = precio final de venta al cliente. La mano de obra (MO) se carga aparte como tiempo × precio de referencia y se acumula en `MO Acumulado` a lo largo de las líneas del mismo remito.

### 5.8 `pagos_clientes` (cuenta corriente por remito)
| Campo | Tipo | Ejemplo |
|---|---|---|
| id | int (PK) | 1 |
| orden_trabajo_id | int (FK) | 1 |
| cliente_id | int (FK) | 145 |
| total_trabajo | decimal | 192620.00 |
| deuda_pendiente | decimal (calculado) | 92620.00 |
| metodo_pago_principal | texto | "Transferencia" |
| meses_deuda | int (calculado) | 2 |
| comentario | texto (nullable) | "Paga fin de mes" |

### 5.9 `pago_entregas` (pagos parciales / cuotas — sin límite de cantidad)
| Campo | Tipo | Ejemplo |
|---|---|---|
| id | int (PK) | 1 |
| pago_cliente_id | int (FK) | 1 |
| numero_entrega | int | 1 |
| monto | decimal | 100000.00 |
| fecha | fecha | 2026-07-22 |
| recibo_id | int (FK → recibos, nullable) | 501 |

### 5.10 `recibos`
| Campo | Tipo | Ejemplo |
|---|---|---|
| id | int (PK) | 501 |
| numero | int (correlativo propio) | 1 |
| fecha | fecha | 2026-07-22 |
| cliente_id | int (FK) | 145 |
| monto | decimal | 100000.00 |
| medio_pago | texto | "Efectivo" |

### 5.11 `movimientos_caja` y `movimientos_banco`
(misma estructura para ambos libros; se diferencian por el libro al que pertenecen)

| Campo | Tipo | Ejemplo |
|---|---|---|
| id | int (PK) | 1 |
| libro | enum | `caja` \| `banco` |
| fecha | fecha | 2026-07-22 |
| concepto | texto (de catálogo `categorias_gasto`) | "Combustible" |
| unidad_negocio | enum | `Taller` \| `Personal` |
| detalle | texto (nullable) | "Nafta camioneta" |
| proveedor | texto (nullable) | "YPF" |
| tipo_movimiento | enum | `efectivo` \| `transferencia` \| `cheque_terceros` \| `tarjeta` \| `e-cheq` |
| numero_cheque | texto (nullable) | "" |
| ingreso | decimal (nullable) | null |
| egreso | decimal (nullable) | 45000.00 |
| iva | decimal (nullable) | null |
| facturado_a_sas | booleano | false |
| saldo_acumulado | decimal (calculado automáticamente) | 812340.00 |

### 5.12 Tablas de configuración
- `categorias_gasto`: catálogo editable de conceptos (ver lista en sección 4.8).
- `config_recargos`: % de recargo default sobre repuestos (20% hoy) + tarifario de MO (hora, service auto, service camioneta, diagnóstico).
- `tipos_trabajo`: Alineación y balanceo, Service, Tren delantero, Servicio terceros, Mano de obra, Distribución, Frenos, Embrague, Refrigeración, etc. (catálogo abierto, la secretaria debe poder agregar nuevos).
- `mecanicos`: lista simple de nombres de mecánicos/responsables.

---

## 6. Reglas de negocio clave

1. **Numeración correlativa e independiente** para: Presupuestos, Remitos, Recibos. No deben mezclarse los contadores (hoy el "Nro comp." de presupuesto y el "Nro comp." de remito son series distintas).
2. **Un remito puede tener 1 a N ítems** (repuestos y/o mano de obra); los totales del remito son la suma de sus ítems, siempre calculados, nunca tipeados a mano.
3. **Cálculo de precio de repuesto:** `costo_con_iva = costo_sin_iva × 1.21` → `precio_venta = costo_con_iva × (1 + % ganancia)`. El % de ganancia es editable por ítem (en la práctica varía mucho: se vieron casos de 20% hasta 150%+ según el repuesto/urgencia).
4. **Repuesto sin proveedor cargado (proveedor = "Taller")** → aplicar 20% de recargo por defecto, salvo que la secretaria indique otro valor.
5. **Mano de obra:** se carga como tiempo (horas o "servicio completo") × precio de referencia del tarifario, editable manualmente si el trabajo lo amerita.
6. **Deuda:** `deuda_pendiente = total_trabajo − Σ(entregas pagadas)`. Si `deuda_pendiente = 0` el remito pasa a estado "pagado". El sistema calcula automáticamente los **meses de deuda** desde la fecha del remito.
7. **Todo pago genera un recibo**, incluso los pagos parciales. El recibo se vincula al remito y al cliente.
8. **Todo movimiento de caja/banco debe llevar unidad de negocio** (Taller/Personal) para poder separar reportes de la empresa de los gastos personales del dueño.
9. **IVA:** el sistema debe soportar 21% como valor por defecto pero dejarlo configurable (por si en el futuro se agregan tasas reducidas o el taller cambia de condición fiscal).
10. **Nada se borra:** anular un presupuesto/remito/recibo debe dejarlo marcado como `anulado` con motivo, no eliminarlo, para mantener la numeración correlativa y la trazabilidad contable.

---

## 7. Documentos imprimibles

El sistema debe poder generar (en pantalla + impresión, formato A4 o media hoja tipo talonario) los siguientes documentos, replicando el estilo que ya usa el taller:

### 7.1 Presupuesto
```
[Membrete: Cristian Bongiovanni — Taller Mecánico — Gral. Deheza 191, Laboulaye]
Comprobante Nº: 224          Fecha: 15/07/2026
Cliente: Juan Pérez
Vehículo: Peugeot 208         Dominio: AB123CD

Diagnóstico: Desarmar suspensión de ambos lados. Cambiar amortiguadores.
Regulación de convergencia.

Producto/servicio         Cant.   Precio Unit.   Importe
Mano de obra                 1      150.000       150.000
Amortiguador delantero        2       43.000        86.000
------------------------------------------------------------
                                          TOTAL:   236.000
```

### 7.2 Remito
```
[Membrete]                                    REMITO Nº: 2392
Fecha: 20/07/2026
Nombre: Juan Pérez                Km: 95.398
Vehículo: Peugeot 208              Dominio: AB123CD

Trabajo realizado: Service completo. Cambio de aceite y filtros.
Control general del vehículo.

Cod.  Producto/servicio        Cant.   Precio Unit.   Importe
5     Mano de obra                1      100.000       100.000
1     Kit de filtros               1       83.000        83.000
1     Aceite motor 10w40         4.5       14.700        66.150
------------------------------------------------------------------
                                                TOTAL: 249.150
```

### 7.3 Recibo
```
[Membrete]                                    RECIBO Nº: 1
Fecha: 22/07/2026
Nombre: Juan Pérez
Medio de pago: Efectivo
Monto recibido: $ 100.000
Corresponde a Remito Nº: 2392 (entrega 1 de 2)
```

---

## 8. Consideraciones de UX para la secretaria (uso real, diario)

- **Todo en una pantalla por tarea**, sin obligar a navegar entre múltiples módulos para hacer una sola operación (ej: crear cliente nuevo *desde* la pantalla de remito, no aparte).
- **Buscador global arriba de todo:** por nombre de cliente, patente o número de remito/presupuesto/recibo.
- **Autocompletado de vehículo/cliente** al escribir 2-3 letras (hoy en Excel se repiten inconsistencias de tipeo: "Cristian" vs "cristian", "Taller" vs "taller").
- **Botón "Convertir presupuesto en remito"** que copia automáticamente cliente, vehículo y todos los ítems, evitando recargar todo.
- **Botón "Imprimir"** en cada documento (Presupuesto, Remito, Recibo) con vista previa antes de imprimir.
- **Pantalla de cobranzas tipo lista de tareas:** clientes con deuda, ordenados por antigüedad, con botón directo "Registrar pago" desde ahí.
- **Alertas visuales** (colores) para deudas de más de 60/90 días, igual que hoy lo intentan ver a mano con la hoja "Ficha".
- **Selects/listas desplegables** en vez de campos de texto libre para: unidad de negocio, tipo de movimiento, categoría de gasto, medio de pago, tipo de trabajo — esto es clave porque en las planillas actuales hay muchísima inconsistencia de mayúsculas/minúsculas y sinónimos que después rompen los reportes.
- **Todos los totales calculados automáticamente**, la secretaria nunca debería tener que sumar nada a mano ni escribir una fórmula.
- Preferentemente **accesible desde una tablet o notebook simple** en el mostrador del taller, con buena legibilidad (tipografía grande, botones grandes) — no es una usuaria técnica.

---

## 9. Requisitos no funcionales

- **Multiusuario básico** (secretaria + dueño), con login simple.
- **Copias de seguridad automáticas** (diarias) — hoy todo vive en 3 archivos Excel sin backup.
- **Funcionar bien offline o con conexión inestable** es deseable si el taller no tiene internet confiable (evaluar app de escritorio o web con modo offline/sincronización).
- **Exportar a Excel/PDF** los reportes y listados, para que el contador del taller pueda seguir trabajando con esos datos si hace falta.
- **Historial de cambios** (auditoría mínima) en montos y anulaciones, para evitar disputas sobre "quién cambió el precio".
- **Impresión térmica o A4**, según lo que use el taller para remitos/recibos (a confirmar con el cliente qué impresora tienen).

---

## 10. Migración de datos desde los Excel actuales

| Archivo actual | Hoja | Migra a |
|---|---|---|
| `Presupuestos.xlsx` | Carga Presup. | `presupuestos` + `presupuesto_items` |
| `Presupuestos.xlsx` | % recargo, Base rep. | `config_recargos`, `tipos_trabajo` |
| `Remitos_de_trabajos_con_IVA_.xlsx` | Carga Remito. | `ordenes_trabajo` + `remito_items` |
| `Remitos_de_trabajos_con_IVA_.xlsx` | Pagos clientes | `pagos_clientes` + `pago_entregas` |
| `Remitos_de_trabajos_con_IVA_.xlsx` | Base Cliente | `clientes` + `proveedores` |
| `Remitos_de_trabajos_con_IVA_.xlsx` | % recargo | histórico de precios de repuestos (opcional, como referencia) |
| `Contabilidad_taller.xlsx` | Base Libro Banco / Base Libro Caja | `movimientos_banco` / `movimientos_caja` |
| `Contabilidad_taller.xlsx` | Indic 2019, Resumen 2020, G. personales | **Solo históricos/legacy** — no migrar estructura, sirven únicamente como referencia de qué categorías de gasto se usaban antes (ya incorporadas en el catálogo `categorias_gasto` de la sección 4.8). |

**Notas importantes para la migración:**
- Las planillas actuales tienen **filas vacías con errores de fórmula** (`#REF!`, `#N/A`, `#DIV/0!`) al final de varios rangos — deben filtrarse y no importarse.
- Los "Nro comp." se repiten varias veces (una fila por cada ítem del mismo comprobante) — al migrar, hay que **agrupar por número de comprobante** para reconstruir cabecera + ítems, no crear un remito por fila.
- Hay inconsistencia de mayúsculas/minúsculas en varios campos de texto libre (ej. "Taller" / "taller", "Transferencia" / "transferencia") — normalizar contra los catálogos definidos en este documento durante la carga inicial.
- Los datos de clientes/proveedores no tienen validación de duplicados (mismo cliente escrito de formas distintas) — conviene hacer una limpieza/deduplicación antes de migrar.

---

## 11. Glosario de términos del taller (para que el agente de IA no confunda conceptos)

| Término | Significado |
|---|---|
| **Remito** | Orden de trabajo / comprobante de entrega que detalla repuestos usados y mano de obra de un trabajo ya realizado. Es el documento central del negocio. |
| **Presupuesto** | Cotización previa al trabajo, no siempre se hace. |
| **MO** | Mano de Obra (trabajo del mecánico, se cobra aparte de los repuestos). |
| **MO Acumulado** | Suma progresiva de mano de obra a lo largo de las líneas de un mismo remito. |
| **Entrega** | Cada pago parcial que hace un cliente sobre la deuda de un remito. |
| **Deuda / Meses de deuda** | Saldo pendiente de pago de un cliente y hace cuánto tiempo lo arrastra. |
| **Unidad de negocio** | Clasificación de un movimiento de dinero como "Taller" (del negocio) o "Personal" (gastos del dueño). |
| **Facturado a SAS** | Indicador de si ese movimiento fue facturado a nombre de la sociedad (SAS) del dueño. |
| **% de recargo / % de ganancia** | Porcentaje que se suma al costo del repuesto para fijar el precio de venta al cliente. |
| **Dominio** | Patente del vehículo. |

---

## 12. Alcance recomendado para una primera versión (MVP)

Para no intentar construir todo junto, se recomienda priorizar así:

1. Clientes + Vehículos + Proveedores (base).
2. Remitos con ítems y cálculo automático de totales + impresión.
3. Cobranzas (pagos parciales, deuda, recibos) + impresión.
4. Caja y Banco con saldo automático.
5. Presupuestos (puede ser un "remito en borrador", reutilizando la misma pantalla).
6. Reportes/dashboard (deuda por cliente, ingresos/egresos, gastos por categoría).
