# Portal de Alumnos - Les Rois Du Français
## Documentación Técnica v1.0

Este documento contiene la arquitectura técnica, configuración y pasos de despliegue para el Portal de Alumnos de Les Rois Du Français.

---

## 1. Arquitectura del Sistema
El proyecto está construido bajo una arquitectura cliente-servidor separada (Monorepo), donde el frontend consume una API RESTful provista por el backend. El backend, a su vez, gestiona la lógica de negocio, se conecta a la base de datos y se comunica con servicios externos de Inteligencia Artificial.

### 1.1 Stack Tecnológico
- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, Lucide React (Iconografía), React Router v6.
- **Backend:** NestJS, TypeScript, Prisma ORM v7, PostgreSQL (Supabase Pooler).
- **IA:** OpenAI SDK (Modelo `gpt-4o-mini`).
- **Base de Datos:** Supabase (PostgreSQL 15).

---

## 2. Variables de Entorno Requeridas

Para que el proyecto funcione en cualquier entorno (Local o Producción), se requieren los siguientes valores en los archivos `.env`.

### Backend (`/backend/.env`)
```env
# Conexión principal mediante Pooler (Transaction pooler) para consultas de Prisma
DATABASE_URL="postgresql://postgres.fhbjfyivpkwlpefzmfit:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres"

# Conexión directa (Session) requerida por Prisma para correr migraciones (npx prisma db push / migrate)
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.fhbjfyivpkwlpefzmfit.supabase.co:5432/postgres"

# Llave de API de OpenAI para el Assistant Les Rois
OPENAI_API_KEY="sk-proj-..."
```

### Frontend (`/frontend/.env`) - *Opcional*
```env
# URL del backend en producción
VITE_API_URL="https://tu-backend-en-render.onrender.com"
```
*(Nota: Actualmente el frontend hace peticiones a `http://localhost:3000`. En producción se debe usar variables de entorno).*

---

## 3. Base de Datos (Esquema Prisma)

La base de datos relacional almacena el progreso granular del alumno. Modelos principales:
- **`User`**: Alumno o Profesor (`role`, `email`, `currentLevelId`).
- **`Level`**: Ej. B1 · Intermedio.
- **`Module`**: Sub-unidad del nivel.
- **`Resource`**: Clases en vivo, Videos grabados, PDFs.
- **`UserProgress`**: Tabla pivote que registra el % de avance, score y estado (`IN_PROGRESS`, `COMPLETED`) de un usuario en un recurso.

---

## 4. Guía de Despliegue a Producción

La estrategia de despliegue sugerida es utilizar **Vercel** para el Frontend (por su optimización global de CDNs para React) y **Render** para el Backend (por su capacidad de correr contenedores o procesos continuos de Node.js).

### 4.1 Despliegue del Backend en Render (Servicio Web)

1. Crea una cuenta en [Render.com](https://render.com) y enlaza tu GitHub.
2. Crea un nuevo **Web Service**.
3. Selecciona tu repositorio de GitHub `mov1datc1/rdf-portal-alumnos`.
4. Configura el entorno:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install --include=dev && npx prisma generate && npm run build`
   - **Start Command:** `npm run start:prod`
5. Configura las **Environment Variables** en Render pegando los valores de `DATABASE_URL`, `DIRECT_URL` y `OPENAI_API_KEY`.
6. Haz clic en **Deploy**. Al finalizar, Render te dará un dominio (ej. `https://rdf-backend.onrender.com`).

### 4.2 Despliegue del Frontend en Vercel

1. Inicia sesión en [Vercel.com](https://vercel.com) y enlaza tu GitHub.
2. Haz clic en **Add New Project** y selecciona `mov1datc1/rdf-portal-alumnos`.
3. Configura el entorno:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Configura las **Environment Variables** añadiendo `VITE_API_URL` apuntando a la URL que te dio Render (ej. `https://rdf-backend.onrender.com`). *(Recuerda actualizar tu código de React para que use `import.meta.env.VITE_API_URL` en lugar de localhost).*
5. Haz clic en **Deploy**.

---

## 5. Módulo de IA (Assistant Les Rois)
El chatbot funciona mediante un patrón de **Inyección de Contexto**. 
1. El usuario envía un mensaje desde React.
2. NestJS (`AiService`) recibe el mensaje y hace un query a la BD buscando el nombre, nivel y próxima clase del usuario.
3. NestJS inyecta estos datos dentro de un `System Prompt` oculto y envía todo al modelo `gpt-4o-mini` vía la SDK de OpenAI.
4. El LLM devuelve una respuesta en el tono corporativo basándose *únicamente* en los datos inyectados, evitando alucinaciones sobre clases inexistentes.
