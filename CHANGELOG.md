# CHANGELOG - Portal Les Rois du Français 🥐🇫🇷

Todos los cambios notables realizados en el proyecto se documentan en este archivo.

## [2026-09-25] - Landing Page v3.5.16: Inscripción Gratuita, Tarifas Part Duo, Contacto y Conclusión del Método MRAF

### 🏷️ 1. Distintivo de Inscripción 100% Gratuita (#precios)
- **Badge Superior Unificado:** Incorporada franja horizontal (`.lrd-pricing-free-enrollment-banner`) entre las pestañas y el inicio de las tarjetas de precios con icono SVG `BadgeCheck` dorado, texto principal `INSCRIPCIÓN 100% GRATUITA` y texto secundario `Sin cuota de inscripción al comenzar.`.
- **Barra de Garantía:** Reemplazado *«Sin costos de inscripción ocultos»* por *«Inscripción 100% gratuita»* con `ShieldCheck` dorado, eliminando duplicidades y unificando el mensaje comercial.

### 👥 2. Tarifas y Cuadrícula Interactiva 2x2 en Modalidad Part Duo (#precios)
- **4 Tarifas Oficiales Configuradas:**
  - 1 clase/semana: `$2,000` MXN/mes (4 clases al mes).
  - 2 clases/semana: `$3,500` MXN/mes (8 clases al mes) — *Seleccionada por defecto*.
  - 3 clases/semana: `$5,240` MXN/mes (12 clases al mes).
  - 5 clases/semana: `$9,000` MXN/mes (20 clases al mes).
- **Interactividad y CTA Dinámico:** Hook de estado reactivo `selectedDuoRate`, selección unitaria con borde dorado y badge «Seleccionado». Botón reactivo `COTIZAR PLAN PART DUO · X CLASES/SEM` con prefijo `✓` y apertura de modal con el plan exacto.
- **Simetría 1:1:** Nivelación geométrica del contenedor a `grid-template-columns: repeat(2, 1fr)` en escritorio.

### 📍 3. Funcionalidad de Desplazamiento Suave en Enlace «Contacto» (#contacto)
- **Anchor ID de Destino:** Asignado `id="contacto"` al contenedor principal del pie de página (`<footer className="lrd-footer-dark-new" id="contacto">`), conectando directamente con la columna CONTÁCTANOS y redes sociales.
- **Navegación Móvil y Desktop:** Controlador `handleNavAnchorClick` con auto-cierre del menú hamburguesa en móvil y desplazamiento suave nativo (`scrollIntoView({ behavior: 'smooth' })`).
- **Offset Global:** `scroll-margin-top: 80px` en secciones ancladas para compensar la barra superior.

### 🎯 4. Rango de Edad en el Método MRAF® (#metodo)
- **Píldora Centrada y Elegante:** `DESDE LOS 12 AÑOS · SIN LÍMITE DE EDAD` (`#001844`, peso 850) con icono SVG `Users` en dorado.
- **Respiro Visual:** Depuración de frases explicativas secundarias y aumento de margen vertical (`margin-top: 26px; margin-bottom: 42px;`), otorgando aire y evitando saturación entre el encabezado y las tarjetas.

### 💡 5. Conclusión del Método MRAF® y 3 Principios Fundamentales (#metodo)
- **Franja de Conclusión:** Bloque compacto `.lrd-mraf-conclusion-box` bajo las 4 tarjetas M/R/A/F con la introducción: *«Un método intuitivo donde aprendes francés usándolo: conversación, interacción y participación activa en cada clase.»*.
- **3 Principios:** **Conversación Real** (`MessageSquare` rojo), **Interacción Constante** (`MessageCircle` dorado) y **Participación Activa** (`Sparkles` dorado).
- **Responsivo:** 3 columnas horizontales en desktop y apiladas en móvil, preservando al 100% la imagen gráfica oficial del título de MRAF®.

---

## [2026-09-23] - Landing Page: Sección "Así Se Vive Una Clase en Vivo" (Video Real), Limpieza MRAF y Unificación Cromática

### 🎬 Nueva Sección: “ASÍ SE VIVE UNA CLASE EN VIVO” (Punto 6)
- **Ubicación Inmediata tras Profesores:** Conector visual y conceptual después de *«Conoce a nuestros profesores»*, ofreciendo evidencia tangible de la interacción profesor-alumno en el aula virtual.
- **Video Real de Clase en Vivo (`clase_real_prueba.mp4`):** Video vertical nativo de 25 segundos (360x640) escalado a `390px` en escritorio, con proporción 9:16 intacta, sin recortes agresivos ni deformaciones.
- **Overlay Interactivo Limpio:** Badge único superior **`CLASE REAL`** con `BadgeCheck`, botón inferior **`Mira una clase real`** con icono SVG `Play`, y reproducción con audio bajo demanda por el usuario.
- **3 Bloques Informativos de Beneficios Ligeros:**
  - `MessageCircle`: **CONVERSACIÓN REAL** — *«Practica francés desde el primer día.»*
  - `Video`: **INTERACCIÓN EN VIVO** — *«Pregunta, participa y recibe correcciones de tu profesor.»*
  - `UsersRound`: **GRUPOS REDUCIDOS** — *«Máximo 8 alumnos para una experiencia más cercana.»*
