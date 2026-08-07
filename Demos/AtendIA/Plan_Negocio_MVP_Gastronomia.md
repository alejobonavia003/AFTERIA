# Plan de Negocio y Estrategia de Ejecución: MVP General de Asistente IA para Gastronomía

## 1. Visión General del Producto
Una plataforma de atención al cliente unificada para rotiserías y locales de comida con alto volumen de delivery. El sistema centraliza los mensajes en una única bandeja de entrada manejada por un Agente de IA. 

**El problema que resuelve:** Los locales gastronómicos con delivery reciben una gran cantidad de consultas y pedidos que requieren atención manual [cite: 9], lo que obliga a tener personal dedicado exclusivamente al teléfono.
**La solución:** El agente automatiza la toma de pedidos, liberando al empleado para que pueda enfocarse 100% en la atención presencial y el armado de pedidos, optimizando los recursos del local.

## 2. El Pivote Estratégico: "MVP General + Integración a Medida"
En lugar de vender maquetas sin código, se construirá un MVP 100% funcional y genérico (una rotisería de prueba). El objetivo es ir a las reuniones comerciales en Río Cuarto con una tablet y un número de teléfono para que el cliente experimente la toma del pedido en tiempo real.
Una vez cerrada la venta, se ejecuta una fase rápida de integración donde el MVP genérico se adapta a los datos específicos (menú, precios, reglas de negocio) del local contratante.

## 3. Alcance del MVP General (Producto de demostración)
Para mantener la agilidad de desarrollo, el sistema base debe ser robusto pero limitado en funcionalidades periféricas:
*   **Canal Principal:** Integración exclusiva con WhatsApp, dejando Meta (IG/FB) para versiones futuras.
*   **Panel de Control en Tiempo Real:** Interfaz rápida para tablet o celular que permita encender/apagar stock de productos instantáneamente. La IA consultará esta base antes de confirmar órdenes.
*   **Handoff Humano Efectivo:** Alertas visuales (colores fuertes) y sonoras para notificar al cajero cuando la IA requiera intervención humana.
*   **Identidad Visual del Producto:** Para destacar en las demostraciones frente a los dueños de los locales, el panel de control y el material comercial utilizarán una estética visual retro-moderna y estilo póster vintage, con paletas de colores limitadas y texturas que rompan con el diseño corporativo tradicional.

## 5. Proceso de Venta e Integración
1. **Demo en Vivo:** Presentación en el local del cliente. Se le invita a pedir comida al bot genérico de prueba.
2. **Cierre y Seña:** Se firma el acuerdo y se cobra el inicio de la implementación.
3. **Onboarding / Integración:** Se carga la carta del cliente, se ajusta el comportamiento (prompt) de la IA a su tono de voz y se conectan sus credenciales de WhatsApp Business.
4. **Despliegue y Capacitación:** Puesta en marcha en el local, enseñándole al personal cómo usar el interruptor de stock y atender las alertas de handoff.

## 6. Gestión de Riesgos
*   **Estabilidad en Hora Pico:** El sistema genérico debe estar sometido a pruebas de estrés. Una falla un sábado a la noche destruye la confianza comercial.
*   **Fricción en la Integración:** Si la arquitectura inicial acopla demasiado el código al menú de prueba, cada nuevo cliente exigirá reescribir software. El diseño de la base de datos (PostgreSQL) debe abstraer completamente los productos y categorías.
