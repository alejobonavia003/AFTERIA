
## RF-001 - Gestión de Productos

El sistema deberá permitir:

- Crear un producto.
- Editar un producto.
- Eliminar un producto.
- Activar o desactivar un producto (sin eliminarlo).
- Organizar productos por categorías.
- Definir precio.
- Definir descripción.
- Definir palabras clave (ej: "mila", "napo", "hamburguesa").

---

## RF-002 - Gestión de Stock

El sistema deberá permitir:

- Activar/desactivar disponibilidad de un producto con un solo botón.
- Reflejar inmediatamente el cambio al agente IA.
- Mostrar claramente qué productos están agotados.

---

## RF-003 - Recepción de Mensajes

El sistema deberá:

- Recibir mensajes provenientes de WhatsApp.
- Crear automáticamente una conversación.
- Identificar al cliente por número telefónico.
- Mantener el historial de conversación.

---

## RF-004 - Atención mediante IA

El sistema deberá permitir que un agente IA:

- Responda consultas.
- Muestre el menú.
- Recomiende productos.
- Arme un pedido.
- Consulte disponibilidad.
- Calcule el total.
- Solicite dirección.
- Solicite nombre.
- Solicite método de pago.
- Confirme el pedido.

---

## RF-005 - Handoff Humano

El sistema deberá permitir:

- Transferir una conversación al operador.
- Notificar visualmente una conversación pendiente.
- Emitir una alerta sonora.
- Permitir devolver la conversación nuevamente a la IA.

---

## RF-006 - Panel de Conversaciones

El operador deberá visualizar:

- Lista de conversaciones.
- Estado de cada conversación.
- Cliente.
- Último mensaje.
- Hora del último mensaje.
- Conversación completa.

---

## RF-007 - Gestión de Pedidos

El sistema deberá:

- Registrar pedidos.
- Registrar productos.
- Registrar cantidades.
- Registrar observaciones.
- Registrar importe.
- Registrar estado.

Estados mínimos:

- Pendiente
- Confirmado
- Preparando
- Listo
- Entregado
- Cancelado

---

## RF-008 - Configuración del Negocio

El sistema deberá permitir configurar:

- Nombre del negocio.
- Dirección.
- Horarios.
- Coste de envío.
- Tiempo estimado.
- Mensaje de bienvenida.

---

## RF-009 - Base de Conocimiento

La IA deberá consultar:

- Productos.
- Categorías.
- Precios.
- Stock.
- Horarios.
- Promociones.

Sin utilizar información hardcodeada.

---

## RF-010 - Dashboard

El sistema deberá mostrar:

- Conversaciones activas.
- Pedidos del día.
- Productos agotados.
- Pedidos pendientes.

---

## RF-011 - Multiempresa (pensando en el SaaS)

Toda la información deberá pertenecer a un negocio.

Cada negocio tendrá:

- Productos propios.
- Clientes propios.
- Pedidos propios.
- Configuración propia.
- Número de WhatsApp propio.

---

## RF-012 - Integración con WhatsApp

El sistema deberá:

- Enviar mensajes.
- Recibir mensajes.
- Mantener contexto de conversación.
- Registrar errores de envío.

---

# Requerimientos No Funcionales

### RNF-001

La interfaz deberá ser responsive para tablet y celular.

### RNF-002

Las consultas del panel deberán responder en menos de 2 segundos.

### RNF-003

Las respuestas de la IA deberán demorar menos de 10 segundos en condiciones normales.

### RNF-004

El sistema deberá soportar múltiples negocios sin mezclar información.

### RNF-005

Toda la información deberá almacenarse en PostgreSQL.

### RNF-006

Las automatizaciones deberán ejecutarse mediante n8n.

### RNF-007

El frontend deberá desarrollarse en React.

### RNF-008

El backend deberá exponer una API REST desarrollada en Node.js.

---

# Stack propuesto

```
Frontend
- React
- Vite
- TailwindCSS
- React Query
- React Router

Backend
- Node.js
- Express
- Prisma ORM
- JWT
- Zod

Base de datos
- PostgreSQL

Automatización
- n8n

IA
- OpenAI API
- RAG simple sobre PostgreSQL (menú + configuración)

Infraestructura
- Docker
- Nginx
```


```
```