``` mermaid
gantt
    title MVP Gastronomía - Plan de Desarrollo
    dateFormat X
    axisFormat %d

    section Infraestructura
    Inicializar repositorios                 :a1, 0, 1d
    Configurar Docker                        :a2, after a1, 1d
    Configurar PostgreSQL                    :a3, after a2, 1d
    Configurar Prisma                        :a4, after a3, 1d
    Configurar React + Vite                  :a5, after a2, 1d
    Configurar Express                       :a6, after a3, 1d
    Configurar n8n                           :a7, after a3, 1d

    section Modelo de Datos
    Diseñar esquema Prisma                   :b1, after a4, 2d
    Migraciones iniciales                    :b2, after b1, 1d
    Seed de datos de prueba                  :b3, after b2, 1d

    section Backend Base
    Autenticación JWT                        :c1, after b3, 2d
    Usuarios                                 :c2, after c1, 1d
    Configuración del negocio                :c3, after c2, 1d
    Logs                                     :c4, after c3, 1d

    section Catálogo
    CRUD Categorías                          :d1, after c4, 2d
    CRUD Productos                           :d2, after d1, 3d
    Gestión Stock                            :d3, after d2, 1d
    CRUD Promociones                         :d4, after d3, 2d

    section Frontend
    Layout Dashboard                         :e1, after a5, 2d
    Login                                    :e2, after e1, 1d
    Gestión Productos                        :e3, after d2, 2d
    Gestión Categorías                       :e4, after d1, 1d
    Gestión Stock                            :e5, after d3, 1d
    Gestión Promociones                      :e6, after d4, 1d
    Configuración                            :e7, after c3, 1d

    section WhatsApp
    Webhook recepción                        :f1, after c4, 2d
    Envío de mensajes                        :f2, after f1, 1d
    Persistencia conversaciones              :f3, after f2, 2d
    Persistencia mensajes                    :f4, after f3, 1d

    section IA
    Workflow principal n8n                   :g1, after f4, 2d
    Consulta productos                       :g2, after g1, 1d
    Consulta stock                           :g3, after g2, 1d
    Consulta promociones                     :g4, after g3, 1d
    Generación de respuestas                 :g5, after g4, 2d
    Creación automática de pedidos           :g6, after g5, 2d
    Handoff a operador                       :g7, after g6, 2d

    section Pedidos
    Modelo Pedido                            :h1, after g6, 1d
    CRUD Pedidos                             :h2, after h1, 2d
    Cambio de estados                        :h3, after h2, 1d

    section Dashboard
    Lista conversaciones                     :i1, after g7, 2d
    Vista conversación                       :i2, after i1, 2d
    Alertas visuales                         :i3, after i2, 1d
    Alertas sonoras                          :i4, after i3, 1d
    Métricas                                 :i5, after h3, 2d

    section Integración Final
    Flujo completo IA                        :j1, after i5, 2d
    Testing funcional                        :j2, after j1, 2d
    Corrección de errores                    :j3, after j2, 3d
    Deploy producción                        :j4, after j3, 1d
```