- **Cierre Centrado:** Frase elegante con rombos dorados: `Profesores reales ◆ Alumnos reales ◆ Francés en práctica.` (cero emojis).

### 🧹 Limpieza y Reequilibrio en Método MRAF®
- **Eliminación de Figuras de Personas:** Retirados los stickers recortados del príncipe (`prince_real_cutout.webp`) y la chica francesa (`girl_real_cutout.webp`) en las esquinas del grid.
- **Reequilibrio de Espaciado:** Reducción del margen inferior del grid de `75px` a `40px` y ajuste a `15px` en el CTA inferior para eliminar el hueco vacío.
- **Protagonismo Total a las 4 Tarjetas $M \cdot R \cdot A \cdot F$:** Manteniendo intactos los grabados arquitectónicos tenues del castillo y la reina.

### 🎨 Unificación Cromática y Nomenclatura en “CONOCE A NUESTROS PROFESORES” (Puntos 4 y 5)
- **Ajuste de Título:** Actualizado a *"CONOCE A NUESTROS PROFESORES"* con *"PROFESORES"* destacado en degradado rojo oficial.
- **Erradicación de Textos Grises:** Eliminados los tonos grises (`#475569`, `#64748B`, `#334155`), unificando subtítulo, procedencia, citas y barra de reaseguro en **Azul Marino Oficial (`#001844` y `#002664`)**.
- **Punto 4 en Espera de Material:** Píldoras `▶ Ver presentación` preparadas en las 3 fotos para vincular los videos reales de presentación en cuanto los entregue el cliente.

---

## [2026-09-22] - Landing Page: Maestros Reales Protagonistas, Limpieza de Distractores y Respaldos Locales

### 👑 Rediseño de Máximo Protagonismo y Humanización en Sección “NUESTROS MAESTROS REALES”
- **Grid de 3 Profesores Simultáneos en Escritorio:** Eliminación de tabs y carruseles; los 3 profesores nativos se presentan de forma inmediata en una misma fila (`grid-template-columns: repeat(3, 1fr)`).
- **Fotografías Reales de Alta Definición (55%–60% de la Tarjeta):** Integración y optimización a WebP de Jean-Luc, Sophie y Pierre en sus espacios de trabajo reales, con encuadre de plano medio cercano (`380px`, `center 15%`) y **cero disfraces ni coronas artificiales**.
- **Espacio Preparado para Video Real (`▶ Ver presentación`):** Píldora frosted glass discreta y no interactiva para conectar futuros clips reales cuando los profesores los graben. Se retiró la prueba con video de IA y se eliminó limpiamente todo el modal, reproductor y estilos asociados.
- **Cabecera Simplificada y Humanizada:** Título *"NUESTROS MAESTROS REALES"* con frases breves y sin párrafos redundantes ni hashtags.
- **Jerarquía y Tarjetas Humanas:** Foto → Nombre en Playfair Display → Condición nativa y procedencia confirmada (París, Lyon, Burdeos) → Especialidad confirmada (`CONVERSACIÓN Y FLUIDEZ`, `CULTURA Y VIDA COTIDIANA`, `ESTRUCTURA Y PRÁCTICA ORAL`) → Presentación breve de máx 2 líneas.
- **Franja de Confianza Vectorial:** 3 diferenciales confirmados con iconografía vectorial SVG nativa (100% Nativos de Francia con escudo tricolor, Máximo 8 alumnos por grupo y Rotación real de acentos con ondas acústicas).
- **Depuración de Emojis y Stickers de la Semana:** Limpieza de stickers y emojis genéricos en la escala de niveles y gráficos secundarios de beneficios.
- **Respaldos Locales Integrales:** Guardadas versiones en `backups_landing/pre_semana_modificaciones/` y `backups_landing/version_actual_semana/`, más rama git local `backup/landing-pre-semana` (sin push remoto).

---

## [2026-09-09] - Persistencia y Visualización Resiliente de Fecha de Inicio en Gestión de Grupos (Supabase-First)

### 🛡️ Resiliencia Supabase-First y Sincronización Dual en Gestión de Grupos (`/admin/groups`)
- **Carga Híbrida Supabase-First (~50ms):** Enriquecimiento automático en tiempo real de cada grupo consultando directamente la tabla `Level` de Supabase en paralelo con la API backend. Garantiza que las fechas reales de inicio (`startDate`) registradas en base de datos se muestren siempre en la tabla principal (`DD/MM/YYYY`) sin depender de la serialización del backend remoto ni mostrar `—`.
- **Prellenado Confiable en Edición de Grupo:** Al pulsar el botón "Editar", el selector de fecha (`<input type="date">`) se inicializa automáticamente con la fecha de inicio del grupo (`YYYY-MM-DD`), previniendo campos vacíos.
- **Persistencia Dual Resiliente (`handleSubmit`):** Al editar o registrar un grupo, la fecha de inicio se actualiza de inmediato directamente en Supabase y de manera concurrente en el backend remoto, previniendo descartes por desincronizaciones de versión.
- **Actualización Optimista de Estado Local:** El estado en React se actualiza en 0ms al guardar, eliminando parpadeos, estados intermedios y reversiones visuales en la tabla de grupos activos.
- **Sincronización con Programación de Clases (`/admin/schedule`):** Enriquecimiento de la lista de niveles en `ScheduleManager` para asegurar que el calendario y la creación recurrente tomen automáticamente la fecha de inicio del grupo.

