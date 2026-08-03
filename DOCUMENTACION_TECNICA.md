# Portal de Alumnos — Les Rois Du Français
## Documentación Técnica v2.0

Este documento contiene la arquitectura técnica completa, módulos, esquema de datos, integraciones y despliegue del Portal 360° de Les Rois Du Français.

---

## 1. Arquitectura del Sistema

Monorepo con arquitectura cliente-servidor separada. 3 portales (Admin, Teacher, Student), 12 módulos backend, integración con Zoom, WhatsApp Cloud API, OpenAI y Supabase.

### 1.1 Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS v4, Lucide React, React Router v6 |
| **Backend** | NestJS, TypeScript, Prisma ORM v7, PostgreSQL (Supabase Pooler) |
| **Base de Datos** | Supabase (PostgreSQL 15, Connection Pooler IPv4) |
| **IA** | OpenAI SDK (Modelo `gpt-4o-mini`) — Chatbot contextual |
| **Zoom** | Server-to-Server OAuth — 6 cuentas Pro |
| **WhatsApp** | Meta Cloud API v21 — Templates + Webhook |
| **Autenticación** | Supabase Auth + JWT + RBAC (Admin/Teacher/Student) |

### 1.2 Módulos Backend (12)

```
backend/src/
├── admin/          — CRUD usuarios, grupos, horarios, settings
├── ai/             — Chatbot OpenAI con inyección de contexto
├── auth/           — JWT Guard + Roles Guard + Decorator
├── classes/        — Listado de clases del estudiante
├── leads/          — CRM pipeline: CRUD + analytics
├── payments/       — Enrollments + Payments + Analytics 360°
├── progress/       — UserProgress tracking por recurso
├── resources/      — CRUD de recursos (clases, videos, PDFs)
├── teacher/        — Portal profesor (grupos, horarios, asistencia, evaluaciones)
├── whatsapp/       — WhatsApp Cloud API integration (Meta)
└── zoom/           — Zoom S2S OAuth, meeting creation, host pool
```

### 1.3 Páginas Frontend

**Admin (11 páginas):**
| Ruta | Componente | Función |
|---|---|---|
| `/admin` | `AdminDashboard` | Resumen general |
| `/admin/users` | `UsersManager` | CRUD alumnos y profesores |
| `/admin/groups` | `GroupsManager` | Grupos con modalidad, ritmo, profesor, zoom |
| `/admin/resources` | `ResourcesManager` | Materiales por módulo |
| `/admin/schedule` | `ScheduleManager` | Programación semanal con horarios individuales |
| `/admin/zoom` | `ZoomHostsManager` | Pool de 6 cuentas Zoom con credenciales S2S |
| `/admin/crm` | `CRMManager` | Kanban drag & drop de prospectos |
| `/admin/payments` | `PaymentsManager` | Inscripciones y registro de pagos |
| `/admin/analytics` | `Analytics360` | Dashboard ejecutivo 360° |
| `/admin/settings` | `SettingsManager` | Presupuesto Ads, nombre escuela |

**Teacher (6 páginas):**
| Ruta | Componente | Función |
|---|---|---|
| `/teacher` | `TeacherDashboard` | Resumen del profesor |
| `/teacher/groups` | `TeacherGroups` | Grupos asignados |
| `/teacher/schedule` | `TeacherSchedule` | Horario semanal personal |
| `/teacher/students` | `TeacherStudents` | Listado de sus alumnos |
| `/teacher/attendance` | `TeacherAttendance` | Registro de asistencia |
| `/teacher/evaluations` | `TeacherEvaluations` | Exámenes oral + escrito |

**Student (6 páginas):**
| Ruta | Componente | Función |
|---|---|---|
| `/` | `Dashboard` | Progreso y nivel actual |
| `/mis-clases` | `MisClases` | Clases en vivo programadas |
| `/recursos` | `Recursos` | Materiales por unidad |
| `/progreso` | `Progreso` | Avance detallado |
| `/estadisticas` | `Estadisticas` | Métricas personales |
| `/video-frances` | `VideoFrances` | Clases grabadas |

