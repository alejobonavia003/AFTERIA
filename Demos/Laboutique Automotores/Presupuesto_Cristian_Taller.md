# Presupuesto — Sistema de gestión para el Taller de Cristian Bongiovanni

---

## 1. Presupuesto por funcionalidad

La idea es que Cristian vea **qué paga por cada cosa**, no un monto cerrado sin desglose — genera más confianza y le permite decidir si quiere todo junto o por etapas.

### 1.1 Núcleo del sistema (imprescindible, sin esto no hay MVP)

| Funcionalidad | Por qué la necesita | Precio (USD) |
|---|---|---|
| Clientes + Vehículos + Proveedores | Base de todo el sistema, hoy repetida y sin validar en Excel | 200 |
| **Remitos con ítems y cálculo automático** (costo → IVA → % ganancia → total) + impresión | Es el corazón del negocio, hoy se calcula a mano y se detectaron errores de fórmula | 650 |
| Cobranzas: deuda por cliente, pagos parciales, recibos + impresión | Hoy la deuda se controla con tablas dinámicas que hay que "actualizar" a mano | 400 |
| Caja y Banco con saldo automático | Reemplaza las 2 planillas contables actuales, con saldo que nunca se rompe | 350 |
| Migración de datos reales (los 3 Excel actuales) | Pasar remitos, clientes, deudas y movimientos ya cargados, limpiando duplicados y errores `#REF!`/`#N/A` | 250 |
| Capacitación de la secretaria (2 sesiones + guía corta) | Para que lo empiece a usar sin fricción desde el día 1 | 120 |
| **Subtotal núcleo (MVP funcionando)** | | **USD 1.970** |

### 1.2 Funcionalidades opcionales (se agregan cuando el MVP ya esté en uso)

| Funcionalidad | Precio (USD) |
|---|---|
| Módulo de Presupuestos (previo al remito, con conversión a remito en 1 clic) | 320 |
| Dashboard / reportes (deuda total, ingresos vs. egresos, gastos por categoría, margen por trabajo) | 380 |
| Separación clara Taller / Personal en reportes (detectamos que hoy se mezclan) | 150 |
| Alertas de deuda vencida (60/90 días) | 100 |

**Total si se suma todo desde el arranque: ~USD 2.920** — coincide con el rango que ya le habíamos dado, pero ahora con el desglose que le permite a Cristian **elegir qué se lleva ahora y qué deja para después**.

---

## 2. Cómo armarle la propuesta a Cristian (por prioridad, no por "todo o nada")

Dado lo que vimos en sus números (ingresos variables, meses con margen negativo), conviene ofrecerle **entrar por el núcleo**, no por el paquete completo:

1. **Fase 1 (ahora):** Núcleo — USD 1.970. Esto ya reemplaza lo que más dolor le genera hoy: remitos, cobranzas y caja/banco.
2. **Fase 2 (a los 60-90 días de uso, cuando ya vio el valor):** Presupuestos + Dashboard — USD 700-850.
3. **Fase 3 (opcional, más adelante):** Separación Taller/Personal + Alertas de deuda — USD 250.

Esto además te da una **segunda venta natural** dentro de unos meses, en vez de cerrar todo en una sola negociación.

---

## 3. Formas de pago (adaptadas a su flujo de caja real)

Con base en el análisis de sus propios Excel (ingreso mensual promedio variable, con meses de neto negativo), **no conviene pedirle un anticipo grande de una sola vez**. Le proponemos elegir entre estas opciones:

### Opción A — Por hitos de entrega (recomendada si paga el proyecto completo)
| Momento | % | Qué se entrega |
|---|---|---|
| Al firmar / arrancar | 30% | Inicio del desarrollo |
| Al tener Remitos + Cobranzas funcionando (mitad del proyecto) | 40% | Ya puede empezar a usar lo más crítico, aunque falte Caja/Banco |
| Al entregar el MVP completo + migración + capacitación | 30% | Sistema completo y en uso |

*Ventaja para vos:* cobrás la mayor parte (70%) recién cuando ya hay algo tangible funcionando, lo cual también te da más poder de negociación si algo se demora del lado del cliente.

### Opción B — Cuotas mensuales fijas (recomendada si el proyecto dura 2-3 meses)
Se divide el total en 3 o 4 cuotas iguales, coincidiendo con su ciclo de cobros (por ejemplo, a fin de cada mes, cuando el taller ya cobró la mayoría de sus remitos del mes).