---

## [2026-09-08 v2] - Persistencia Resiliente de Fotos en Portal Administrador & Carga Supabase-First

### 🛡️ Resiliencia y Cero Parpadeo de Fábrica en Portal Administrador (`/admin/settings`)
- **Carga Supabase-First Asíncrona (~50ms):** Prioridad directa de lectura contra Supabase table `AppSettings`, desacoplándose de endpoints locales de backend y evitando cancelaciones o timeouts en despliegues Vercel.
- **Caché Síncrono 0ms en localStorage (`rdf_saved_settings_cache`):** Inicialización inmediata al montar el componente, garantizando que al recargar la página o cambiar de módulo administrativo jamás se "quite" la foto configurada ni se resetee a los valores de fábrica.
- **Memoria Permanente de Fotos Personalizadas (`customTeacherImages`, `customHeroImages`, `customLevelImages`):** Las fotos subidas por el usuario quedan resguardadas en el almacenamiento del navegador de forma persistente.
- **Botones Inteligentes de Acción Dual:**
  - `🔄 Restaurar foto oficial de fábrica`: Permite regresar a la foto original oficial en cualquier momento.
  - `↩️ Volver a tu foto personalizada`: Si se restauró la foto oficial, el sistema recuerda la foto subida y ofrece un botón morado para volver a ella con 1 solo clic.
  - `↩️ Deshacer cambio`: Revierte el cambio inmediato.
- **Sincronización en Tiempo Real Inter-Pestañas:** Integración de escuchadores `storage` y `focus` para replicar cambios al instante en cualquier ventana o pestaña abierta del portal o la Landing Page.

---

## [2026-09-08] - Módulo de Configuración Landing Page, Responsividad Móvil del Portal & Optimización de Carga

### ⚙️ Módulo Administrador: Configuración Integral de la Landing Page (`/admin/settings`)
- **Gestión Visual Completa:** Pestañas interactivas para configurar Hero Slideshow (4 diapositivas), Profesores Reales (3 perfiles) y Niveles Académicos (A1 a B2) con vista previa idéntica a la Landing Page.
- **Subida de Archivos desde PC:** Selector de archivos local para subir imágenes directamente desde Windows/PC (`/admin/upload-image`), guardándose en WebP optimizado.
- **Sistema de Seguridad y Deshacer:** Soporte de `Ctrl + Z`, botón para descartar cambios y botones ámbar para restaurar imágenes oficiales de fábrica en 1 clic.
- **Sincronización en Tiempo Real:** Comunicación inter-pestañas mediante eventos de `storage` y `focus`, refrescando la Landing Page instantáneamente sin recargar manualmente.
- **Persistencia en Supabase:** Almacenamiento singleton en el modelo `AppSettings` con endpoint público `GET /landing-config`.

### 📱 Responsividad Móvil y Tablet en Todo el Portal
- **Cabecera y Menú Lateral Deslizable:** Implementación de encabezado móvil con botón hamburguesa (`Menu`) y cajón deslizable (*Slide-Over Drawer* con botón `X`) en `AdminLayout`, `TeacherLayout`, `Layout` y `Sidebar`.
- **Adaptabilidad de Pantalla:** Contenedores fluidos con márgenes responsivos (`p-4 sm:p-6 md:p-8`) que impiden desbordamientos horizontales en teléfonos y tablets.

### ⚡ Optimización Extrema de Rendimiento de Imágenes
- **Lazy Loading Asíncrono en 64 Imágenes:** Inclusión de `loading="lazy"` y `decoding="async"` en todas las imágenes debajo del Hero, bajando la transferencia inicial de 4.4 MB a < 160 KB.
- **Preload Scanner en `<head>`:** Precarga anticipada de assets clave del Hero (`chateau_sunset_bg.webp`, `rey.webp`, `logo_official.webp`).
- **Compresión WebP en Cliente:** Redimensionamiento automático a máx 1200px y codificación WebP al 85% en el navegador antes del envío al servidor.
- **Caché Inmutable en Vercel CDN:** Cabeceras `Cache-Control: public, max-age=31536000, immutable` para `/imagenes-lp/` y `/assets/`.

### 👑 Hero Section: Slideshow Continuo con 4 Personajes Reales
- **Rotación Fluida:** 4 personajes oficiales (`rey.webp`, `hero_slide_1.webp`, `hero_slide_2.webp`, `hero_slide_3.webp`) ciclan cada 5s con transición cross-fade lenta de 1.6s sin saltos de maquetación ni recargas.