---

## 2. Esquema de Base de Datos (Prisma v7)

### 2.1 Enums (8)

| Enum | Valores |
|---|---|
| `Role` | STUDENT, ADMIN, TEACHER |
| `ResourceType` | LIVE_CLASS, RECORDED_VIDEO, PDF, TEST, HOMEWORK |
| `ProgressStatus` | NOT_STARTED, IN_PROGRESS, COMPLETED |
| `ClassModality` | GROUP, INDIVIDUAL, PART_DUO |
| `StudyRhythm` | REGULAR, SATURDAY, INTENSIVE |
| `LeadSource` | GOOGLE_ADS, META_ADS, INSTAGRAM, FACEBOOK, WHATSAPP_ORGANIC, REFERRAL, WEBSITE |
| `LeadStatus` | NEW, CONTACTED, TRIAL_CLASS, ENROLLED, LOST |
| `PaymentStatus` | PENDING, PAID, OVERDUE, CANCELLED |

### 2.2 Modelos (12)

| Modelo | Descripción | Relaciones clave |
|---|---|---|
| `User` | Alumno, profesor o admin | `→ Level, Progress, Evaluations, Enrollments, Attendance` |
| `Level` | Grupo de estudio | `→ Modules, Users, Teacher, Evaluations, Enrollments` |
| `Module` | Unidad del nivel (4 por nivel) | `→ Resources` |
| `Resource` | Clase, video, PDF, tarea | `→ Module, ZoomHost, Progress, Attendance` |
| `UserProgress` | Avance del alumno por recurso | `→ User, Resource` |
| `ZoomHost` | Cuenta Zoom Pro con credenciales S2S | `→ Resources (meetings)` |
| `Evaluation` | Examen oral + escrito por nivel | `→ User (student), User (evaluator), Level` |
| `Enrollment` | Inscripción a un grupo con plan y tarifa | `→ User, Level, Payments` |
| `Payment` | Pago de mensualidad | `→ Enrollment` |
| `Attendance` | Asistencia a clase | `→ User, Resource, Level` |
| `Lead` | Prospecto del CRM | Standalone |
| `AppSettings` | Config global (presupuesto Ads) | Singleton `id: "global"` |

---

## 3. Variables de Entorno

### Backend (`/backend/.env`)
```env
# Supabase — Connection Pooler (Transaction mode, IPv4)
DATABASE_URL="postgresql://postgres.fhbjfyivpkwlpefzmfit:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres"

# Supabase — Direct connection (Session mode, for migrations)
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.fhbjfyivpkwlpefzmfit.supabase.co:5432/postgres"

# OpenAI — Chatbot contextual
OPENAI_API_KEY="sk-proj-..."

# WhatsApp Cloud API (Meta Business)
WHATSAPP_TOKEN="EAAxxxxxxx"           # Permanent System User token
WHATSAPP_PHONE_ID="123456789"         # Phone Number ID from Meta
WHATSAPP_VERIFY_TOKEN="lesrois_verify_2026"  # Webhook verification token
```

### Frontend (`/frontend/.env`)
```env
VITE_API_URL="https://tu-backend.onrender.com"
```

---

## 4. Integración WhatsApp (Meta Cloud API v21)

### 4.1 Configuración Inicial

