# Changelog — Portal de Alumnos Les Rois du Français

Todos los cambios notables del proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto se adhiere al [Versionado Semántico](https://semver.org/lang/es/).

---

## [1.1.0] — 2026-07-29

### Cambiado
- **Módulo de Grupos (Niveles):** El modelo `Level` ahora soporta 3 campos separados:
  - `name` — Nombre del grupo (ej. "Grupo París", "Grupo Burdeos").
  - `levelCode` — Nivel académico (A1, A2, B1, B2, C1, C2).
  - `schedule` — Horario del grupo (ej. "Lun, Mier, Vier · 10:00-12:00").
- **GroupsManager (Admin):** Formulario rediseñado con selector visual de días, selector de nivel y campos de hora inicio/fin.
- **Tabla de Grupos:** Ahora muestra nombre, nivel, horario y acciones.
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
