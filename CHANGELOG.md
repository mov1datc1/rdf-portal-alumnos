# Changelog — Portal de Alumnos Les Rois du Français

Todos los cambios notables del proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto se adhiere al [Versionado Semántico](https://semver.org/lang/es/).

---

## [2.3.4] — 2026-08-14

### Cambiado
- **UI de Asistencia (Teacher):** Rediseño completo del módulo de Asistencia (`TeacherAttendance`). La selección de clases ahora utiliza un esquema de dos columnas con tarjetas modernas para clases pasadas y futuras, en lugar del selector nativo tradicional.
- **Backend (Asistencia):** Nuevo endpoint `GET /teacher/attendance/schedule` que permite a los profesores recuperar clases de los últimos 7 días, permitiendo así registrar asistencias de manera retroactiva en caso de olvido.
- **Funcionalidad (Asistencia):** Añadidas opciones para ordenar la lista de alumnos alfabéticamente (por nombre o apellido) y botones de acción rápida para marcar a todos como presentes o ausentes. El auditor grupal se integró nativamente a la cabecera.

---

## [2.3.3] — 2026-08-12

### Agregado
- **Detección de Colisiones de Zoom (Schedule):** Implementado motor preventivo en la programación de clases (`ScheduleManager`) que desactiva y bloquea cuentas de Zoom si ya existe otra clase registrada en el mismo bloque de tiempo exacto.
- **Utilidad de Horarios:** Nueva herramienta algorítmica en `schedule.ts` capaz de transformar horarios en texto ("Lun, Mié, Vie · 08:00-10:50") en rangos de minutos matemáticos para cruzar colisiones instantáneamente en el frontend.

### Arreglado
- **Guardado de Links Automáticos:** Corrección en el guardado de `ScheduleManager` que ocasionaba que las clases creadas con "Zoom Automático del Grupo" se registraran con el link permanente en formato "Manual" (desvinculando la clase del `ZoomHost`). Ahora se asocian correctamente a su `zoomHostId` en la BD.
- **Fallback para Cuentas Zoom sin API S2S:** Corrección en el backend (`zoom.service.ts` y `admin.service.ts`) para prevenir el crash de guardado ("No tiene credenciales S2S") cuando los grupos usan Links Permanentes sin una integración formal OAuth hacia Meta/Zoom.
- **Desbloqueo a nivel Grupo:** La regla de colisión fue eliminada del `GroupsManager` para permitir que distintos grupos compartan libremente el mismo enlace oficial de Zoom si tienen pocos recursos.

---

## [2.3.2] — 2026-08-11

### Agregado
- **Bitácora de Clases (Profesor):** Nuevo módulo `/teacher/logs` que permite a los profesores registrar una bitácora detallada de cada clase impartida (título, fecha, grupo y resumen de actividades).
- **Backend:** Endpoints `GET` y `POST /teacher/logs` agregados para gestionar el registro y visualización de bitácoras utilizando el modelo `Resource`.

---

## [2.3.1] — 2026-08-11

### Arreglado
- **Bug Backend (Analytics):** Corrección en `main.ts` para asegurar que `dotenv.config()` se ejecute antes de inicializar los módulos (evitando el error 401 Unauthorized en `JwtStrategy`).
- **Base de Datos (Prisma):** Cambio en `.env` para usar el Connection Pooler (IPv4 en el puerto 6543) de Supabase en `DATABASE_URL` y resolver errores `P1001` de conexión de base de datos.
- **Frontend (Analytics360):** Manejo de errores agregado en `Analytics360.tsx` para evitar que la aplicación de React colapse con una pantalla blanca si el servidor retorna un error.

---
## [2.3.0] — 2026-08-03

### Agregado
- **WhatsApp Cloud API Integration:** WhatsappModule con Meta Graph API v21.
  - Templates: `bienvenida_lead`, `clase_recordatorio`, `pago_confirmado`, `clase_prueba`, `nivel_completado`.
  - Webhook verification (GET/POST) para recibir mensajes entrantes.
  - Admin endpoints: enviar texto, bienvenida a lead, recordatorio de clase, confirmación de pago.
  - Normalización de números mexicanos (+52).
- **DOCUMENTACION_TECNICA v2.0:** Reescritura completa con 13 secciones (12 módulos, 23 páginas, esquema completo, RBAC, WhatsApp, Zoom, CRM, Pagos, Analytics 360°, despliegue).

### Configuración Requerida
- `WHATSAPP_TOKEN` — Permanent System User token de Meta
- `WHATSAPP_PHONE_ID` — Phone Number ID del WhatsApp Business
- `WHATSAPP_VERIFY_TOKEN` — Token de verificación de webhook
- Crear 5 templates en Meta Business Suite (ver DOCUMENTACION_TECNICA.md §4.2)

---

## [2.2.0] — 2026-08-03

### Agregado
- **Facturación y Pagos:** Inscripciones con plan, mensualidad, fecha inicio. Registro de pagos con método (PayPal, Transferencia, Efectivo, Tarjeta) y referencia.
- **PaymentsModule:** Backend CRUD completo para Enrollment + Payment + Analytics360.
- **Analytics 360°:** Dashboard ejecutivo con revenue MoM, tasa de conversión, costo por alumno, distribuciones (modalidad, ritmo, plan, método de pago), ocupación de grupos con barras de progreso, y actividad reciente.
- **Admin Sidebar:** "Facturación" y "Analytics 360°" con íconos.

---

## [2.1.0] — 2026-08-03

### Agregado
- **CRM de Prospectos:** Pipeline Kanban con drag & drop (5 etapas: Nuevo → Contactado → Clase Prueba → Inscrito / No Inscrito).
- **Analytics CRM:** Leads por canal (Google, Meta, WhatsApp, etc.), tasa de conversión, costo por lead calculado con presupuesto editable.
- **LeadsModule:** Backend CRUD completo + analytics endpoint con groupBy por source/status.
- **Configuración Global:** Presupuesto editable de Google Ads ($10,000 MXN) y Meta Ads ($3,000 MXN).
- **Admin Sidebar:** Enlaces "CRM Prospectos" y "Configuración" con separador visual.
- **DB Push Exitoso:** Schema v2.0 sincronizado a Supabase (Attendance, Evaluation, Enrollment, Payment, Lead, AppSettings).

---

## [2.0.0] — 2026-08-03

### Agregado
- **Estructura Académica Completa:** Modalidades (Grupal, Individual, Part Duo), ritmos (Regular, Sabatino, Intensivo), capacidad máxima, enlace Zoom fijo por grupo.
- **Asignación de Profesor:** Campo `teacherId` en Level, dropdown en GroupsManager, endpoint `/admin/teachers`.
- **6 Niveles Académicos:** Básico 1/2, Intermedio 1/2, Avanzado 1/2 con auto-creación de 4 Unidades al crear grupo.
- **Portal del Profesor (6 páginas):**
  - Dashboard con métricas y próxima clase.
  - Mis Grupos, Mi Horario, Mis Alumnos, Asistencia, Evaluaciones.
  - Layout con sidebar verde y navegación independiente.
- **Evaluaciones:** Registro de scores orales y escritos, aprobación automática (≥60), historial.
- **Asistencia:** Registro por clase con toggle Presente/Ausente por alumno.
- **Schema CRM (preparado):** Modelos Lead, Enrollment, Payment, Attendance, AppSettings para Fase 3.
- **Multi-Role Routing:** ADMIN → `/admin`, TEACHER → `/teacher`, STUDENT → `/`.
- **AppSettings:** Presupuesto editable de Google Ads y Meta Ads.

### Cambiado
- **Schema:** Level refactorizado con `modality`, `rhythm`, `maxStudents`, `zoomLink`, `teacherId`.
- **AdminService:** Dashboard con 7 métricas, Level CRUD con campos nuevos, evaluaciones, settings.
- **ProtectedRoute:** Soporte `requireTeacher` + auto-redirect por rol.
- **AuthStore:** Campos `isTeacher`, `role` para routing dinámico.

---

## [1.2.0] — 2026-07-30

### Agregado
- **Integración Zoom Multi-Cuenta:** Soporte para 6 cuentas Zoom Pro independientes con credenciales S2S OAuth individuales.
- **Modelo `ZoomHost`:** Almacena email, displayName, accountId, clientId, clientSecret por cuenta.
- **ZoomService:** Token caching por host (55 min), auto-creación de meetings vía Zoom API, cancelación automática al eliminar clase.
- **ZoomHostsManager (Admin):** CRUD completo de cuentas Zoom con test de conectividad y toggle de activación.
- **ScheduleManager (Admin):** Dropdown para seleccionar host de Zoom — el meeting se crea automáticamente. Fallback a URL manual si no se selecciona host.
- **Sidebar:** Nuevo enlace "Zoom Hosts" en el menú de administración.

### Cambiado
- **AdminService:** `scheduleClass` ahora integra ZoomService para auto-crear meetings. `deleteScheduledClass` cancela meetings en Zoom.
- **Schema:** `Resource` ahora tiene `zoomMeetingId` y `zoomHostId` para tracking.

---

## [1.1.0] — 2026-07-29

### Cambiado
- **Módulo de Grupos (Niveles):** El modelo `Level` ahora soporta 3 campos separados:
  - `name` — Nombre del grupo (ej. "Grupo París", "Grupo Burdeos").
  - `levelCode` — Nivel académico (A1, A2, B1, B2, C1, C2).
  - `schedule` — Horario del grupo con soporte para:
    - **Horario uniforme:** "Lun, Mier, Vier · 10:00-12:00" (misma hora todos los días).
    - **Horario por día:** "Lun 08:00-09:00, Mier 14:00-16:00" (hora independiente por día).
- **GroupsManager (Admin):** Formulario rediseñado con:
  - Selector visual de días (badges toggleables).
  - Toggle rápido "Misma hora todos" para horario uniforme.
  - Campos de hora individuales por día cuando se desactiva el toggle.
  - Prefill inteligente al cambiar entre modos.
- **Tabla de Grupos:** Ahora muestra nombre, nivel, horario (con formato stacked para per-day) y acciones.
- **UsersManager (Admin):** El dropdown de asignación de grupo ahora muestra formato: `"Grupo París (B1)"`.
- **Documentación Técnica** actualizada a v1.1.

### Agregado
- Archivo `CHANGELOG.md` para llevar registro versionado de cambios.

---

## [1.0.0] — 2026-05-01

### Agregado
- Portal de Alumnos con login via Supabase Auth (email/password).
- Roles RBAC: STUDENT, ADMIN, TEACHER.
- **Admin Dashboard** con métricas de alumnos activos, recursos y nuevos registros.
- **Gestión de Alumnos:** CRUD completo, activar/desactivar, asignación de grupo.
- **Gestión de Grupos (Niveles):** Crear, editar, eliminar niveles. Auto-creación de módulo por defecto.
- **Programación de Clases:** CRUD de clases en vivo con fecha, Zoom link y grupo asignado.
- **Gestión de Recursos:** PDFs y Videos grabados por módulo.
- **AI Chatbot** (Les Rois Assistant) con contexto inyectado: nombre, nivel, próximas 5 clases.
- **Aislamiento por grupo:** Estudiantes solo ven clases y recursos de su nivel asignado.
- Documentación Técnica v1.0 con guía de despliegue (Render + Vercel).

## [2026-08-12] - Mejoras en Facturación y Recursos
### Facturación y Pagos
- Se habilitaron los pagos parciales (ej. pagar  de una mensualidad de ,000) manteniendo el estado como Pendiente hasta saldar.
- Cálculo automático de deudas basado en meses transcurridos desde el inicio del alumno.
- Implementación de un Historial de Pagos interactivo en la tabla al presionar el monto pagado.
- Bloqueo de selección de grupo al inscribir un alumno que ya tiene uno asignado.

### Gestor de Recursos
- Envío masivo de recursos (Videos, PDF, Tareas) a múltiples grupos a la vez usando casillas de selección.
- Historial filtrado de recursos por categoría con modales emergentes.
- Se añadió funcionalidad de eliminación masiva (selección múltiple) con botón dedicado.
- Se implementó un modal de confirmación de eliminación estético, reemplazando la alerta por defecto del navegador.

### Portal del Alumno (Recursos)
- Nuevo Reproductor Interno Embebido: los videos y PDFs ya no redirigen a los alumnos a pestañas externas. Todo se reproduce directamente dentro de la plataforma con soporte para pantalla completa.