### 📚 Escala de 6 Niveles Académicos Reales (`A1, A2, A2+, B1, B1+, B2`)
- **Textos Institucionales:** Se incorporaron los 6 niveles y las descripciones pedagógicas de la institución.
- **Tarjeta Azul Compacta (-45% Altura):** Sistema de pestañas interactivas tipo píldora (`🎯 4 Competencias Clave` y `📖 Enfoque del Nivel`) para mantener la tarjeta armónica y evitar desbordamiento vertical.

### 🎨 Personaje Único por Nivel & Pulido Visual Quirúrgico
- **6 Personajes Adaptados:** A1 (alumna con laptop y libros), A2 (alumno con sudadera azul y cuaderno), A2+ (alumna con corona y sudadera roja), B1 (alumno con corona y celular), B1+ (señor alegre con playera blanca y paliacate rojo), B2 (profesor francés en playera marinera).
- **Ajustes de Escala y Composición:**
  - Nivel A1: Agrandada al +18% (`scale: 1.18`) con contenedor de 480px.
  - Nivel A2: Removida la línea vertical oscura en su costado y escalado al +15% (`scale: 1.15`).
  - Nivel A2+: Reposicionada verticalmente (`margin-bottom: -46px`, `translate: 0 16px`) para emerger de la base como si estuviera sentada en el borde.
  - Nivel B1+: Recuperada al 100% su playera blanca original mediante gradiente cromático, centrado y escalado al +14% (`scale: 1.14`).
- **Limpieza Método MRAF:** Retirada la flecha azul curvada y centrado simétricamente el botón rojo *"QUIERO PROBAR EL MÉTODO 👑"*.

---

## [2026-09-01] - Módulo Administrador: CRM Prospectos & Grupos Activos

### 🚀 Tarea 1: Módulo CRM / Prospectos (Paso 1) - COMPLETADO
- **Vista Centralizada de Tabla**: Agregada pestaña "Vista Tabla" en `CRMManager.tsx` con búsqueda rápida, filtro por estado (`NUEVO`, `CONTACTADO`, `CLASE_MUESTRA`, `INSCRITO`, `PERDIDO`), paginación (10 prospectos por página) y enlace directo a WhatsApp.
- **Logos Vectoriales Oficiales**: Sustituidos los emojis estándar por íconos SVG HD oficiales de marca para todos los canales de origen (`Google Ads`, `Meta Ads`, `Instagram`, `Facebook`, `WhatsApp`, `Referido`, `Website`).
- **Selector de Canal Personalizado**: Reemplazado el HTML select tradicional en el formulario del modal de prospectos por un desplegable visual con logos de marca.

---

## [2026-09-01] - Módulo de Grupos (Paso 2) - COMPLETADO
- **Columna Fecha de Inicio**: Agregada columna "Fecha de Inicio" en la tabla de Grupos Activos con formato `DD/MM/YYYY`.
- **Panel Lateral Deslizante (*Slide-Over Drawer Modal*)**:
  - Al hacer clic en `Ver Alumnos (X)` o en el nombre del grupo, se despliega un panel lateral desde la derecha.
  - Consulta en tiempo real los alumnos asignados al grupo desde la API `/admin/users`.
  - Muestra tarjetas individuales con los **4 datos clave del alumno**:
    1. 👤 **Nombre Completo** (con Avatar de iniciales)
    2. ✉️ **Correo Electrónico**
    3. 🏷️ **Estado de Inscripción** (*Activo / Inscrito ✅* o *Inactivo ❌*)
    4. 🗓️ **Fecha de Inscripción**
  - Incluye botón directo `💬 Contactar por WhatsApp`.
  - **Cierre Interactivo**: Se puede cerrar mediante la cruz `X`, el botón "Cerrar Panel" o haciendo clic en el área oscura de fondo (*backdrop*).
- **Validación de 5 Campos Obligatorios**:
  - `Nombre del Grupo` (*)
  - `Fecha de Inicio` (*)
  - `Profesor Asignado` (*)
  - `Horario` (*)
  - `Enlace / Host de Zoom` (*)
  - El sistema bloquea el envío y despliega una alerta explicativa en caso de faltar cualquiera de los 5 datos.

---

## [2026-09-02] - Módulo de Grupos: Buscadores Inteligentes & Ficha Detallada del Alumno

### 🔍 Buscador en Tiempo Real de Grupos Activos
- **Buscador Responsivo en Tabla**: Campo de búsqueda con ícono de lupa y botón para limpiar (`X`) que filtra en tiempo real por:
  - Nombre del grupo (`level.name`)
  - Código y nombre legible del nivel (`Básico 1`, `Intermedio`, `Avanzado`)
  - Nombre y apellido del profesor asignado
  - Modalidad y ritmo (`Grupal`, `Individual`, `Sabatino`, `Regular`, etc.)
  - Horario de clase
- **Contador Dinámico**: Badge que muestra el total de grupos encontrados.
- **Estado Vacío con Recuperación Rápida**: Si ningún grupo coincide con el criterio de búsqueda, se despliega un mensaje intuitivo con botón para restablecer la vista.

### 👥 Buscador de Alumnos en el Panel Lateral (Slide-Over)
- **Filtro Instantáneo de Alumnos**: Barra de búsqueda integrada en la cabecera del drawer que filtra por:
  - Nombre completo del alumno
  - Correo electrónico
  - Teléfono / WhatsApp