1. Crear Meta Business App en [developers.facebook.com](https://developers.facebook.com)
2. Agregar producto **WhatsApp** a la app
3. Crear **System User** con permiso `whatsapp_business_messaging`
4. Generar **permanent access token**
5. Registrar número de WhatsApp Business de la escuela
6. Configurar webhook URL: `https://backend-url/whatsapp/webhook`

### 4.2 Templates a Crear en Meta Business Suite

| Template | Variables | Uso |
|---|---|---|
| `bienvenida_lead` | `{{1}}` = nombre | Bienvenida al nuevo prospecto |
| `clase_recordatorio` | `{{1}}` = nombre, `{{2}}` = grupo, `{{3}}` = fecha/hora, `{{4}}` = zoom link | Recordatorio 24h antes |
| `pago_confirmado` | `{{1}}` = nombre, `{{2}}` = monto, `{{3}}` = método | Confirmación de pago |
| `clase_prueba` | `{{1}}` = nombre, `{{2}}` = fecha/hora, `{{3}}` = zoom link | Invitación a clase de prueba |
| `nivel_completado` | `{{1}}` = nombre, `{{2}}` = nivel, `{{3}}` = certificado URL | Felicitación + certificado |

### 4.3 Endpoints

| Método | Ruta | Auth | Función |
|---|---|---|---|
| GET | `/whatsapp/webhook` | — | Verificación Meta |
| POST | `/whatsapp/webhook` | — | Recibir mensajes entrantes |
| GET | `/whatsapp/status` | Admin | Estado de configuración |
| POST | `/whatsapp/send` | Admin | Enviar texto libre |
| POST | `/whatsapp/welcome-lead` | Admin | Template bienvenida |
| POST | `/whatsapp/remind-class` | Admin | Template recordatorio |
| POST | `/whatsapp/confirm-payment` | Admin | Template pago confirmado |

### 4.4 Flujo Automático (Futuro)

```
Lead nuevo (CRM) ──→ WhatsApp: bienvenida_lead
Lead → TRIAL_CLASS ──→ WhatsApp: clase_prueba
Alumno: clase mañana ──→ WhatsApp: clase_recordatorio (CRON 24h antes)
Pago registrado ──→ WhatsApp: pago_confirmado
Evaluación pasada ──→ WhatsApp: nivel_completado + certificado
```

---

## 5. Integración Zoom (S2S OAuth × 6 cuentas)

### 5.1 Pool de Cuentas

La escuela opera con **6 cuentas Zoom Pro independientes**. Cada una se registra como `ZoomHost` con sus propias credenciales S2S OAuth (Account ID, Client ID, Client Secret).

### 5.2 Asignación

- Cada `Level` (grupo) tiene un campo `zoomLink` fijo permanente
- Al crear una clase `LIVE_CLASS`, se selecciona un `ZoomHost` disponible
- El token S2S se genera on-demand con cache de 1 hora

### 5.3 Endpoints

| Método | Ruta | Función |
|---|---|---|
| GET | `/admin/zoom-hosts` | Listar hosts |
| POST | `/admin/zoom-hosts` | Crear host con credenciales |
| PATCH | `/admin/zoom-hosts/:id` | Actualizar |
| DELETE | `/admin/zoom-hosts/:id` | Eliminar |
| GET | `/admin/zoom-hosts/:id/test` | Probar conexión S2S |

---

## 6. CRM de Prospectos

### 6.1 Pipeline (Kanban)

```
NEW → CONTACTED → TRIAL_CLASS → ENROLLED ✅
                                → LOST ❌
```

### 6.2 Canales de Origen

Google Ads, Meta Ads (IG/FB), WhatsApp Orgánico, Referido, Website.

### 6.3 Analytics CRM

- Leads por canal con porcentaje
- Tasa de conversión (leads → inscritos)
- Costo por lead (presupuesto Ads ÷ leads por canal)
- Costo por lead total combinado

---

## 7. Facturación y Pagos

### 7.1 Modelo

- `Enrollment`: Inscripción de alumno a grupo con plan (Grupal Regular, Individual, etc.) y tarifa mensual
- `Payment`: Registro individual de pago con método (PayPal 90%, Transferencia, Efectivo, Tarjeta) y referencia

### 7.2 Endpoints

| Método | Ruta | Función |
|---|---|---|
| GET | `/admin/enrollments` | Listar inscripciones |
| POST | `/admin/enrollments` | Nueva inscripción |
| PATCH | `/admin/enrollments/:id` | Actualizar |
| DELETE | `/admin/enrollments/:id` | Eliminar (+ pagos) |
| GET | `/admin/payments` | Listar pagos |
| POST | `/admin/payments` | Registrar pago |
| DELETE | `/admin/payments/:id` | Eliminar pago |
| GET | `/admin/analytics360` | Dashboard ejecutivo |

---

## 8. Analytics 360° Dashboard

Visión ejecutiva para el owner:

| Métrica | Fuente |
|---|---|
| Alumnos activos | User (role: STUDENT) |
| Profesores | User (role: TEACHER) |
| Grupos activos | Level count |
| Revenue este mes / anterior / acumulado | Payment aggregates |
| Tasa de conversión | Lead (ENROLLED / total) |
| Costo por alumno | Ad budgets ÷ enrolled leads |
| Distribución por modalidad | Level groupBy modality |
| Distribución por ritmo | Level groupBy rhythm |
| Inscripciones por plan | Enrollment groupBy planType |
| Pagos por método | Payment groupBy method |
| Ocupación de grupos | Level users count vs maxStudents |
| Actividad reciente | Last 5 payments + leads |

---

## 9. RBAC (Role-Based Access Control)

### 9.1 Roles

| Rol | Acceso |
|---|---|
| `ADMIN` | Todo: Admin Panel, CRM, Pagos, Analytics, Settings, Zoom, WhatsApp |
| `TEACHER` | Portal Profesor: sus grupos, horarios, alumnos, asistencia, evaluaciones |
| `STUDENT` | Portal Alumno: dashboard, clases, recursos, progreso, chatbot IA |

### 9.2 Implementación

- **Backend**: `JwtAuthGuard` + `RolesGuard` + `@Roles('ADMIN')` decorator
- **Frontend**: `ProtectedRoute` con `requireAdmin` / `requireTeacher` props
- **Auth Store**: Zustand `authStore` con `isAdmin`, `isTeacher` computed

---

## 10. Módulo de IA (Chatbot Les Rois)

1. El alumno envía un mensaje desde React
2. NestJS (`AiService`) consulta BD: nombre, nivel, grupo, próxima clase
3. Inyecta datos en System Prompt oculto
4. Envía a `gpt-4o-mini` vía OpenAI SDK
5. Responde en tono corporativo sin alucinaciones

---

## 11. Despliegue a Producción

### 11.1 Backend — Render (Web Service)

| Campo | Valor |
|---|---|
| Root Directory | `backend` |
| Environment | Node |
| Build Command | `npm install --include=dev && npx prisma generate && npm run build` |
| Start Command | `npm run start:prod` |
| Variables | `DATABASE_URL`, `DIRECT_URL`, `OPENAI_API_KEY`, `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID` |

### 11.2 Frontend — Vercel

| Campo | Valor |
|---|---|
| Framework | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Variables | `VITE_API_URL` |

### 11.3 Base de Datos — Supabase

- PostgreSQL 15, Connection Pooler (Transaction mode, IPv4)
- Región: `aws-1-us-east-2`
- Schema sync: `npx prisma db push`

---

## 12. Git Flow

```
feature/* ──→ dev ──→ main
```

Ramas activas:
- `main` — Producción
- `dev` — Desarrollo
- `feature/v2-teacher-crm` — Portal profesor + CRM
- `feature/v2.2-payments-analytics` — Facturación + Analytics
- `feature/v2.3-whatsapp-docs` — WhatsApp + Documentación

---

## 13. Historial de Cambios

Consultar [`CHANGELOG.md`](./CHANGELOG.md) para versiones:
- **v2.2.0** — Facturación, Pagos, Analytics 360°
- **v2.1.0** — CRM Prospectos, Settings, LeadsModule
- **v2.0.0** — Schema v2, Portal Profesor, Estructura Académica
- **v1.1.0** — Zoom Pool, Grupos CRUD, Horarios
- **v1.0.0** — Portal Alumno, Chatbot IA, Progreso
