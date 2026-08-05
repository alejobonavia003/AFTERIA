# Backlog de Épicas Técnicas (MVP Gastronomía)

Este documento organiza las épicas técnicas para ser utilizadas como
Issues en un tablero Kanban o GitHub Projects.

## Convenciones

-   Cada rectángulo del diagrama de Gantt corresponde a una **Epic**.
-   Cada Epic podrá descomponerse luego en Issues técnicas y subtareas.
-   La asignación de responsables se definirá sobre la marcha.
-   Cada Epic incluye prioridad, estado inicial y dependencias.

## Infraestructura

  ----------------------------------------------------------------------------------
  ID         Epic             Prioridad           Estado        Depende de
  ---------- ---------------- ------------------- ------------- --------------------
  EPIC-001   Inicialización   Alta                Todo          \-
             del repositorio                                    

  EPIC-002   Configuración    Alta                Todo          EPIC-001
             Backend                                            

  EPIC-003   Configuración    Alta                Todo          EPIC-001
             Frontend                                           

  EPIC-004   Configuración    Alta                Todo          EPIC-001
             PostgreSQL                                         

  EPIC-005   Configuración    Alta                Todo          EPIC-004
             Prisma                                             

  EPIC-006   Configuración    Media               Todo          EPIC-002, EPIC-003,
             Docker                                             EPIC-004

  EPIC-007   Configuración    Alta                Todo          EPIC-006
             n8n                                                

  EPIC-008   Variables de     Alta                Todo          EPIC-002, EPIC-003,
             entorno                                            EPIC-007

  EPIC-009   Configuración    Alta                Todo          EPIC-002, EPIC-003,
             inicial del                                        EPIC-008
             proyecto                                           
  ----------------------------------------------------------------------------------

## Modelo de Datos

  ID         Epic                      Prioridad   Estado   Depende de
  ---------- ------------------------- ----------- -------- ------------
  EPIC-010   Diseñar esquema Prisma    Alta        Todo     EPIC-005
  EPIC-011   Migraciones iniciales     Alta        Todo     EPIC-010
  EPIC-012   Seed de datos de prueba   Media       Todo     EPIC-011

## Backend Base

  ID         Epic                        Prioridad   Estado   Depende de
  ---------- --------------------------- ----------- -------- ------------
  EPIC-013   Autenticación JWT           Alta        Todo     EPIC-011
  EPIC-014   Gestión de Usuarios         Alta        Todo     EPIC-013
  EPIC-015   Configuración del Negocio   Alta        Todo     EPIC-013
  EPIC-016   Sistema de Logs             Media       Todo     EPIC-013

## Catálogo

  ID         Epic                         Prioridad   Estado   Depende de
  ---------- ---------------------------- ----------- -------- ------------
  EPIC-017   CRUD Categorías (Backend)    Alta        Todo     EPIC-011
  EPIC-018   CRUD Productos (Backend)     Alta        Todo     EPIC-017
  EPIC-019   Gestión de Stock (Backend)   Alta        Todo     EPIC-018
  EPIC-020   CRUD Promociones (Backend)   Media       Todo     EPIC-018
  EPIC-021   Pantalla Categorías          Alta        Todo     EPIC-017
  EPIC-022   Pantalla Productos           Alta        Todo     EPIC-018
  EPIC-023   Pantalla Stock               Alta        Todo     EPIC-019
  EPIC-024   Pantalla Promociones         Media       Todo     EPIC-020

## WhatsApp

  ID         Epic                             Prioridad   Estado   Depende de
  ---------- -------------------------------- ----------- -------- ------------
  EPIC-025   Webhook WhatsApp                 Alta        Todo     \-
  EPIC-026   Envío de Mensajes                Alta        Todo     EPIC-025
  EPIC-027   Persistencia de Conversaciones   Alta        Todo     EPIC-026
  EPIC-028   Persistencia de Mensajes         Alta        Todo     EPIC-027
  EPIC-029   Vista de Conversaciones          Alta        Todo     EPIC-028

## IA

  ID         Epic                             Prioridad   Estado   Depende de
  ---------- -------------------------------- ----------- -------- ------------
  EPIC-030   Workflow principal n8n           Alta        Todo     EPIC-028
  EPIC-031   Consulta de Productos            Alta        Todo     EPIC-030
  EPIC-032   Consulta de Stock                Alta        Todo     EPIC-031
  EPIC-033   Consulta de Promociones          Alta        Todo     EPIC-032
  EPIC-034   Generación de Respuestas         Alta        Todo     EPIC-033
  EPIC-035   Creación Automática de Pedidos   Alta        Todo     EPIC-034
  EPIC-036   Handoff al Operador              Alta        Todo     EPIC-035

## Frontend

Las vistas de Dashboard, Pedidos, Configuración, Conversaciones y
Alertas podrán desarrollarse en paralelo con el backend utilizando datos
simulados y luego integrarse cuando las APIs estén disponibles.

## Flujo del tablero

Todo → In Progress → Review → Done