- **Contador de Alumnos**: Muestra en tiempo real la cantidad de alumnos que coinciden con la búsqueda.

### 🪪 Ficha Completa / Modal de Detalle del Alumno
- **Tarjetas Interactivas**: Las tarjetas de alumnos del drawer ahora son clickables (`cursor-pointer`) con efecto de iluminación (*glow*), indicador hover `Ver Ficha ➔` e indicación de clic.
- **Modal de Ficha del Alumno**: Al seleccionar a cualquier estudiante se despliega un modal centrado con diseño Real Francés (MRAF®) que incluye:
  - **Encabezado Premium**: Avatar con iniciales, nombre completo, insignia de rol (`🎓 Alumno`) y estado de inscripción (`Activo ✅` / `Inactivo ❌`).
  - **Información de Contacto**: Correo electrónico y Teléfono con botones interactivos de copiado rápido (`Copiar`).
  - **Información Académica**: Nombre del grupo asignado, nivel académico, profesor responsable, horario de clases y enlace directo a Zoom.
  - **Fecha de Registro**: Muestra la fecha exacta en formato formal (`DD de Mes de YYYY`).
  - **Acciones Rápidas en Footer**: Botones de contacto inmediato vía WhatsApp (`💬 WhatsApp`), envío directo de correo (`✉️ Enviar Correo`) y botón para cerrar ficha.

### ⚙️ Optimizaciones de Backend
- Actualizado `admin.service.ts` en `getUsers()` y `getLevelsWithModules()` para incluir la fecha de creación real (`createdAt`), datos de nivel y relación directa con usuarios.

---

## [2026-09-02] - Módulo de Programación de Clases: Series Recurrentes & Generación en Lote (Paso 3) - COMPLETADO

### 🔁 Programación Inteligente de Clases Recurrentes (`ScheduleManager.tsx`)
- **Selector de Modo Integrado**: Interruptor segmentado en la cabecera del formulario para alternar fácilmente entre:
  - 🔁 **Clases Recurrentes**: Programación en serie para cursos o módulos completos.
  - 📌 **Clase Única**: Para programación puntual de una clase individual o reposición.
- **Auto-Detección Inteligente por Grupo**:
  - Al seleccionar cualquier grupo en el desplegable, el sistema detecta de forma automática:
    - Preset de días de clase correspondiente (`L-Mi-V`, `M-J`, `Sabatino` o `L a V`).
    - Horario sugerido de inicio extraído del horario del grupo (ej. `10:00`, `11:00`, etc.).
    - Duración recomendada (`50 min` regular o `2h 50 min` sabatino).
    - Fecha de inicio oficial (`startDate`) pre-cargada.
    - Profesor responsable del grupo y enlace/cuenta de Zoom asignados.
- **Presets Rápidos de Días de Clase**:
  - ⚡ **`L-Mi-V`**: Lunes, Miércoles y Viernes (3x/semana - Regular 50m).
  - ⚡ **`M-J`**: Martes y Jueves (2x/semana - Regular).
  - ⚡ **`Sabatino`**: Sábado (1x/semana - 2h50).
  - ⚡ **`L a V`**: Lunes a Viernes (5x/semana - Intensivo).
  - ⚙️ **`Personalizado`**: Selector interactivo de botones individuales (`Lun`, `Mar`, `Mié`, `Jue`, `Vie`, `Sáb`, `Dom`) para armar cualquier combinación personalizada.
- **Reglas de Duración y Término de la Serie**:
  - **Por Semanas**: Presets de `4 semanas` (1 mes), `8 semanas` (2 meses), `12 semanas` (3 meses) y `16 semanas`.
  - **Por Total de Clases**: Presets de `12 clases`, `24 clases`, `36 clases` y `48 clases`.
  - **Por Fecha Límite**: Selector de fecha final de calendario.
- **Plantilla de Título Dinámico y Módulo**:
  - Soporte de variable `{n}` en el título (ej. `Clase {n}` genera `Clase 1`, `Clase 2`, etc.).
  - Asignación flexible a módulo/unidad (por defecto `Unidad 1`).
- **Previsualización Interactiva en Vivo (*Live Preview Card*)**:
  - Tarjeta de cálculo reactivo que indica el número exacto de sesiones a generar y el rango de fechas (`Del DD/Mes al DD/Mes`).
  - Lista interactiva desplegable con badge de número (`#1`, `#2`...), fecha formateada y horario.
  - **Exclusión de Días Feriados / Festivos**: Botón individual por sesión para excluir fechas inhábiles o vacaciones sin perder la correlación.
  - **Detección Automática de Conflictos de Agenda**: Marcador de alerta visual en tiempo real (`⚠️ Choque: Profesor ocupado` o `⚠️ Choque: Zoom ocupado`) si alguna fecha colisiona con clases previas.