> Ejemplo con el núcleo (USD 1.970) en 3 cuotas: **USD 660 al mes**, durante los 3 meses que dura el desarrollo + puesta en marcha.

*Ventaja para Cristian:* nunca tiene que juntar un monto grande de una vez, que es justo lo que sus números muestran que le puede costar en un mes flojo.

### Opción C — Setup reducido + suscripción (la más fácil de aceptar para él)
La opción de menor barrera de entrada, ideal si querés cerrar rápido:

| Concepto | Costo |
|---|---|
| Setup inicial (solo migración de datos + capacitación, sin cobrar el desarrollo por adelantado) | USD 300 |
| Suscripción mensual durante 12 meses (incluye el desarrollo amortizado + mantenimiento + hosteo, ver sección 4) | USD 140/mes |

Después del mes 12, la cuota baja al valor de mantenimiento + hosteo normal (sección 4), porque ya terminó de pagar el desarrollo.

> Esta opción es la que yo elegiría ofrecerle primero a Cristian: entra con muy poco (USD 300) y el resto se diluye en su facturación mensual normal, sin sentir un golpe grande de una vez — coherente con lo que mostró su Excel.

### Recomendación de cierre
Ofrecele **las tres opciones en la reunión** (no elijas por él) y dejalo decidir. La mayoría de los talleres con caja ajustada como la suya terminan eligiendo la Opción C — y a vos te conviene igual, porque te asegura ingreso recurrente por 12 meses en vez de un pago único.

---

## 4. Mantenimiento y hosteo — costo real, desglosado

Es importante separarle a Cristian **qué es costo de infraestructura** (lo que cuesta tener el sistema andando en un servidor) de **qué es tu trabajo de soporte** (corregir errores, ayudarlo, hacer ajustes chicos). Así entiende que no es "letra chica", es un costo real y transparente.

| Concepto | Detalle | Costo mensual de referencia |
|---|---|---|
| **Hosteo** | Servidor/hosting donde vive el sistema, dominio, certificado de seguridad (HTTPS) | USD 8 – 15 |
| **Backups automáticos** | Copia de seguridad diaria de toda su información (clientes, remitos, deuda, caja) | incluido en el hosteo |
| **Mantenimiento / soporte** | Corrección de errores, disponibilidad para consultas (WhatsApp/mail), pequeños ajustes (2-3 hs/mes) | USD 30 – 45 |
| **Total mensual sugerido** | | **USD 40 – 60 / mes** |

### 4.1 Qué pasa si no paga el mantenimiento
- El sistema **sigue funcionando**, pero:
  - Se corta la garantía de backups automáticos.
  - No hay corrección de errores nuevos ni soporte.
  - Si el hosteo lo pagás vos y él no te lo reintegra, en algún momento el servicio se cae — esto hay que **dejarlo por escrito** desde el principio (no como amenaza, como condición clara del servicio).

### 4.2 Qué incluye y qué no incluye el mantenimiento
| Incluido | No incluido (se cotiza aparte) |
|---|---|
| Arreglar algo que no calcula bien | Un módulo nuevo grande (ej: turnos, WhatsApp, facturación AFIP) |
| Ajustes chicos de textos/orden de pantallas | Rediseños grandes de una funcionalidad |
| Backups diarios | Recuperar datos borrados por error humano fuera de backup automático |
| Consultas de uso ("¿cómo hago tal cosa?") | Capacitación de un empleado nuevo (se puede cotizar una sesión corta aparte) |

---

## 5. Resumen ejecutivo para llevar a la reunión

| Ítem | Monto |
|---|---|
| Núcleo del sistema (MVP) | USD 1.970 (o en cuotas, ver sección 3) |
| Fase 2 (Presupuestos + Dashboard, opcional, más adelante) | USD 700 – 850 |
| Mantenimiento + Hosteo mensual (siempre, desde que arranca a usarlo) | USD 40 – 60 / mes |
| **Forma de pago recomendada para Cristian** | **Opción C: USD 300 de entrada + USD 140/mes durante 12 meses** (incluye desarrollo + mantenimiento + hosteo; después del mes 12 baja a USD 40-60/mes) |