- **Generación en Lote en Backend (`POST /admin/schedule/batch`)**:
  - Nuevo endpoint en `admin.controller.ts` y `admin.service.ts` que valida, resuelve módulos y enlaces de Zoom, y crea todas las clases de la serie en una sola transacción limpia.
  - Redirección automática a la vista de **Calendario** al completarse para visualizar la distribución semanal y mensual de las nuevas clases.
- **Eliminación en Lote de Clases (*Bulk Delete*)**:
  - Casillas de verificación integradas bajo demanda con botón **`Seleccionar`** en la cabecera (manteniendo la tabla limpia en modo estándar).
  - Botón interactivo **`🗑️ Eliminar todas`** con modal de confirmación seguro.
  - Endpoint dedicado `POST /admin/schedule/batch-delete` con eliminación en cascada para liberar la agenda limpia e instantáneamente.
- **Rediseño de Duración & Fecha Límite de Cobertura Obligatoria**:
  - Separación conceptual de cómo definir las clases:
    - **`⏱️ Por Tiempo (Meses)`**: Presets de `1 Mes (4 sem)`, `2 Meses (8 sem)`, `3 Meses (12 sem)`, `4 Meses (16 sem)`.
    - **`🎯 Por Paquete de Clases`**: Presets adaptados dinámicamente según el ritmo del grupo (ej. para Sabatino muestra `4 clases`, `8 clases`, `12 clases`; para L-M-V muestra `12 clases`, `24 clases`).
  - **`Fecha Límite para Cubrir Clases`**: Establecida como campo obligatorio independiente que define la vigencia máxima que tiene el grupo/alumno para completar o reponer sus sesiones.
  - **Auto-Cálculo Sugerido**: Sugiere en tiempo real la fecha de la última clase programada + 1 semana de tolerancia para reposiciones.
- **Alineación 1:1 con los Horarios Reales de la Escuela**:
  - **Presets de Días Oficiales**: Sustituido el botón *Mar - Jue* por el preset oficial **`Mié-Jue-Vie`** (3x/semana, días `[3, 4, 5]`), manteniendo `L-Mi-V`, `Sabatino` y `L a V`.
  - **Detección Automática de Grupos**: Identifica si el grupo es `L-Mi-V`, `Mié-Jue-Vie`, `Sabatino` o `Intensivo`.
  - **Selector de Horarios Sugeridos Oficiales**: Eliminado el molesto selector nativo de minutos que hacía girar rueda por rueda.
    - Para **Sabatino** (2h 50min): bloques oficiales `08:00 a 10:50`, `11:00 a 13:50`, `14:00 a 16:50`.
    - Para **Regular e Intensivo** (50 min): bloques oficiales `08:00 a 08:50`, `09:00 a 09:50`, ..., `21:00 a 21:50`.
    - Botón y opción **`⚙️ Ingreso manual`** para ingresar horas personalizadas cuando sea necesario.

## [2026-09-02] - Calendario de Alta Densidad, Horario Semanal VIP & Drag & Drop (Paso 4) - COMPLETADO

### 🗓️ Calendario de Alta Densidad & Prueba de Estrés (37 Clases Diarias)
  - **Selector de Densidad Visual**: Alternador rápido entre modo **`Estándar`** (tarjetas informativas amplias) y modo **`Alta Densidad`** (micro-chips optimizados para jornadas pesadas de 30-40 clases).
  - **Modo Interactivo de Prueba de Estrés (37 Clases Diarias)**: Botón `🧪 Simular 37 Clases` que genera en memoria la carga de una jornada real de la escuela distribuida de 08:00 a 22:00 con horas pico realistas (hasta 5 simultáneas a las 18:00 hrs) y nombres de grupos reales.
  - **Filtros Avanzados en Tiempo Real**: Menús desplegables para aislar la agenda por Profesor, por Grupo/Nivel (mostrando permanentemente **todos los grupos registrados en la escuela**, sin importar qué día esté seleccionado) y buscador por texto libre.
  - **Barra de Métricas & Timeline Interactivo de Concurrencia Horaria**:
    - Mini mapa de calor interactivo que desglosa las 14 horas del día (08:00 a 21:00) con la cantidad exacta de clases por bloque y resalta la hora pico (`🔥 5 simultáneas a las 18:00 hrs`).
    - Al hacer clic en cualquier bloque horario del timeline, se resalta y enfoca instantáneamente esa hora en la grilla.
  - **Visualización Inteligente de 2 o 5 Clases en el Mismo Horario**:
    - **5 Clases Concurrentes (Salones Diferentes)**: En la fila horaria (ej. 18:00 hrs), se despliegan en paralelo a través de las columnas de los profesores activos con sus salas de Zoom independientes (`Zoom Sala 1`, `Zoom Sala 2`...), sin estorbarse ni solaparse.
    - **2 Clases en el Mismo Profesor (Solapamiento)**: Tarjeta de colisión inteligente con alerta visual `⚠️ 2 clases asignadas a la misma hora` y división en sub-tarjetas limpias para que ninguna se encime sobre la otra.
  - **Tematización Francesa VIP por Nivel**:
    - A1: Azul Francia (`from-blue-700 to-indigo-800`).
    - A2: Cyan Océano (`from-sky-600 to-blue-700`).
    - B1: Dorado Real Francés (`from-[#D59B28] to-amber-700`).
    - B2: Verde Esmeralda (`from-emerald-600 to-teal-800`).
    - C1: Púrpura Imperial (`from-purple-700 to-indigo-900`).
  - **Selector Inteligente de Maestros con Disponibilidad en Tiempo Real**:
    - Al abrir una clase para editar o reasignar maestro, el desplegable evalúa en tiempo real quién está libre y quién está ocupado a esa hora exacta.
    - Los profesores disponibles aparecen destacados en el grupo superior: `🟢 PROFESORES DISPONIBLES A ESTA HORA`.
    - Los profesores que ya tienen otra clase a esa misma hora aparecen en el grupo inferior: `🔴 PROFESORES OCUPADOS A ESTA HORA`, mostrando con qué grupo o clase están ocupados (`Ocupado con Montpellier B1`, etc.).
    - Al reasignar el maestro o arrastrar la tarjeta (Drag & Drop), el calendario se actualiza reactivamente y la alerta de solapamiento desaparece.
  - **Programación Instantánea al Hacer Clic en "+ Disponible"**:
    - Las celdas vacías con `+ Disponible` en la grilla diaria y semanal ahora son botones activos con micro-interacción hover.
    - Al hacer clic en cualquier slot disponible se abre el modal **"Programar Nueva Clase"**:
      - Pre-asigna y fija automáticamente el profesor de esa columna, la fecha y la hora exacta en tarjetas bloqueadas (`🔒 Fijado`), eliminando la necesidad de volver a ingresar o ajustar esos datos manualmente.
      - Desplegable con los grupos de la escuela; al elegir un grupo, auto-completa el título sugerido, la duración (50 min o 2h 50min si es sabatino) y el enlace de Zoom.
  - **Corrección UI de Modales (Cierre por 'X' y Clic Exterior)**:
    - Se resolvió la interferencia de la capa luminosa decorativa que bloqueaba los clics sobre la 'X'.
  - **Enfoque Directo de Fila por Clic en la Hora de la Izquierda**:
    - Se eliminó la tira superior de 14 botones para dejar el encabezado más limpio, compacto y despejado.
    - Las celdas de la hora en la columna izquierda (`08:00`, `11:00`, `18:00`, etc.) ahora son botones interactivos: al hacer clic en cualquier hora, se resalta e ilumina suavemente toda la fila horizontal de esa hora con el **Dorado Real oficial `#D59B28`** y corona imperial, permitiendo inspeccionar todas las clases simultáneas de ese bloque con máxima elegancia sin perderse visualmente. Al hacer clic de nuevo, se desactiva el resalte.
  - **Arrastre Interactivo de Clases (Drag & Drop Fluido)**:
    - Se activó el arrastre en todas las tarjetas de clase (tanto en producción real como en la prueba de estrés).
    - Cada tarjeta cuenta ahora con el ícono de agarre `GripVertical` y cursor `cursor-grab / cursor-grabbing`.
    - Al arrastrar una clase sobre otra celda horaria o de profesor, el destino se ilumina en tiempo real con marco dorado punteado y aviso flotante (`📥 Soltar a las XX:00 con [Profesor]`).
    - Al soltar la clase, se actualiza automáticamente el horario y el profesor responsable en la base de datos (o simulación en memoria) con confirmación instantánea.
  - **Tematización Visual por Grupo/Nivel en Modo Estándar y Semanal**:
    - Se eliminó el fondo azul monocromático en las tarjetas de modo estándar y semanal.
    - Se adoptó la estética limpia y luminosa de la alta densidad: base blanca con borde de acento lateral (`border-l-[5px]`) del color característico de cada nivel.
    - Se incorporaron las insignias de color oficiales en la cabecera de la tarjeta (`Toulouse B1` en Dorado Real `#D59B28`, `Burdeos A1` en Azul Francés, `Niza A2` en Celeste, `París B2` en Esmeralda, `Lyon C1` en Púrpura).
    - Títulos y textos en slate oscuro de alta legibilidad y botones de Zoom armonizados con la paleta de cada grupo.
  - **Rediseño Total de la Vista Semanal (Agenda Ejecutiva Horas × 7 Días)**:
    - Se reemplazó la matriz plana por un **Horario Semanal Time-Grid de clase mundial** (formato Google Calendar / Apple Calendar de alta gama):
      - **Eje Horizontal (7 Días)**: Cabeceras con día abreviado en mayúsculas (`LUN`, `MAR`...), número del día grande, badge `Hoy` con iluminación azul, y contador de clases programadas para cada día. Al hacer clic en cualquier cabecera, se salta a la vista detallada de ese día.
      - **Eje Vertical (Horas de 08:00 a 21:00)**: Columna de hora interactiva con opción de resaltar franjas completas en Dorado Real `#D59B28`.
      - **Celdas Horarias Inteligentes con Control de Densidad**:
        - Cada celda muestra un máximo de 2 tarjetas compactas para mantener la grilla perfectamente alineada y evitar que la fila se estire verticalmente de forma desmedida.
        - Si un horario tiene 3 o más clases simultáneas, se despliega una pastilla dorada con corona imperial (`👑 +X clases más · Ver todas`) que al hacer clic abre el **Modal Flotante de Sesiones Simultáneas** con el desglose completo de todos los profesores, grupos y links de Zoom de ese bloque horario.
      - **Arrastre Multidimensional**: Permite arrastrar una clase de un día a otro y de una hora a otra con cálculo instantáneo del nuevo horario y persistencia.
      - **Selector de Modo en la Barra de Estado**: Botón para alternar entre `📅 Horario Semanal (Horas × Días)` y `👨‍🏫 Por Profesor`.
  - **Estandarización Cromática Institucional (Azul Les Rois du Français `#1D3A8A`)**:
    - Se eliminaron los tonos azul marino oscuro/negro (`#0B193D`, `#001742`) de la cabecera del calendario y de los modales.
    - Se unificó toda la cabecera superior y modales con el **Azul Institucional Oficial `#1D3A8A`** en degradado refinado (`from-[#1D3A8A] via-[#1e40af] to-[#1D3A8A]`), armonizando al 100% con la barra lateral de navegación (Sidebar), botones y tipografías del portal.
    - Se calibraron los destellos decorativos con iluminación dorada (`#D59B28`) y blanca suave, eliminando halos rojos disonantes.
  - **Optimización $O(1)$**: Indexación con `Map` por `${hour}_${teacherId}` y `${dateStr}_${teacherId}` que reduce el tiempo de renderizado a 60 FPS sin retrasos de fotogramas.

---

## [2026-09-02] - Modal Ejecutivo de Detalle de Clase: Bitácora en Tiempo Real & Alumnos con WhatsApp (Paso 5) - COMPLETADO

### 📝 Panel Ejecutivo de Detalle de Clase (`ScheduleCalendar.tsx`)
- **Organización en 2 Pestañas MRAF®**:
  - **Pestaña 1: `📝 Sesión & Bitácora`**:
    - **Gestión Directa de Zoom**: Tarjeta interactiva con el enlace de la sala, botón `🚀 Entrar a la Sala` (apertura directa) y botón `📋 Copiar Enlace` (con copiado al portapapeles y feedback visual `¡Copiado!`).
    - **Edición de Datos de la Clase**: Título, Fecha, Horario y Maestro asignado con el semáforo en tiempo real de disponibilidad (`🟢 X libres` / `🔴 X ocupados`).
    - **Bitácora Oficial de la Sesión en Tiempo Real**: Área amplia de notas pedagógicas (`description`) para documentar temas vistos, vocabulario francés trabajado, tareas y observaciones del grupo.
  - **Pestaña 2: `👥 Alumnos del Grupo ({N} Alumnos)`**:
    - **Buscador en Vivo de Alumnos**: Filtrado por nombre, correo y teléfono en tiempo real.
    - **Ficha del Alumno**: Tarjetas individuales con avatar de iniciales, nombre completo, correo y teléfono.
    - **Botón Inteligente de WhatsApp & Resolución del Bug de Emojis (`??`)**:
      - **Enlace Directo sin Signos de Interrogación**: Los servidores de Meta/WhatsApp corrompen emojis de 4 bytes en URLs (`?text=`) convirtiéndolos en `??`. Se configuró el enlace directo con tipografía limpia y negritas nativas de WhatsApp (`*`), garantizando que se abra sin ningún signo de interrogación.
      - **Botón de Copiado con Emojis (`🥐`, `🇫🇷`, `✨`)**: Integrado tanto en la cabecera de la burbuja como en cada tarjeta de alumno un botón de copiado rápido al portapapeles con los emojis intactos para pegar con 100% de fidelidad.
- **Persistencia en Base de Datos**:
  - Endpoint `PATCH /admin/schedule/:id` actualizado para persistir el campo `description` (Bitácora).
  - Consulta `getScheduledClasses()` enriquecida para incluir la relación `users` del nivel asignado sin realizar peticiones redundantes.

---

## 🏆 Cierre de Sprint: Suite Completa del Administrador (Pasos 1 al 5) - 100% COMPLETADA

1. **Paso 1: CRM de Prospectos**: Vista de tabla administrativa, paginación, filtros de estado, apertura directa de WhatsApp y logos oficiales vectoriales (Meta, Google, etc.).
2. **Paso 2: Módulo de Grupos**: Fecha de inicio obligatoria, 5 validaciones indispensables y Slide-Over lateral de alumnos inscritos con WhatsApp.
3. **Paso 3: Calendario Base**: Vista mensual/semanal, persistencia en BD y asignación de profesores con semáforo de disponibilidad.
4. **Paso 4: Calendario de Alta Densidad VIP**: Time-Grid semanal estilo Google Calendar, Drag & Drop interactivo de clases, slots interactivos, pastillas doradas para simultáneas y unificación de color institucional (`#1D3A8A`).
5. **Paso 5: Modal Ejecutivo de Detalle de Clase**: 2 pestañas ejecutivas, gestión de Zoom (entrar y copiar), Bitácora oficial en tiempo real con persistencia en BD, buscador de alumnos del grupo y botón oficial de WhatsApp sin errores de emojis.

