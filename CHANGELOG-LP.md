# Changelog — Landing Page Les Rois du Français

Todos los cambios notables de la **Landing Page** de *Les Rois du Français* serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y se adhiere al [Versionado Semántico](https://semver.org/lang/es/).

## [3.5.20] — 2026-09-26

### Optimización Final de Carga, Rendimiento de Imágenes y Recursos Críticos
- **1. Saneamiento de Recursos Críticos y Preloads en `index.html`:**
  - Erradicados 7 preloads obsoletos e innecesarios (`rey.webp`, `french_guy_pointing.webp` y 5 imágenes de personajes de niveles) que congestionaban la red inicial con más de 1.2 MB de datos antes de pintar el Hero.
  - Restringidos los preloads exclusivamente a los 4 activos visuales del primer viewport:
    - `/imagenes-lp/chateau_sunset_bg.webp` (Fondo del castillo al atardecer)
    - `/imagenes-lp/logo_official.webp` (Logotipo oficial Les Rois du Français)
    - `/imagenes-lp/hero_slide_1.webp` (Ilustración principal de los príncipes)
    - `/imagenes-lp/hero_crown_red.webp` (Corona oficial del badge VIP)
- **2. Priorización de Red en el DOM (`LandingPage.tsx`):**
  - Incorporado `fetchPriority="high"` y `decoding="async"` al fondo del castillo, logotipo del header y corona del hero.
  - Implementado `fetchPriority={idx === 0 ? 'high' : 'low'}` y `loading={idx === 0 ? 'eager' : 'lazy'}` en el carrusel de personajes del Hero para garantizar renderizado instantáneo del primer slide sin competir con recursos secundarios.
  - Carga inmediata y anticipada (`loading="eager"`, `fetchPriority="high"`) en las tarjetas de profesores para Sophie y Pierre, evitando marcos vacíos o retrasos al desplazarse en pantallas táctiles y móviles.
  - Carga diferida nativa (`loading="lazy"` y `decoding="async"`) verificada y activa en todos los recursos decorativos e informativos debajo del primer viewport.
- **3. Integridad Visual y Cero Pérdida de Calidad:**
  - Conservación al 100% de la nitidez visual en rostros, miradas, textos, pantallas de laptops, portal académico y profesores.
  - Conservación absoluta de canales alfa y transparencias en todos los elementos recortados.
  - Cero alteración de dimensiones visuales, aspectos de forma ni sustitución de imágenes aprobadas.
- **4. Auditoría Automatizada y Control de Calidad:**
  - Inspección integral con Puppeteer: 0 imágenes rotas (`naturalWidth === 0`), 0 errores de consola y 0 solicitudes fallidas / 404s.
  - Build de producción (`npm run build`) validado con éxito total (`tsc -b && vite build` en 7.08s).

---

## [3.5.19] — 2026-09-26

### Optimización Responsive Integral para Tablet y Móvil (Escritorio, 1080px, 1024px, 768px, 480px, 375px)
- **1. Header, Navegación y Menú Drawer:**
  - Breakpoint del menú móvil ajustado de 899px a 1080px para tablet horizontal, erradicando desbordes laterales.
  - Corregido contraste del drawer móvil (eliminado texto blanco heredado sobre fondo blanco; enlaces con `#001844`, fondo `#F8FAFC` y borde `#E2E8F0`).
  - Ocultamiento estricto (`display: none !important`) del drawer inactivo en resoluciones <= 1080px para evitar coordenadas fantasma fuera de pantalla.
  - Padding superior del drawer ajustado a 72px para evitar cualquier interferencia táctil con el botón hamburguesa / cerrar.
  - Botón "MI CUENTA" en header adaptado dinámicamente (`.lrd-btn-header-account-pill`) para pantallas táctiles.
- **2. Hero Principal (#hero):**
  - Erradicado el espacio vacío excesivo de ~250-300px entre las viñetas ("Sin compromiso", "Grupos reducidos", "Clases en vivo") y la ilustración de los personajes reales en móvil y tablet.
  - En tablets (`<= 768px`) y móviles (`<= 480px`), la altura del contenedor se ajusta de forma orgánica (`min-height: unset; height: auto / 230px`), logrando que los príncipes queden perfectamente encuadrados y pegados con ritmo natural.
  - Botones "COMENZAR AHORA" y "VER VIDEO" con ancho táctil completo y altura mínima cómoda de 46px.
- **3. Sección del Método MRAF (#metodo):**
  - Cuadrícula de tarjetas M, R, A, F adaptada: 4 columnas en desktop, cuadrícula equilibrada 2x2 en tablet horizontal/vertical (`<= 992px`) y 1 columna en móvil (`<= 640px`).
  - Distintivo de edad ("DESDE LOS 12 AÑOS · SIN LÍMITE DE EDAD") con `max-width: 92vw` y envoltura defensiva para evitar cortes en pantallas muy estrechas.
  - Bloque conclusivo de los 3 principios (Conversación Real, Interacción Constante, Participación Activa) con tarjetas legibles y botones CTA de ancho táctil ideal.
- **4. Sección de Profesores (#profesores):**
  - Solucionada la carga diferida (`loading="lazy"` a `loading="eager"` con `fetchPriority="high"`) para que las fotografías de Sophie y Pierre nunca aparezcan como recuadros vacíos al desplazarse en móvil.
  - Altura del contenedor de foto con escalado fluido (`clamp(280px, 75vw, 360px)`) para evitar estiramientos o cortes en pantallas pequeñas.
  - Disposición en tablet: 2 columnas superiores y tercer profesor centrado con ancho simétrico; en móvil: 1 columna ordenada.
- **5. Portal Académico (#portal-alumno) y Clase Real (#clase-en-vivo):**
  - En móvil y tablet, la columna de texto utiliza `display: contents`, priorizando encabezado -> reproductor/mockup del portal -> lista de beneficios -> conclusión.
  - Marco del navegador con URL `portal.lesroisdufrancais.com` y distintivo "INCLUIDO CON TU EXPERIENCIA" nítidos y sin recortes.
- **6. Niveles (#cursos):**
  - En tablet vertical (`768px`), las 4 competencias se muestran en cuadrícula 2x2 en lugar de 1 sola columna forzada, reduciendo la altura de la tarjeta en ~160px.
  - Resuelto conflicto de especificidad CSS en imágenes de alumnos (`.lrd-french-guy-photo-wrap .lrd-french-guy-img`) para limitar la altura a 270px en tablet y 220px en móvil, eliminando el vacío azul debajo del sello dorado "Petit à petit".
  - Barra de niveles (A1 a B2-C1) con scroll horizontal táctil y touch targets mínimos de 44px.
- **7. Precios, Horarios y Modalidades (#precios):**
  - **Tablet Horizontal (861px - 1080px):** Erradicado el colapso prematuro a 1 columna. Sabatino, Regular e Intensivo se mantienen en 3 columnas elegantes y proporcionadas; Clases Particulares y Part Duo se despliegan en 2 columnas simétricas con tarjetas 1:1.
  - **Tablet Vertical y Móvil (<= 860px):** Apilado limpio en 1 columna centrada (`max-width: 520px`).
  - Identidad de color intacta: Sabatino = Azul marino (`#001844`), Regular = Dorado (`#D59B28`), Intensivo = Rojo (`#D92534`), Particulares = Rojo (`#D92534`), Part Duo = Dorado (`#D59B28`).
  - Opciones de horario y turnos (`.lrd-opt-pill`) con área táctil cómoda de mínimo 44px de alto para fácil pulsación con el pulgar.
  - Bloque DELF / DALF / TCF, banner multi-mes con descuentos interactivos (15%, 20%, 25%) y garantía de satisfacción 100% legibles sin solapamientos.
- **8. Testimonios (#testimonios), CTAs y Footer (#contacto):**
  - Testimonios en 3 columnas en tablet horizontal (`861px - 1080px`) y apilado fluido en 1 columna en <= 860px.
  - Footer con cuadrícula 2 columnas + newsletter en tablet, y columna única en móvil con formulario de ancho completo.
  - **Auditoría Puppeteer:** 0 desbordes horizontales (`hasOverflow: false`) en 1200px, 1024px, 768px, 480px y 375px.

---

## [3.5.18] — 2026-09-26

### Pulido y Redondeo Orgánico de Orillas de Imágenes de Niveles (#cursos)
- **1. Erradicación de Cortes Cuadrados en Bloques de Libros:**
  - En los niveles **A1, A2+, B1 y B2**, los recortes de origen presentaban esquinas rectas a 90° y líneas de corte vertical/horizontal en la pila de libros/cuadernos del lado izquierdo.
  - Se aplicó un modelado y esculpido orgánico con radio de curvatura suave (filete de 60px a 70px) en el ángulo inferior izquierdo de la pila de libros, transformando la esquina recta en una curvatura limpia y natural.
- **2. Suavizado y Antialiasing de Orillas:**
  - Incorporada transición alfa antialiasing de precisión (3.5px a 4px con función smoothstep cúbica) a lo largo de las orillas rectas donde se removió la mesa o el límite del lienzo.
  - La sombra dinámica CSS (`filter: drop-shadow(...)`) ahora envuelve armoniosamente la curva redondeada en lugar de proyectar una silueta rectangular o cuadrada sobre el fondo azul marino `#001b50`.
- **3. Conservación Total de Elementos y Nitidez:**
  - Preservados al 100% los estudiantes, laptops, pantallas, libreta, audífonos, tazas y estuches sin ningún tipo de desenfoque ni veladura.
  - Generados los formatos de producción optimizados en WebP y PNG (calidad 95) en `frontend/public/imagenes-lp/` con alias correspondientes y cache-buster actualizado (`?v=20260926_polished`).
- **4. Sin Modificaciones Estructurales:**
  - Intactos los textos, diseño, botones, colores y estructura de las tarjetas en todas las resoluciones (1920px, 1366px, 1024px y 390px móvil).

---

## [3.5.17] — 2026-09-26

### Restauración Definitiva de Fotografías de Niveles y Encuadre Responsivo (#cursos)
- **1. Sustitución Completa por las Versiones Nuevas Oficiales:**
  - **Nivel A1 (`niña de 12 años (2).png`):** Alumna con audífonos, libreta, estuche, libros y laptop completa con puertos y teclado sin ningún recorte.
  - **Nivel A2:** Preservado el estudiante con mochila y celular (`estudiante_sonriente_con_mochila_y_cuadernos.webp`).
  - **Nivel A2+ (`muchacha joven.png`):** Joven en chaqueta verde celebrando con laptop completa, pantalla, touchpad y libreta.
  - **Nivel B1 (`chico adulto.png`):** Alumno con camisa azul, taza de café, libreta y laptop completa en plano natural.
  - **Nivel B1+ (`profesora_remota_explicando_ante_su_portatil`):** Alumna adulta en clase remota con laptop completa, libreta y fondo transparente limpio sin bloque de mesa.
  - **Nivel B2 (`hombre mayor.png`):** Hombre adulto con lentes, libros de texto, libreta y laptop completa con puertos y teclado visibles.
  - **Nivel B2-C1 (`estudiante_conversacion_perfeccionamiento_b2_c1`):** Alumna en perfeccionamiento con libreta, AirPod y laptop completa sin cortes en lateral ni fondo.
- **2. Optimización y Generación de Formatos:**
  - Generadas versiones optimizadas en **WebP** y **PNG** de alta calidad (calidad 95) en `frontend/public/imagenes-lp/` y sus alias oficiales `level_char_*.webp`.
  - Añadido mecanismo de cache-busting en `LandingPage.tsx` (`?v=20260926`) para garantizar que ningún navegador retenga en memoria las versiones antiguas de baja resolución (819x1024).
- **3. Blindaje Responsivo y Separación Elegante de Bordes:**
  - Ajustado `.lrd-french-guy-photo-wrap` con `margin-bottom: 0` y `max-height: 365px` para garantizar que la imagen mantenga un colchón natural de separación respecto al borde inferior de la tarjeta (`padding-bottom: 32px`).
  - Erradicado cualquier desborde o recorte en resoluciones intermedias de laptops y tablets (1024px, 1280px, 1366px, 1920px y móviles).
  - Eliminado solapamiento entre la base de la laptop y el sticker flotante de *J'❤️ LE FRANÇAIS*.
- **4. Preservación Estricta:**
  - Intactos el diseño, textos, botones, colores y estructura de las tarjetas de nivel y del resto de la landing page.

---

## [3.5.16] — 2026-09-25

### Franja Informativa de Conclusión del Método MRAF®: 3 Principios Clave (#metodo)
- **1. Franja Compacta de Conclusión (`.lrd-mraf-conclusion-box`):**
  - Incorporado bloque conclusivo compacto y refinado justo debajo de las 4 tarjetas M / R / A / F y antes del bloque de cierre motivacional/CTA.
  - **Texto Introductorio:** *«Un método intuitivo donde aprendes francés usándolo: conversación, interacción y participación activa en cada clase.»* (`#001844` con `font-weight: 650`).
- **2. Los 3 Principios Fundamentales en Rejilla Responsiva:**
  - **Conversación Real:** Ícono SVG `MessageSquare` en acento rojo (`#D92534`) con descripción *«Hablas francés desde el primer día.»*.
  - **Interacción Constante:** Ícono SVG `MessageCircle` en acento dorado (`#D59B28`) con descripción *«Preguntas, respondes y recibes correcciones.»*.
  - **Participación Activa:** Ícono SVG `Sparkles` en acento dorado (`#D59B28`) con descripción *«Practicas, opinas y te involucras en cada sesión.»*.
- **3. Comportamiento y Estética:**
  - En desktop: disposición horizontal en 3 columnas compactas con hover suave y micro-elevación (`transform: translateY(-2px)`).
  - En móvil: apilamiento vertical ergonómico (`grid-template-columns: 1fr`).
  - Paleta: texto oficial en azul marino `#001844`, fondos blancos limpios y acentos sutiles en rojo y oro. Cero grises y cero emojis Unicode.
- **4. Preservación Absoluta:**
  - Intacta la imagen oficial del título del método, barra MRAF®, badge de edad «Desde los 12 años · Sin límite de edad», ilustraciones de fondo y resto de la landing.

---

## [3.5.15] — 2026-09-25

### Simplificación Visual y Apertura de Aire en Distintivo de Edad del Método (#metodo)
- **1. Depuración Minimalista:**
  - Eliminada la frase explicativa secundaria (*«Un método diseñado para adolescentes y adultos...»*) para dejar una estética más limpia, sobria y premium.
  - Conservado únicamente el badge central: `DESDE LOS 12 AÑOS · SIN LÍMITE DE EDAD` (`#001844`, peso 850) con su ícono SVG `Users` en acento dorado (`#D59B28`), borde dorado sutil y fondo blanco puro.
- **2. Espaciado y Ritmo Vertical Mejorado:**
  - Incrementado el aire visual superior con `margin-top: 26px` respecto a la barra ilustrada oficial de MRAF®.
  - Incrementado el aire visual inferior con `margin-bottom: 42px` respecto al inicio de las tarjetas interactivas M / R / A / F.
  - Erradicada la sensación de saturación visual, logrando que el badge respire con distinción y elegancia.
- **3. Preservación Integral:**
  - Sin alteraciones en títulos, tarjetas M-R-A-F, grabados e ilustraciones de fondo ni resto de secciones.

---

## [3.5.14] — 2026-09-25

### Distintivo Informativo de Rango de Edad en Método MRAF® (#metodo)
- **1. Integración en Encabezado del Método (`.lrd-mraf-age-badge-wrap`):**
  - Incorporado distintivo integrado bajo el título ilustrado oficial de MRAF® y antes de las 4 tarjetas interactivas M-R-A-F.
  - **Píldora Principal:** `DESDE LOS 12 AÑOS · SIN LÍMITE DE EDAD` (`#001844` con `font-weight: 850`), acompañada de ícono SVG `Users` en acento dorado (`#D59B28`), fondo blanco limpio (`#FFFFFF`), borde dorado sutil (`rgba(213, 155, 40, 0.45)`) y sombra suave.
  - **Frase Descriptiva:** Párrafo complementario centrado en azul marino oficial: *«Un método diseñado para adolescentes y adultos que quieren aprender francés de forma práctica y comunicativa.»* (`#001844` con `font-weight: 550`).
- **2. Adaptabilidad Responsive:**
  - En móviles, el distintivo se adapta de forma centrada (`.lrd-mraf-age-pill`) manteniendo una jerarquía visual armónica sin competir con las tarjetas.
- **3. Preservación Integral:**
  - Sin alteraciones en estructura del método, textos actuales, tarjetas M/R/A/F, imágenes, botones ni precios.

---

## [3.5.13] — 2026-09-25

### Corrección y Funcionalidad de Desplazamiento Suave en Enlace «Contacto» (#contacto)
- **1. Asignación de Anchor ID de Destino:**
  - Asignado `id="contacto"` al contenedor principal del pie de página (`<footer className="lrd-footer-dark-new" id="contacto">`), que contiene la columna oficial **CONTÁCTANOS** (teléfono/WhatsApp `222 343 7074`, correo `info@lesroisdufrancais.com`, ubicación `Clases 100% Online · Sede: Puebla, México` y redes sociales).
- **2. Navegación Fluida y Cierre Automático en Móvil:**
  - Implementada función controladora `handleNavAnchorClick(e, 'contacto')`:
    - En móvil: cierra de inmediato el menú lateral/desplegable (`setIsMobileMenuOpen(false)`).
    - Desplaza la ventana suavemente hacia `#contacto` (`element.scrollIntoView({ behavior: 'smooth' })`).
    - Actualiza el hash de navegación sin recargar la página ni abrir nuevas pestañas.
- **3. Compensación de Cabecera y Scroll Suave Global:**
  - Agregada regla global `html { scroll-behavior: smooth; }` en `LandingPage.css`.
  - Establecido `scroll-margin-top: 80px` para `#contacto` y resto de secciones ancladas para evitar que el encabezado tape el inicio del contenido.
- **4. Preservación Estricta:**
  - Sin alteraciones en diseño del header, textos, colores, botones adicionales, botón flotante de WhatsApp ni resto de secciones.

---

## [3.5.12] — 2026-09-25

### Actualización de Precios y Cuadrícula Interactiva 2x2 en Modalidad Part Duo (#precios)
- **1. Tarifas Oficiales de Modalidad Part Duo (2 Alumnos):**
  - Implementada cuadrícula 2x2 homogénea a Clases Particulares Individuales con las 4 opciones solicitadas:
    - **1 clase / semana:** `$2,000` MXN/mes (4 clases al mes).
    - **2 clases / semana:** `$3,500` MXN/mes (8 clases al mes) — *Seleccionada por defecto*.
    - **3 clases / semana:** `$5,240` MXN/mes (12 clases al mes).
    - **5 clases / semana:** `$9,000` MXN/mes (20 clases al mes).
- **2. Interactividad y Selección Unitaria Exclusiva:**
  - Integrado hook de estado reactivo `selectedDuoRate` (valores `1`, `2`, `3`, `5`).
  - Al seleccionar cualquier recuadro de tarifa:
    - Se aplica borde dorado oficial (`#D59B28`), fondo dorado sutil con iluminación (`rgba(213, 155, 40, 0.1)`) y badge superior «Seleccionado».
    - La opción previamente seleccionada retorna limpiamente a su estado neutro.
    - Se activa automáticamente la tarjeta Part Duo (`lrd-duo-active`).
- **3. Botón CTA Dinámico:**
  - Actualización reactiva del texto del botón con base en la frecuencia activa:
    - `COTIZAR PLAN PART DUO · 1 CLASE/SEM`
    - `COTIZAR PLAN PART DUO · 2 CLASES/SEM`
    - `COTIZAR PLAN PART DUO · 3 CLASES/SEM`
    - `COTIZAR PLAN PART DUO · 5 CLASES/SEM`
    - Con prefijo `✓` cuando la tarjeta se encuentra activa.
  - Apertura del modal de lead con origen dinámico (`Modalidad Part Duo (X clases/sem)`).
- **4. Armonía Geométrica y Estética Visual:**
  - Rebalanceo del contenedor `.lrd-private-pricing-container` a columnas simétricas `repeat(2, 1fr)` en escritorio para perfecta nivelación de ambas tarjetas.
  - Hover sutil en tono dorado para las cajas de tarifa de Part Duo.
- **5. Preservación Estricta:**
  - Intactos los precios de Particulares Individuales ($1,500, $2,500, $3,750, $6,500), Sabatino ($1,350), Regular ($1,490) e Intensivo ($2,550).
  - Intactos el bloque compartido DELF/DALF/TCF, el banner de inscripción 100% gratuita, horarios, viñetas de beneficios y resto de secciones.

---

## [3.5.11] — 2026-09-25

### Distintivo General de Inscripción 100% Gratuita en Precios (#precios)
- **1. Distintivo General Superior (`.lrd-pricing-free-enrollment-banner`):**
  - Incorporado distintivo horizontal unificado entre las pestañas de selección («Clases Grupales» / «Clases Particulares & Part Duo») y el inicio de las tarjetas de precios.
  - Visible y aplicable de forma global para toda la sección de precios independientemente de la pestaña activa.
  - Texto principal en tipografía Outfit y azul marino oficial: `INSCRIPCIÓN 100% GRATUITA` (`#001844` con `font-weight: 850`).
  - Separador dot dorado (`#D59B28`) y texto secundario explicativo: `Sin cuota de inscripción al comenzar.` (`#001844` con `font-weight: 550`).
  - Acabado estético premium: fondo blanco limpio (`#FFFFFF`), borde dorado sutil (`rgba(213, 155, 40, 0.45)`), sombra suave e ícono SVG profesional `BadgeCheck` en dorado realce (`#D59B28`).
  - Adaptabilidad responsive: en dispositivos móviles se distribuye de manera centrada y limpia sin saltos forzados de línea.
- **2. Barra Inferior de Confianza y Garantía (`.lrd-pricing-guarantee-bar`):**
  - Actualizado el ítem de inscripción de *«Sin costos de inscripción ocultos»* a *«Inscripción 100% gratuita»* con `ShieldCheck` en dorado para eliminar duplicaciones y unificar el mensaje en toda la landing.
- **3. Preservación Integral:**
  - Sin alteraciones en precios, promociones multi-mes, horarios, modalidades, beneficios, botones ni estructura de las tarjetas.

---

## [3.5.10] — 2026-09-25

### Especificación de Horarios en Modalidades Regular e Intensiva (Punto 12) (#precios)
- **1. Modalidad Regular («Franja Horaria»):**
  - Actualizadas las opciones de selección horaria al nuevo formato uniforme:
    - **Matutino:** `08:00 – 12:00 h`
    - **Vespertino:** `13:00 – 21:00 h` (reemplaza al anterior 16:00 – 21:00).
- **2. Modalidad Intensivo («Elige Turno»):**
  - Actualizadas las opciones de selección horaria con idéntico estándar visual:
    - **Matutino:** `08:00 – 12:00 h`
    - **Vespertino:** `13:00 – 21:00 h` (reemplaza al anterior 18:00 – 21:00).
- **3. Consistencia Visual y Arquitectura de Píldoras (.lrd-opt-pill-stacked):**
  - Implementada distribución apilada de alta legibilidad (`.lrd-opt-pill-stacked`, `.lrd-opt-pill-shift`, `.lrd-opt-pill-time`), mostrando el turno en negrita y la franja en tipografía clara y sin saltos incómodos de línea (`white-space: nowrap`).
  - Mantenidos los acentos cromáticos por modalidad: dorado (`#D59B28`) en Regular y rojo carmesí (`#D92534`) en Intensivo.
- **4. Preservación Estricta:**
  - Sin alteraciones en precios ($1,490 / $2,550), días de clase, número de sesiones por semana, beneficios, botones CTA, Modalidad Sabatino ni Clases Particulares.

---

## [3.5.9] — 2026-09-25

### Unificación Tipográfica a Azul Marino y Erradicación de Grises en Testimonios (#testimonios)
- **1. Testimonios de Alumnos (.lrd-testi-quote-text):**
  - Actualizado el color del texto de las citas de `#1E293B` (gris pizarra oscuro) a azul marino oficial `#001844`.
  - Incrementado el peso de la fuente a `font-weight: 600` (SemiBold en estilo cursiva) para erradicar cualquier desvanecimiento o apariencia grisácea producida por el subpixel antialiasing en pantallas de alta y baja densidad.
- **2. Subtítulos de Alumno y Nivel (.lrd-testi-level-sub):**
  - Ajustado de `#64748B` a `#001844` con `font-weight: 650`.
- **3. Barra Superior de Confianza y Calificación (.lrd-testi-trust-bar):**
  - Párrafo descriptivo (`.lrd-testi-trust-text`) unificado en `#001844` con `font-weight: 600` y `800` en `strong`.
  - Píldora de puntuación (`.lrd-testi-rating-label`) y borde sutil convertidos a `#001844` y `rgba(0, 24, 68, 0.14)`.
  - Separador dot (`.lrd-testi-trust-dot`) ajustado a tinte marino suave.
- **4. Indicadores de Carrusel y Elementos de Soporte (.lrd-dot-item, .lrd-pro-prefix-pill):**
  - Puntos inactivos del slider actualizados de gris neutro `#CBD5E1` a `rgba(0, 24, 68, 0.22)`.
  - Píldoras de prefijo y horarios residuales homologados al sistema `#001844`.
- **5. Preservación Estricta:**
  - Intactos los acentos dorados (`#D59B28`), rojos (`#D92534`), banderas por país (`flag_mx`, `flag_es`, `flag_ar`), sellos de agua decorativos y geometría responsive de tarjetas.

---

## [3.5.8] — 2026-09-25

### Actualización del Badge en Bloque de Exámenes Oficiales (#precios)
- **1. Ajuste de Texto en Badge Superior:**
  - Sustituido el texto del badge `.lrd-pexam-bar-tag` de *«BENEFICIO COMPARTIDO · PARTICULARES & PART DUO»* a *«DISPONIBLE EN CLASES PART»*.
  - Precisión de alcance comercial: aclara la disponibilidad del servicio dentro de la modalidad de Clases Particulares y Part Duo sin inducir a interpretaciones de inclusión automática no tarifada.
- **2. Preservación Integral:**
  - Mantenidos al 100% la posición compartida del bloque, título *«PREPARACIÓN PARA EXÁMENES OFICIALES»*, descripción, píldoras `DELF · DALF · TCF`, colores, padding, bordes y estilos responsive.

---

## [3.5.7] — 2026-09-25

### Corrección Integral de Tipografía Gris en Callout de Prueba, Clases Particulares y Subtítulo de Precios
- **1. Banner Callout «¿Aún tienes dudas sobre tu nivel o la metodología?» (Imagen 1):**
  - Título (`.lrd-trial-title`) y párrafo descriptivo (`.lrd-trial-desc`) unificados a azul marino oficial `#001844`.
  - Peso tipográfico incrementado a `font-weight: 550` (y `800` en `strong`) para erradicar cualquier efecto de antialiasing grisáceo o deslavado.
- **2. Sección «Clases Particulares & Part Duo» (Imagen 2):**
  - Textos descriptivos (`.lrd-private-desc`, `.lrd-duo-desc`, `.lrd-duo-banner-text`) consolidados en `#001844` con peso `550 / 650`.
  - Rejilla de tarifas: frecuencia (`.lrd-rate-freq`), precio numérico (`.lrd-rate-price`), sufijos y detalles (`.lrd-rate-detail`) homogeneizados en `#001844` con pesos de `600` a `900`.
  - Recuadros de tarifa inactivos (`.lrd-rate-box`): sustituido fondo y bordes grisáceos por fondo blanco limpio con borde marino sutil (`rgba(0, 24, 68, 0.16)`).
  - Viñetas de beneficios (`.lrd-private-features-list li`): texto en `#001844` con peso `550` e íconos check en `#001844`.
  - Bloque compartido de exámenes: título y descripción en `#001844` con peso `550 / 800`.
- **3. Subtítulo Superior de Precios bajo Subrayado Rojo (Imagen 3):**
  - Subtítulo *«Clases 100% en vivo por Zoom con profesores nativos de Francia...»* (`.lrd-pricing-subtitle`) y título (`.lrd-pricing-title`) actualizados a azul marino profundo `#001844` con `font-weight: 600`.
- **4. Modalidades Grupales y Profesores:**
  - Descripciones de ritmo (`.lrd-pcard-pace-clean`), sufijos de precio y beneficios de Sabatino, Regular e Intensivo alineados al azul marino nítido `#001844`.

---

## [3.5.6] — 2026-09-25

### Unificación y Consistencia de Color Tipográfico a Azul Marino Imperial (#profesores & #precios)
- **1. Sección de Modalidades / Planes (Sabatino, Regular, Intensivo):**
  - Homologación tipográfica al sistema de azul marino oficial (`#001844` para jerarquía principal y `#001b50` para textos de lectura/viñetas), con peso y contraste tipográfico definidos (`font-weight: 500 / 600 / 750`).
  - Eliminación de bordes, fondos y hovers en gris pizarra (`#E2E8F0`, `#CBD5E1`, `#F1F5F9`, `#F8FAFC`).
  - Sustitución de cajas de selectores de turnos/horarios y botones inactivos por acabados limpios con tintes sutiles azul marino y bordes refinados (`rgba(0, 24, 68, 0.12)`).
  - Íconos de verificación y reloj en Modalidad Sabatino actualizados al azul profundo `#001844`.
- **2. Sección de Profesores (Jean-Luc, Sophie, Pierre):**
  - Subtítulo humanizado ajustado al azul marino imperial (`#001b50` con `font-weight: 500`).
  - Metadatos de procedencia y condición nativa alineados a `#001b50` y `#001844` (preservando el rojo `#D92534` en la condición nativa y dorado en especialidad).
  - Cita/presentación personal en `#001844` con peso óptimo de lectura.
  - Marco y fondo técnico de las fotografías de profesores actualizados de gris frío (`#F1F5F9` / `#E2E8F0`) a azul marino profundo `#001844`.
- **3. Bloque Inferior de Beneficios debajo de Profesores:**
  - Títulos principales («100% Nativos de Francia», «Máximo 8 Alumnos por Grupo», «Rotación Real de Acentos») consolidados en `#001844` con peso `800`.
  - Subtítulos («Acentos reales de París, Lyon y Burdeos», «Atención cercana y corrección personalizada», «Entrena tu oído para la vida y los viajes») actualizados de `#002664` a `#001b50` con `font-weight: 600` para eliminar cualquier percepción de texto desvanecido o grisáceo.
  - Contenedor de beneficios elevado a fondo blanco limpio con borde azul marino sutil (`rgba(0, 24, 68, 0.12)`), erradicando el fondo grisáceo `#F8FAFC`.
- **4. Integridad del Diseño:**
  - Preservación estricta de acentos dorados (`#D59B28`), rojos (`#D92534`), jerarquías visuales, dimensiones, espaciados y distribución.

---

## [3.5.5] — 2026-09-25

### Reubicación de Exámenes Oficiales como Beneficio Compartido y Homologación de Botones (#precios)
- **1. Reubicación del Bloque «Preparación para Exámenes Oficiales»:**
  - Extraído de la tarjeta individual y colocado como **bloque compartido horizontal** directamente debajo de ambas tarjetas (*Clases Particulares Individuales* y *Modalidad Part Duo*).
  - Incluye tag explicativo: *«BENEFICIO COMPARTIDO · PARTICULARES & PART DUO»*.
  - Mantiene el título en Cinzel, descripción completa, icono vectorial `GraduationCap` en rojo oficial `#D92534` y badge pill dorado `DELF · DALF · TCF`.
  - Exclusivo de la pestaña de Clases Particulares (no aparece en las modalidades grupales).
  - Ambas tarjetas de Clases Particulares quedan perfectamente simétricas con 4 viñetas cada una.
- **2. Homologación de Botones de Clases Particulares y Part Duo (Estilo Botón Regular):**
  - Reemplazados los botones por la clase estándar `.lrd-btn-pcard-clean` (mismo tamaño, altura, border-radius, tipografía, transición y peso que el botón Regular).
  - **Estado Normal (inactivo):** Fondo claro (`#F8FAFC`), borde sutil (`#CBD5E1`) y texto azul marino (`#001b50`).
  - **Hover y Activo:**
    - *Clases Particulares:* Rojo oficial `#D92534`, texto blanco con check y sombra suave.
    - *Modalidad Part Duo:* Dorado oficial `#D59B28`, texto blanco con check y sombra suave.
  - Selección mutuamente excluyente con sincronización inmediata.
- **3. Integridad del Sistema:**
  - Botones de Sabatino, Regular e Intensivo, precios, horarios y demás módulos 100% preservados.

---

## [3.5.4] — 2026-09-25

### Unificación Cromática: Erradicación de Textos Grises por Azul Marino Imperial (#precios)
- **1. Sustitución Completa de Tipografía Gris a Azul Marino Oficial (`#001b50`):**
  - Subtítulo principal de la sección de precios: *«Clases 100% en vivo por Zoom con profesores nativos de Francia...»*.
  - Encabezados de categoría neutrales (`CURSO SABATINO`) y descripciones de ritmo de las 3 tarjetas de modalidades (*Sabatino*, *Regular*, *Intensivo*).
  - Sufijos de frecuencia monetaria (*«MXN / mes»*).
  - Títulos de selectores de horarios y opciones inactivas de turnos y días de clase (*«08:00 - 10:50»*, *«Mié - Jue - Vie»*, etc.).
  - Textos de viñetas de beneficios en todas las tarjetas grupales y particulares.
  - Descripciones y tarifas de *Clases Particulares* y *Part Duo*.
  - Subtítulos de testimonios, subtítulos del stepper de niveles y modal de confirmación.
- **2. Paleta Institucional Pura:**
  - Se consolida la tríada oficial: **Azul Marino Imperial (`#001b50`)**, **Dorado Royal (`#D59B28`)**, **Rojo Carmesí (`#D92534`)** y **Blanco (`#FFFFFF`)**, con 0% de textos grises residuales.

---

## [3.5.3] — 2026-09-25

### Refinamiento de Redacción y Destacado Visual Sutil en Clases Particulares (#precios)
- **1. Desduplicación de Redacción en Descripción Superior:**
  - Retirada la mención de "preparación DELF/DALF" del párrafo superior para evitar redundancia con el nuevo beneficio:
    *«1 alumno con profesor nativo exclusivo. El ritmo, objetivos (viajes, negocios) y horarios se adaptan 100% a tu disponibilidad.»*
- **2. Destacado Visual Sutil del Bloque de Exámenes Oficiales:**
  - Mayor respiración y espaciado vertical (`margin-top: 6px; margin-bottom: 2px; padding: 11px 13px;`).
  - Contenedor con tinte ultra-sutil (`background: rgba(0, 27, 80, 0.022); border: 1px solid rgba(0, 27, 80, 0.07); border-radius: 12px;`), sin sombras exageradas ni pesadez visual.
  - Preservados el icono `GraduationCap` en rojo oficial `#D92534` y la píldora dorada `DELF · DALF · TCF`.
- **3. Integridad del Sistema:**
  - Precios, planes, botones, Part Duo, horarios y demás secciones 100% inalterados.

---

## [3.5.2] — 2026-09-25

### Integración de Preparación para Exámenes Oficiales en Clases Particulares (#precios)
- **1. Nuevo Beneficio Académico en Clases Particulares Individuales:**
  - Incorporado el beneficio enfocado a certificaciones internacionales:
    *«Preparación para exámenes oficiales: Ejercicios prácticos y acompañamiento enfocados en DELF, DALF, TCF y otras certificaciones oficiales.»*
  - Icono SVG profesional `GraduationCap` en rojo carmesí `#D92534`, armónico con el resto de viñetas de la tarjeta.
- **2. Badge de Certificaciones Oficiales Disponibles:**
  - Píldora sutil con fondo dorado translúcido (`background: rgba(213, 155, 40, 0.08); border: 1px solid rgba(213, 155, 40, 0.32);`) y separadores dorados:
    `DELF · DALF · TCF`
  - Tipografía limpia en mayúsculas, sin logos de terceros, preservando la sobriedad y elegancia del diseño.
- **3. Integridad Total del Módulo:**
  - Precios, selector de turnos/frecuencia, botones CTA, modalidad Part Duo y clases grupales 100% inalterados.

---

## [3.5.1] — 2026-09-25

### Desvinculación de Referencia B1+ / B2-C1 y Limpieza Fina del Borde Inferior (#cursos)
- **1. Reemplazo de Imagen en B2-C1 por Nueva Alumna Exclusiva:**
  - Sustituida la imagen repetida en **B2-C1** por la nueva alumna provista por el cliente (`media_1790355074505.png`): joven sonriente de cabello castaño ondulado, collar dorado, saco beige, bolígrafo en mano derecha y mano izquierda gesticulando hacia su laptop en clase de perfeccionamiento.
  - Se mantiene al 100% la imagen original de **B1+** (`profesora_remota_explicando_ante_su_portatil`), asegurando que cada uno de los 7 niveles cuente con una fotografía única y diferenciada.
- **2. Erradicación de la Franja Rectangular de Mesa en B1+ y B2-C1:**
  - En **B1+**, se eliminó quirúrgicamente la franja marrón inferior sobrante que flotaba bajo la sombra de contacto, manteniendo el chasis de la laptop y la libreta íntegros y descansando de forma natural sobre el fondo azul marino `#001b50`.
  - En **B2-C1**, se removió el bloque rectangular de mesa de madera (80px de altura y 775px de ancho que cortaba plano a 930px), preservando la silueta completa del cuaderno, el teclado, el touchpad, la laptop y la sombra natural de contacto con anti-aliasing fino.
  - Proporciones, tamaño y posición de las personas rigurosamente preservadas (escala estandarizada a ~970px de altura efectiva y encuadre en lienzo 1122x1402).
- **3. Integridad del Sistema:**
  - Textos, tarjetas, botones CTA, navegación y demás secciones conservados al 100% sin modificaciones.

---

## [3.5.0] — 2026-09-24

### Actualización de Imágenes con Laptop Completa en Sección Niveles (#cursos) y Unificación de Acabado Inferior
- **Sustitución de las 6 Fotografías de Alumnos por Nuevas Versiones Mejor Encuadradas:**
  - **Nivel A1 (`niña de 12 años (2).png`):** Estudiante con audífonos, libreta, estuche y laptop completa sin recortes en la base.
  - **Nivel A2:** Preservado el estudiante con mochila y celular (sin laptop).
  - **Nivel A2+ (`muchacha joven.png`):** Joven en chaqueta verde celebrando con laptop completa, teclado, touchpad y libreta.
  - **Nivel B1 (`chico adulto.png`):** Alumno con camisa azul, taza de café, libreta y laptop completa en plano natural.
  - **Nivel B1+ (`señora.png`):** Alumna adulta en clase remota con laptop completa, libreta y recorte inferior limpio.
  - **Nivel B2 (`hombre mayor.png`):** Hombre adulto con lentes, libros de texto, libreta y laptop completa con puertos y teclado visibles.
  - **Nivel B2-C1 (`señora nivel c1.png`):** Alumna en perfeccionamiento con libreta, AirPod y laptop completa sin cortes en lateral ni fondo.
- **Ajuste de Consistencia Visual en Recorte Inferior (B1+ y B2-C1):**
  - Eliminada la franja/base rectangular sobrante de mesa de madera en la parte inferior de las imágenes de **B1+** y **B2-C1**.
  - Objetos (alumna, libreta y laptop) 100% íntegros y visibles, con sus sombras de contacto naturales preservadas.
  - El fondo transparente se extiende directamente hasta la base del cuaderno y laptop, logrando un acabado idéntico y homogéneo con los niveles A1, A2+, B1 y B2 sobre el fondo azul marino `#001b50`.
- **Optimización y Estandarización de Formatos:**
  - Todas las imágenes procesadas en **WebP** y **PNG** con compresión de alto rendimiento y transparencia alfa limpia.
  - Altura máxima unificada a `385px` y proporciones armónicas idénticas en todas las tarjetas (`A1`, `A2+`, `B1`, `B1+`, `B2`, `B2-C1`), garantizando altura de tarjeta constante (~482px–501px / 544px) sin desbordes.
- **Integridad Absoluta:**
  - Sin alteraciones en textos, colores, botones CTA, tabs, badges ni estructura general de la landing page.

---

## [3.4.9] — 2026-09-24

### Refinamiento Visual Final en Tarjeta B2-C1 (#cursos)
- **1. Encabezado Superior Más Limpio y Despejado:**
  - Título secundario acortado a: *«Perfeccionamiento • Conversación y certificación»*.
  - *«4 meses»* reubicado como información secundaria en un badge discreto (`.lrd-level-duration-pill`) con fondo translúcido y borde sutil, colocado de forma armónica en la misma línea para que el encabezado respire y no compita con el título principal.
- **2. Títulos de las 4 Competencias Pulidos (Sin Dos Puntos):**
  - Retirados los dos puntos (`:`) al final de cada título de competencia, manteniendo la tipografía en mayúsculas negritas con su descripción debajo y el layout en 2 columnas:
    - `CONVERSACIÓN AVANZADA` / *Debates y conversación sobre actualidad, cultura, estudios y trabajo.*
    - `FLUIDEZ Y PRECISIÓN` / *Mejora pronunciación, vocabulario y naturalidad al expresarte.*
    - `PREPARACIÓN PARA EXÁMENES` / *Ejercicios prácticos para DELF, DALF, TCF y certificaciones oficiales.*
    - `PRÁCTICA ORAL Y ESCRITA` / *Comprensión, expresión oral, escritura y simulaciones de examen.*
- **3. Microajuste de Encuadre en Fotografía (Resolución Completa de la Laptop) y Sticker:**
  - Reducción del ~4.7% en la fotografía de la alumna (`max-height: 368px`, `max-width: 415px`), manteniendo 100% sus proporciones y nitidez.
  - Desplazamiento de 14px adicionales a la izquierda (`transform: translate(-34px, -18px)`, dentro del rango 12px–18px) y margen inferior ajustado a `-12px`.
  - El borde lateral y la base de la laptop quedan holgadamente visibles con abundante fondo azul marino a la derecha y abajo, luciendo natural e integrado sin rozar los límites del card.
  - **Sticker «J'aime le français»:** Reubicado a `right: -20px`, eliminando el corte del contenedor lateral y mostrándose 100% nítido y completo.
- **Integridad del Sistema:**
  - Preservados al 100% el fondo azul marino, colores institucionales, badge circular, pestañas interactivas, CTA oficial y navegación del stepper.

---

## [3.4.8] — 2026-09-24

### Séptimo Nivel de Perfeccionamiento B2-C1 & Unificación del Sistema de Diseño (Punto 11)
- **Incorporación de B2-C1 en la Secuencia Oficial:**
  - Secuencia completa: `A1 → A2 → A2+ → B1 → B1+ → B2 → B2-C1` sin reemplazar B2. B2-C1 actúa como la culminación y etapa final de perfeccionamiento.
- **Navegación Stepper Superior Unificada:**
  - Séptimo botón `B2-C1 / Perfeccionamiento` con redimensionamiento armónico (`width: 124px`, padding `15px 6px`) en desktop y scroll horizontal fluido en móvil/tablet.
  - En estado inactivo, B2-C1 conserva exactamente el mismo estilo limpio que el resto de niveles (tarjeta blanca, borde sutil, textos en azul y gris slate), evitando estados mixtos o halos competidores.
  - Al seleccionarse, pasa a estado activo rojo carmesí con la corona dorada flotante oficial y los demás niveles pasan a inactivo.
- **Identidad Cromática y Proporciones Idénticas:**
  - **Misma Altura y Proporciones:** Card compactada a ~514px (en línea con A1 501px y A2 521px), erradicando el desfase de altura anterior.
  - **Badge Circular Oficial:** Fondo rojo `#D92534`, borde punteado blanco `border: 2px dashed #ffffff` y 3 estrellas doradas, idéntico al sistema visual general.
  - **Encabezado Superior Rojo:** *«Perfeccionamiento · Conversación y certificación · 4 meses»* con la clase estándar `lrd-level-subtag-red`.
  - **Título y Subtítulo:** *«Perfecciona tu francés.»* en serif blanco y *«Habla, argumenta y certifícate.»* en cursiva dorada a 1 línea.
  - **4 Competencias Clave Compactas (en 2 columnas):**
    1. *Conversación avanzada:* Debates y conversación sobre actualidad, cultura, estudios y trabajo.
    2. *Fluidez y precisión:* Mejora pronunciación, vocabulario y naturalidad al expresarte.
    3. *Preparación para exámenes:* Ejercicios prácticos para DELF, DALF, TCF y certificaciones oficiales.
    4. *Práctica oral y escrita:* Comprensión, expresión oral, escritura y simulaciones de examen.
  - **Enfoque del Nivel:** Texto conciso y equilibrado para alumnos con base sólida orientados a conversación avanzada y certificaciones oficiales.
  - **CTA:** `QUIERO PERFECCIONAR MI FRANCÉS` con el botón rojo oficial.
- **Visual Exclusivo B2-C1:**
  - Utilizada únicamente la nueva imagen enviada por el cliente (`estudiante_conversacion_perfeccionamiento_b2_c1.webp`), recortada en transparencia natural, encuadrada proporcionalmente a 385px de altura sin distorsiones ni fondos artificiales.

---

## [3.4.7] — 2026-09-24

### Valor Añadido & Beneficios Concretos del Portal del Alumno (Punto 10)
- **Frase Introductoria de Valor Añadido:**
  - Incorporada la frase de enlace antes del bloque de beneficios: *«Además de tus clases en vivo, tu portal te permite:»*, remarcando de forma directa y clara que la plataforma es una ventaja complementaria integral al servicio en directo.
- **Redacción Concreta y Práctica de los 3 Beneficios:**
  1. **TODO EN UN SOLO LUGAR:** *«Consulta tus clases, calendario y materiales desde un mismo portal.»*
  2. **SIGUE TU PROGRESO:** *«Visualiza tu avance, estadísticas y desempeño de forma clara.»*
  3. **RECURSOS SIEMPRE DISPONIBLES:** *«Accede a PDFs, videos y herramientas para seguir practicando.»*
- **Armonía Visual y Coherencia:**
  - Preservados los iconos vectoriales SVG profesionales Lucide en `#001b50` (`LayoutDashboard`, `TrendingUp`, `BookOpen`) sin emojis Unicode ni tarjetas sobrecargadas.
  - Adaptación móvil balanceada con orden de lectura natural y legibilidad inmediata.

---

## [3.4.6] — 2026-09-24

### Refinamiento Visual Premium en Portal del Alumno (#portal-alumno)
- **Ampliación Visual de la Plataforma (+8% a 10%):**
  - Contenedor de la sección extendido a `max-width: 1250px` y redistribución de columnas (`0.88fr` a `1.38fr`).
  - Ancho máximo del marco de navegador ampliado de `780px` a `820px`, otorgándole el protagonismo absoluto a la interfaz real del portal sin distorsiones ni recortes.
- **Párrafo Principal Conciso:**
  - Sintetizado a: *«Como alumno tendrás acceso a tu Portal Académico para consultar clases, materiales, progreso y recursos desde un mismo lugar.»*, aligerando la carga de lectura.
- **Despeje y Jerarquía en Barra de Navegador:**
  - Retirada la etiqueta redundante superior (*PORTAL DEL ALUMNO*), centrando la barra de dirección segura `portal.lesroisdufrancais.com`.
  - Priorizada la etiqueta flotante de alto valor `INCLUIDO CON TU EXPERIENCIA` con pulso verde en la esquina inferior del dashboard.
- **Mayor Contraste y Presencia en Frase de Cierre:**
  - La frase *«Tus clases, tu progreso y tus recursos, siempre contigo.»* ahora cuenta con mayor espacio superior (`margin-top: 18px`), barra lateral dorada reforzada de `3px solid #D59B28` y tipografía destacada (`font-weight: 700`, `font-size: 0.98rem`) en Azul Marino `#001b50`.
- **Generoso Espaciado Inferior hacia Niveles:**
  - Incrementado el padding inferior a `105px` (y `65px` en móvil) para que la sección respire de forma holgada y prestigiosa antes de *"Todos los niveles"*.

---

## [3.4.5] — 2026-09-24

### Ajuste de Ritmo Visual & Continuidad en Portal del Alumno (#portal-alumno)
- **Eliminación de Líneas Divisorias:**
  - Retirado el borde divisorio superior (`border-top`) de `.lrd-portal-section`, permitiendo una transición limpia y continua sobre fondo blanco entre el cierre de *"Así se vive una clase en vivo"* y el nuevo bloque del portal.
- **Optimización de Espaciado Vertical:**
  - Reducido el padding inferior de `.lrd-live-class-section` de `70px` a `25px` (y en móvil a `20px`).
  - Reducido el padding superior de `.lrd-portal-section` de `85px` a `15px` (y en móvil de `55px` a `18px`).
- **Unificación Cromática Total al Azul Oficial (#001b50) & Erradicación de Tonos Grises:**
  - Se eliminaron las opacidades (`opacity: 0.88` y `opacity: 0.92`) y colores atenuados que generaban un tono grisáceo (#526381) sobre fondo blanco.
  - Párrafo descriptivo, títulos de beneficios, descripciones y frase de cierre ahora utilizan el **Azul Marino Oficial (`#001b50`)** sólido de la marca con 100% de opacidad y legibilidad impecable.
  - Iconos vectoriales Lucide de cada beneficio sincronizados en `#001b50`.

---

## [3.4.4] — 2026-09-24

### Nueva Sección: Portal del Alumno — "Tu Espacio Digital" (Paso 9)
- **Ubicación Estratégica:** Insertada inmediatamente después de *"Así se vive una clase en vivo"* (`#clase-en-vivo`) y antes de *"Todos los niveles"* (`#cursos`), completando la narrativa del prospecto (*Quién enseña → Cómo se vive una clase → Qué herramientas digitales recibes → Qué nivel puedes estudiar*).
- **Captura Real del Portal Académico (Rol Alumno):**
  - Tomada directamente desde la interfaz del alumno en resolución retina (1540x920 @2x) con la cuenta demo de prueba `Andrea García` (`andrea@example.com`).
  - Muestra la barra lateral completa con módulos oficiales, el banner de bienvenida con grupo asignado (*Niza · Grupo 1*), profesor (*Jean-Luc · Nativo*), nivel actual (*A1 · Básico 1*), calendario interactivo de clases y widgets de estadísticas académicas (horas, videos, PDFs y score general).
  - Asistente virtual minimizado a un botón circular discreto para garantizar protagonismo total al dashboard limpio.
  - Optimizada a formato WebP de alta fidelidad: de 1.06 MB en PNG a solo **190 KB** (`portal_alumno_dashboard.webp`).
- **Diseño Editorial & Marco Estilo Navegador:**
  - Marco realista tipo ventana de navegador con botones de control tricolor (`#FF5F56`, `#FFBD2E`, `#27C93F`), barra de dirección segura (`portal.lesroisdufrancais.com`), badge superior dorado `PORTAL DEL ALUMNO` y etiqueta flotante inferior con pulso verde `INCLUIDO CON TU EXPERIENCIA`.
  - Columna izquierda con Eyebrow `TU ESPACIO DIGITAL`, titular de gran jerarquía con destaque en rojo Les Rois (`TODO EN UN SOLO LUGAR`), 3 beneficios ligeros con SVG de Lucide Icons (`LayoutDashboard`, `TrendingUp`, `BookOpen`) y frase de cierre sutil con acento dorado: *«Tus clases, tu progreso y tus recursos, siempre contigo.»*
  - Composición 100% responsiva: en escritorio 2 columnas con 58% de peso visual al navegador; en móvil reordenado automáticamente en secuencia vertical óptima (*Eyebrow → Título → Texto → Captura de portal a ancho completo → 3 Beneficios → Frase final*).
- **Corrección de Navegación del Alumno:**
  - Resuelto el bug donde los enlaces del sidebar (`/clases`, `/perfil`, `/progreso`, etc.) expulsaban a la landing page debido a rutas huérfanas sin el prefijo `/dashboard`. Actualizado [Sidebar.tsx](file:///c:/Users/Mariana/OneDrive/Desktop/MOVIDATCI/portalrdf_temp/frontend/src/components/layout/Sidebar.tsx) con las rutas correctas `/dashboard/...` y blindado con alias de redirección en [App.tsx](file:///c:/Users/Mariana/OneDrive/Desktop/MOVIDATCI/portalrdf_temp/frontend/src/App.tsx).

---

## [3.4.3] — 2026-09-24


### Reordenamiento de Rotación en el Hero & Unificación Cromática
- **Nuevo Orden de Secuencia en Hero Slideshow:**
  - **1ª Imagen (Carga Inicial Eager):** `hero_slide_3.webp` — Los dos jóvenes chocando el puño (comunica juventud, dinamismo y el concepto royal rebelde de la marca desde el primer segundo).
  - **2ª Imagen:** `rey.webp` — El personaje royal provisto por el cliente (hombre con uniforme rojo, lentes oscuros y estilo de realeza).
  - **3ª Imagen:** `hero_slide_1.webp` — La chica con corona y capa (reina).
  - **4ª Imagen:** `hero_slide_2.webp` — El hombre con corona sorprendido mirando el celular (rey divertido/tecnológico).
  - Secuencia visual cíclica: *Jóvenes → Personaje royal cliente → Reina → Rey divertido → Jóvenes*.
  - Sincronización completa en código (`LandingPage.tsx`, `landingDefaults.ts`, `SettingsManager.tsx`) y base de datos Supabase (`AppSettings.heroSlides`).
- **Unificación Cromática en 'Así Se Vive Una Clase en Vivo':**
  - Removido gradiente oscuro a tono vino/guinda (`#B01825`) en `.lrd-text-red-gradient` en favor del color sólido cálido oficial `#D92534` (`--lrd-red-main`), logrando cohesión total con el badge `CLASES REALES · 100% EN VIVO` y el resto de la landing.

---

## [3.4.2] — 2026-09-24


### Humanización y Autenticidad en Sección de Niveles (#cursos)
- **6 Nuevas Fotografías de Estudiantes y Profesora (Progresión Etaria y Pedagógica Natural):**
  - **A1 (Básico 1):** `estudiante_con_portatil_y_auriculares.webp` — Chica adolescente con audífonos blancos, laptop y cuaderno (inicio y descubrimiento).
  - **A2 (Básico 2):** `estudiante_sonriente_con_mochila_y_cuadernos.webp` — Chico adolescente con sudadera azul, mochila, cuadernos y celular (mayor confianza y participación).
  - **A2+ (Intermedio 1):** `estudiante_celebrando_frente_al_portatil.webp` — Joven con camisa verde, laptop y cuaderno (comienza a desenvolverse con soltura).
  - **B1 (Intermedio 2):** `joven_conversando_con_portatil_y_cuaderno.webp` — Joven adulto con camisa azul, laptop y libreta conversando durante la clase (autonomía y fluidez).
  - **B1+ (Avanzado 1):** `profesora_remota_explicando_ante_su_portatil.webp` — Mujer adulta con blazer beige, laptop y libreta en clase online (perfil profesional y dominio argumentativo).
  - **B2 (Avanzado 2):** `hombre_estudiando_con_portatil_y_libros.webp` — Hombre adulto con lentes, laptop, libros y libreta (perfil maduro, perfeccionamiento y maestría). Reemplaza y erradica por completo la imagen anterior del chico con boina/camiseta a rayas en BD y archivos estáticos.
- **Optimización WebP de Alta Fidelidad (-85% peso):** De archivos PNG de ~1 MB a WebP de 110–150 KB preservando el 100% de nitidez, canal alfa transparente y preloads síncronos a 0ms. Se conservaron los archivos PNG originales de alta resolución con nombres literales.
- **Calibración Visual y Encuadre Natural en CSS:**
  - Alineación al ras de la tarjeta azul (`margin-bottom: -32px`) para que los escritorios y bases de los personajes descansen de manera natural sobre el borde inferior.
  - Sombra suave y realista (`filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.28))`), erradicando sombras negras duras o recortes artificiales.
  - Eliminación de escalas y traslaciones forzadas heredadas de ilustraciones anteriores (`scale: 1.18`, etc.), manteniendo proporción limpia y fidedigna.
- **Sincronización Total con Portal Administrador:** Actualizados `DEFAULT_LEVELS` en `LandingPage.tsx`, `landingDefaults.ts` y presets de `SettingsManager.tsx`.

---

## [3.4.1] — 2026-09-23

### Limpieza y Enfoque en Sección Método MRAF®
- **Eliminación de Figuras Decorativas Artificiales:** Retiradas las dos imágenes recortadas de stock (`prince_real_cutout.webp` y `girl_real_cutout.webp`) ubicadas en las esquinas inferiores del grid de tarjetas.
- **Protagonismo a las 4 Tarjetas M · R · A · F:** Las tarjetas del método y su valor pedagógico quedan como el foco absoluto de atención.
- **Preservación de Grabados Arquitectónicos Tenues:** Se mantienen los fondos tenues ilustrados del castillo francés y la reina para resguardar la identidad visual elegante y el estilo francés.
- **Reequilibrio de Espaciado:** Reducción del margen inferior del grid a `40px` (desktop) y `15px` superior en el bloque de CTA, eliminando el hueco vacío y logrando una transición armónica hacia la sección de profesores y clases reales.

### Refinamiento Visual en Sección “ASÍ SE VIVE UNA CLASE EN VIVO”
- **Título Equilibrado:** Distribuido de manera natural en 2 líneas sin aislar palabras clave (`CLASE EN VIVO` con `white-space: nowrap` y tamaño tipográfico proporcional).
- **Mayor Protagonismo al Video:** Contenedor de video ampliado a `390px` en escritorio, manteniendo proporción nativa vertical 9:16 sin distorsión.
- **Simplificación de Badges:** Conservado únicamente `CLASE REAL` en la parte superior del reproductor y botón `Mira una clase real` inferior.
- **Beneficios Más Ligeros:** Eliminadas cajas pesadas; ahora se presentan como bloques limpios con iconos vectoriales SVG Lucide en tonos Azul Marino (#001844 y #002664).
- **Frase Final Elegante:** Centrada, con rombos dorados discretos (`◆`) en `#D59B28` sin emojis.

### Unificación Cromática en Sección “CONOCE A NUESTROS PROFESORES”
- **Eliminación Total de Textos Grises:** Se reemplazaron todos los textos grises (`#475569`, `#64748B`, `#334155`) por los azules marinos oficiales de la marca (`#001844` y `#002664`), aplicados en el subtítulo del encabezado, metadatos de ciudad/nativos, citas de presentación personal de cada profesor y descripciones de la barra de reaseguro.

---

## [3.4.0] — 2026-09-23

### Nueva Sección: “ASÍ SE VIVE UNA CLASE EN VIVO” (Evidencia Real y Experiencia)
- **Ubicación Estratégica:** Insertada inmediatamente después de la sección `CONOCE A NUESTROS PROFESORES`, respondiendo a la pregunta de cómo se vive la experiencia real en el aula online de Les Rois du Français.
- **Video Real Vertical de Clase Integrado:**
  - Archivo real de 25 segundos (`/videos/clase_real_prueba.mp4`, 360x640) montado en tarjeta con esquinas redondeadas (`28px`), borde fino azul marino/dorado y sombra flotante suave.
  - Reproductor controlado por el usuario (sin autoplay intrusivo con audio).
  - Overlay interactivo con badges: `CLASE REAL` (`BadgeCheck`), indicador pulsante `100% EN VIVO` (`Radio`) y botón central elegante `Mira una clase real` (`Play` en círculo limpio).
- **Columna Editorial & 3 Beneficios Ligeros con Iconos SVG Lucide:**
  - Eyebrow en rojo con línea horizontal: `CLASES REALES · 100% EN VIVO` con icono `Radio`.
  - Título principal de gran jerarquía: `ASÍ SE VIVE UNA CLASE EN VIVO EN LES ROIS DU FRANÇAIS` (con `CLASE EN VIVO` destacado en degradado rojo oficial).
  - Frase de concepto: *«No solo aprendes francés. Lo hablas.»*
  - Párrafo descriptivo: *«Clases 100% online y en vivo donde la conversación, la interacción y la participación forman parte de cada sesión.»*
  - 3 Beneficios con iconos vectoriales SVG de Lucide Icons en contenedor circular suave (`#F8FAFC`):
    - 💬 `MessageCircle`: **CONVERSACIÓN REAL** — *«Practica francés desde el primer día.»*
    - 📹 `Video`: **INTERACCIÓN EN VIVO** — *«Pregunta, participa y recibe correcciones de tu profesor.»*
    - 👥 `UsersRound`: **GRUPOS REDUCIDOS** — *«Máximo 8 alumnos para una experiencia más cercana.»*
- **Cierre Unificador con Separadores en Rombo Dorado:**
  - Franja centrada con micro-insignia tricolor francesa y la frase:  
    `Profesores reales  ◆  Alumnos reales  ◆  Francés en práctica.` (cero emojis).
- **Adaptación Responsiva:**
  - Escritorio: 2 columnas balanceadas (55% / 45%).
  - Tableta: Escala armónica y proporciones balanceadas.
  - Móvil: Reordenamiento vertical con `display: contents` (Eyebrow → Título → Subtítulo → **Video real protagonista** → 3 Beneficios → Cierre).

---

## [3.3.0] — 2026-09-22

### Rediseño de Máximo Protagonismo y Humanización en Sección “NUESTROS MAESTROS REALES”
- **Grid de 3 Profesores Simultáneos en Escritorio:** Eliminados tabs y carruseles. Los 3 profesores nativos se presentan de forma inmediata en una misma fila (`grid-template-columns: repeat(3, 1fr)`), permitiendo al visitante constatar la presencia del equipo humano detrás de Les Rois du Français.
- **Fotografías Reales con 55%–60% del Alto de la Tarjeta:**
  - Integradas y optimizadas a WebP las 3 fotografías reales proporcionadas:
    - **Prof. Jean-Luc** (`teacher_royal_jean_luc.webp`): En su escritorio con pizarra de estudio (*"On y arrive!"*), libros de gramática y laptop.
    - **Prof. Sophie** (`teacher_royal_sophie.webp`): Con suéter a rayas, libreta de notas, taza y bandera francesa de fondo.
    - **Prof. Pierre** (`teacher_royal_pierre.webp`): Con taza (*"Un café, une bonne conversation :)"*) y libros de fonética.
  - Altura del encuadre fotográfico calibrada a `380px` (`object-position: center 15%`), manteniendo rostros grandes, cercanos y nítidos.
  - **Cero disfraces, coronas falsas o accesorios artificiales sobre las fotos**, preservando la autenticidad y elegancia profesional.
- **Espacio Preparado para Video Real de Presentación:** Micro-píldora translúcida con efecto frosted glass en la esquina inferior de la foto (`▶ Ver presentación`), discreta y no interactiva (con tooltip *"Próximamente video de presentación"*), lista para conectar futuros clips grabados por los profesores reales. Se descartó la prueba con video de IA y se eliminó limpiamente todo el modal, reproductor y estilos asociados para mantener la máxima elegancia y autenticidad sin contenido simulado.
- **Cabecera Simplificada y Humanizada:**
  - Título: `CONOCE A NUESTROS PROFESORES` (con acento visual en degradado rojo oficial sobre `PROFESORES`).
  - Subtítulo 1: *"Profesores nativos que harán que el francés cobre vida."*
  - Subtítulo 2: *"Conoce a las personas que estarán contigo clase a clase."*
  - Eliminados hashtags, párrafos adicionales y elementos ruidosos.
- **Jerarquía de Tarjetas Simplificadas:**
  - Foto (55-60%) → Nombre en *Playfair Display* → Condición nativa y procedencia confirmada (*Profesor/a nativo/a de francés • París / Lyon / Burdeos*) → Badge sutil dorado de especialidad confirmada (`CONVERSACIÓN Y FLUIDEZ`, `CULTURA Y VIDA COTIDIANA`, `ESTRUCTURA Y PRÁCTICA ORAL`) → Presentación breve de máx 2 líneas (tono conversacional, no currículum).
- **Eliminación de Elementos Distractores:** Retiradas las insignias de *"Actitud Royal"*, *"Cero Aburrimiento"*, *"Savoir-Faire Royal"* y hashtags dentro de las tarjetas.
- **Franja de Reaseguro y Confianza Vectorial:**
  - 3 diferenciales oficiales del equipo con iconografía SVG nativa de alta fidelidad (cero emojis genéricos de sistema operativo):
    - 🛡️ *100% Nativos de Francia* (Escudo tricolor oficial de Francia en SVG).
    - 👥 *Máximo 8 Alumnos por Grupo* (Atención y corrección personalizada).
    - 🔊 *Rotación Real de Acentos* (Entrenamiento auditivo para viajes y situaciones reales).
- **Adaptación Responsiva Completa:**
  - Escritorio: 3 profesores en 1 sola fila.
  - Tableta (641px a 1024px): Disposición **2 + 1** con el 3er profesor elegantemente centrado en su propia fila.
  - Móvil (≤ 640px): 1 profesor por fila con tarjetas centradas y fotos grandes.

### Depuración y Limpieza de Emojis / Elementos Decorativos Solicitada Esta Semana
- Retirados rayitos, estrellas y corazones blancos sobre stickers de beneficios y método.
- Erradicación de emojis genéricos en la escala de niveles, dejando únicamente la corona dorada de identidad en el nivel seleccionado.
- Corona removida del título de maestros para un acabado tipográfico más limpio y sofisticado.

### Respaldos Locales Almacenados (Sin Push Remoto)
- Carpeta `backups_landing/pre_semana_modificaciones/` con las versiones originales previas a los cambios de la semana.
- Carpeta `backups_landing/version_actual_semana/` con el código actual completo.
- Rama local de seguridad `backup/landing-pre-semana`.

---

## [3.2.1] — 2026-09-08

### Persistencia Resiliente & Sincronización Supabase-First en Configuración de Landing Page
- **Arquitectura de Carga Supabase-First (~50ms):** El módulo de configuración administrativa (`/admin/settings`) ahora consulta directamente a la tabla singleton `AppSettings` en Supabase con máxima prioridad, eliminando cuelgues por llamadas a endpoints locales (`http://localhost:3000`) en despliegues sobre Vercel.
- **Caché Síncrono 0ms en localStorage (`rdf_saved_settings_cache`):** Inicialización de estados inmediata desde el almacenamiento local del navegador, erradicando cualquier parpadeo de imágenes de fábrica al recargar o navegar entre módulos del portal.
- **Memoria Permanente de Imágenes Personalizadas (`customTeacherImages`, `customHeroImages`, `customLevelImages`):** Conservación indefinida de las fotos subidas por el administrador en `localStorage`, evitando que se pierdan o sobreescriban al alternar entre opciones.
- **Botones Inteligentes de Acción Dual:**
  - `🔄 Restaurar foto oficial de fábrica`: Restablece el recurso original del profesor, diapositiva o nivel.
  - `↩️ Volver a tu foto personalizada`: Permite re-aplicar en 1 solo clic la foto personalizada previamente subida sin necesidad de volver a buscar el archivo en la computadora.
  - `↩️ Deshacer último cambio`: Reversión inmediata al estado anterior si se cometió una equivocación.
- **Sincronización Bidireccional en Tiempo Real:** Adición de escuchadores de eventos `storage` (`rdf_landing_config_updated`) y `focus` de ventana para sincronización simultánea entre pestañas abiertas.

---

## [3.2.0] — 2026-09-08

### Optimización Extrema de Carga de Imágenes (Carga Instantánea < 100ms)
- **Lazy Loading Nativo Asíncrono en 64 Imágenes:** Atributos `loading="lazy"` y `decoding="async"` implementados en todas las imágenes debajo del Hero, reduciendo el payload de entrada de 4.4 MB a menos de 160 KB.
- **Preload Scanner en `<head>`:** Precarga prioritaria de `chateau_sunset_bg.webp`, `rey.webp` y `logo_official.webp` en `frontend/index.html`.
- **Caché Inmutable en Vercel CDN:** Cabeceras `Cache-Control: public, max-age=31536000, immutable` para `/imagenes-lp/(.*)` y `/assets/(.*)`.
- **Compresor Automático en Cliente (`SettingsManager.tsx`):** Conversión automática a WebP al 85% de calidad y redimensión a máx 1200px en subidas desde PC.

### Hero Section: Carrusel Dinámico con 4 Personajes Reales (Cross-Fade VIP)
- **4 Personajes Reales en Rotación Continua:**
  - `rey.webp`: El Rey oficial de la escuela.
  - `hero_slide_1.webp`: Chica sonriente sosteniendo su corona real (*chica agarrandose la corona*).
  - `hero_slide_2.webp`: Chico sorprendido con celular y corona (*chico sonriente para el hero*).
  - `hero_slide_3.webp`: Dos chicos chocando puños con atuendo real (*dos chicos chocandola hero*).
- **Animación Cross-Fade Fluida:** Transición suave de 1.6 segundos con CSS Grid superpuesto, eliminando saltos o descuadres de layout.

### Escala Académica Oficial de 6 Niveles Reales (`A1, A2, A2+, B1, B1+, B2`)
- **Adaptación Exacta de Textos Institucionales:**
  - **A1:** Básico 1 – Fundamentos • 4 Meses (Alfabeto, hora, saludos y situaciones cotidianas).
  - **A2:** Básico 2 – Supervivencia y Rutina • 4 Meses (Presente, pasado, compras y viajes).
  - **A2+:** Intermedio 1 – Exploración y Fluidez • 4 Meses (Gramática profunda, relatos y proyectos).
  - **B1:** Intermedio 2 – Consolidación y Debate • 4 Meses (Debates, modismos y método MRAF).
  - **B1+:** Avanzado 1 – Argumentación y Dominio • 4 Meses (Roleplays, debates abstractos y fluidez oral).
  - **B2:** Avanzado 2 – Perfeccionamiento y Certificación • 4 Meses (Bilingüismo y maestría total).
- **Optimización de Tarjeta Azul (-45% de Altura):**
  - Implementación de pestañas internas interactivas (`🎯 4 Competencias Clave` / `📖 Enfoque del Nivel`) con estética de cristal y acento rojo carmesí.
  - Mantiene toda la información pedagógica oficial visible y accesible sin sobrecargar la altura vertical.

### Personaje Único y Exclusivo por cada Nivel con Refinamientos de Escala
- **Procesamiento y Limpieza de Falsos Fondos de Ajedrez a WebP:**
  - **Nivel A1:** Chica sonriendo con laptop y libros de francés (`level_char_a1.webp`). Recorte fino de márgenes vacíos y escalado al +18% (`scale: 1.18`, contenedor de 480px) para máxima presencia visual.
  - **Nivel A2:** Chico con sudadera azul y cuaderno (`level_char_a2.webp`). Eliminación quirúrgica de la línea vertical lateral del artefacto de origen (columnas 439-440) y escalado al +15% (`scale: 1.15`).
  - **Nivel A2+:** Chica sorprendida con sudadera roja y corona (`level_char_a2_plus.webp`). Calibración precisa (`margin-bottom: -24px`, `translate: 0 6px`, `max-height: 390px`) alineada a ras del marco inferior del cuadro azul.
  - **Nivel B1:** Chico con corona y celular (`level_char_b1.webp`). Restauración fiel de la playera interior visible bajo la sudadera roja a blanco puro y sólido (eliminando la transparencia que dejaba traslucir el azul de la tarjeta) y escalado al +8% (`scale: 1.08`).
  - **Nivel B1+:** Señor alegre con paliacate rojo (`level_char_b1_plus.webp`). Extracción y segmentación neuronal de alta fidelidad con BRIA RMBG 2.0, logrando una playera de algodón 100% blanca sólida, limpia y sin huecos ni artefactos negros/cebra, preservando el cabello rizado y su pañoleta roja con antialiasing natural.
  - **Nivel B2:** El icónico profesor de francés en playera marinera y boina roja (`french_guy_pointing.webp`).
- **Micro-animación de Entrada:** Cada personaje aparece con una transición de elevación y fade-in suave (`.lrd-character-fade-in`) al cambiar de nivel.

### Limpieza de Gráficos en Sección Método MRAF
- **Remoción de Flecha Azul:** Retirado el trazo curvado que bajaba hacia el botón debajo de *"Solo necesitas empezar"* tanto en `mraf_bottom_cta_hd.webp` como en su versión `.png`.
- **Botón Centrado:** Eliminado el desfase `padding-left: 40px` en `.lrd-cta-btn-arrow-row`, dejando el botón rojo *"QUIERO PROBAR EL MÉTODO 👑"* simétricamente centrado.

---

## [3.0.0] — 2026-09-04

### Optimización Masiva de Rendimiento Web (WebP de Alta Fidelidad & Preloads)
- **Compresión y Conversión Global a WebP (-88% de Carga):**
  - Diagnóstico de más de 50 imágenes rasterizadas que sumaban **23.97 MB**, ocasionando tiempos de carga lentos.
  - Conversión total a formato moderno `.webp` con compresión de alta fidelidad (quality 82).
  - Redimensión proporcional de imágenes sobredimensionadas (fondos ultra-pesados reducidos a 1920px).
  - **Reducción del payload global de 23.97 MB a 2.68 MB (-88.8% de ahorro de ancho de banda)**, permitiendo entrada y renderizado inmediato.
- **Preload de Recursos Críticos (`frontend/index.html`):**
  - Implementación de etiquetas `<link rel="preload" as="image" type="image/webp">` para los assets clave *above-the-fold* (`hero_bg_official.webp`, `hero_clean_versailles_king.webp` y `logo_official.svg`).

### Video Modal Cinema VIP (YouTube Embebido Sin Salir de la Página)
- **Reproductor Flotante Cinema (`LandingPage.tsx` & `LandingPage.css`):**
  - Al hacer clic en *"Ver Video"* o en el botón de reproducción de la clase muestra, se abre un **Modal Cinema inmersivo** (`backdrop-blur-md bg-black/85`).
  - Video oficial incorporado: `https://www.youtube.com/watch?v=T_uYP1uYkhE` con reproducción automática controlada e iframe seguro con `referrerPolicy="strict-origin-when-cross-origin"`.
- **Controles Intuitivos de Navegación:**
  - Botón de cierre en 'X' flotante y soporte para la tecla `Escape`.
  - Botón de pantalla completa para visualización extendida.
  - Botón interactivo para abrir el video en una pestaña externa nueva.

### Rediseño de Tarjetas de Precios 3D ("Royal & Chic")
- **Selección Activa Dinámica:**
  - Al presionar cualquier tarjeta de modalidad o plan, se resalta de forma activa e inmediata con borde dorado brillante (`#D59B28`), sombra 3D profunda y micro-elevación, reemplazando el estado predeterminado estático.
- **Armonización Tipográfica & Ajuste de Espaciado:**
  - Textos y titulares adaptados a **Azul Marino Imperial (`#001b50`)** y **Azul Real Institucional (`#1D3A8A`)** para perfecta sincronía visual con la paleta de la landing.
  - Encabezado y títulos elevados verticalmente para mejorar el balance de composición.
- **Ajuste Móvil y Responsivo:**
  - Optimización de márgenes y contenedor del modal para evitar que la 'X' o los bordes queden fuera de la pantalla en dispositivos móviles.

### Portal Administrador: Resiliencia en Clases Recurrentes & Sincronización
- **Fallback Inteligente en Creación y Borrado en Lote (`ScheduleManager.tsx`):**
  - Implementación de mecanismo de respaldo transparente: si el servidor backend responde 404 por demoras de despliegue en la nube al solicitar `/admin/schedule/batch` o `/admin/schedule/batch-delete`, el frontend ejecuta automáticamente la creación o eliminación de las clases de manera individual sin arrojar errores al usuario.
- **Endpoints Nativos en Backend (`admin.controller.ts` y `admin.service.ts`):**
  - Rutas `batchScheduleClasses` y `batchDeleteScheduledClasses` completamente integradas, compiladas y listas para despliegue productivo.

---

## [2.9.0] — 2026-09-04

### Sección Oficial de Precios, Horarios y Modalidades Reales ("Royal & Chic")
- **Integración de Tabla de Precios y Horarios (`#precios` y `#promos`):**
  - Implementación de la sección faltante para dar cumplimiento al 100% al checklist de entregables.
  - Conexión de anclas del Header Navbar: `PRECIOS Y HORARIOS` (`#precios`) y `PROMOCIONES` (`#promos`).
- **Selector Interactivo de Modalidades (Tabs):**
  - **Pestaña 1: Clases Grupales (Máx. 8 Alumnos):**
    - **Modalidad Regular ($1,490 MXN/mes):** 3 clases/sem (50 min) • L-M-V o M-J-V (08:00 a 21:00 hrs). Tarjeta destacada con insignia dorada `RECOMENDADO • MÁS POPULAR`.
    - **Modalidad Sabatino ($1,650 MXN/mes):** 1 sesión intensiva de 2h 50 min los sábados en 3 turnos (08:00-10:50, 11:00-13:50, 14:00-16:50 hrs).
    - **Modalidad Intensivo ($2,550 MXN/mes):** 5 clases/sem (50 min) de lunes a viernes con inmersión total y avance acelerado.
  - **Pestaña 2: Clases Particulares & Part Duo:**
    - Clases 1 a 1 personalizadas con tarifas oficiales: 1 clase ($1,500), 2 clases ($2,500), 3 clases ($3,750), 5 clases ($6,500 MXN/mes).
    - Modalidad **Part Duo**: Estudia en pareja con el mismo profesor y horario compartido con tarifa preferencial.
- **Banner de Promociones Multi-Mes (`#promos`):**
  - Descuentos oficiales por prepago: 3 Meses (15% DTO), 6 Meses (20% DTO - Más Elegido), 9 Meses (25% DTO).
- **Barra de Garantías y Refuerzo de Prueba Gratuita:**
  - Sellos de confianza: Sin cuotas ocultas, libro de actividades 100% gratis, Zoom con enlace fijo permanente y certificado oficial avalado.
  - Callout box con botón para agendar Clase de Prueba Gratis directamente conectado al modal.
- **Estilos Visuales & Responsivo (`LandingPage.css`):**
  - Tipografía *Cinzel* y *Outfit*, bordes dorados `#D59B28`, elevaciones suaves en hover y adaptación móvil fluida (1 columna en celulares y tablets).

---

## [2.8.0] — 2026-09-03

### Adaptación a Información 100% Real del Cliente & Perfeccionamiento de Testimonios y Footer
- **Estructura Académica Oficial de 6 Niveles:**
  - Reemplazo completo de la escala genérica (A1 a C2) por los 6 niveles oficiales de la escuela:
    - **B1 – Básico 1** (Principiante • 4 Meses / 4 Unidades)
    - **B2 – Básico 2** (Elemental • 4 Meses / 4 Unidades)
    - **I1 – Intermedio 1** (Autonomía • 4 Meses / 4 Unidades)
    - **I2 – Intermedio 2** (Fluidez • 4 Meses / 4 Unidades)
    - **A1 – Avanzado 1** (Dominio • 4 Meses / 4 Unidades)
    - **A2 – Avanzado 2** (Bilingüismo • 4 Meses / 4 Unidades)
  - Incorporación en cada tarjeta de nivel de la estructura real: 4 unidades (~1 mes c/u), evaluación dual (examen escrito + oral), certificación oficial de nivel y libro de actividades gratuito.
  - Conservación milimétrica de los doodles vectoriales de esquina en el stepper (boina, taza, burbuja, corona, estrella y diamante).
- **Perfeccionamiento de Testimonios (Avatares Limpios & Banderas Aparte):**
  - Remoción de la píldora "Alumno Verificado".
  - Avatares circulares limpios con enfoque centrado en los rostros de los alumnos (`avatar_mariana_clean.jpg`, `avatar_carlos_clean.jpg`, `avatar_sofia_clean.jpg`), eliminando barras negras, estrellas superpuestas o recortes de banderas dentro del círculo.
  - Banderas de países ubicadas de forma independiente al lado del nombre de cada estudiante (`flag_mx.svg`, `flag_es.svg`, `flag_ar.svg`).
  - Actualización de los badges de nivel de cada alumno a la nomenclatura oficial (`Nivel Intermedio 2 • México`, `Nivel Básico 2 • España`, `Nivel Avanzado 1 • Argentina`).
- **Footer Oficial (Sede y Escuela Online):**
  - Actualización de ubicación en la columna de contacto a `📍 Clases 100% Online · Sede: Puebla, México`, preservando proporciones con `flex-shrink: 0` en el icono `MapPin`.
- **Menú de Navegación ("Cursos") & Modal de Registro:**
  - Dropdown Cursos actualizado con 6 Niveles Oficiales, Modalidades Grupales y Clases Particulares / Part Duo.
  - Selector de horarios en modal actualizado con las modalidades reales de estudio: Regular (3 clases/sem • 50 min), Sabatino (Sábados • 2h 50 min), Intensivo (5 clases/sem • 50 min) y Particulares/Part Duo (Personalizado).

---

## [2.7.0] — 2026-09-03

### Rediseño Total "Royal & Chic" (Sección: Lo Que Dicen Nuestros Alumnos / Testimonios)
- **Concepto Visual "Modern Royal Proof":**
  - Rediseño completo de la sección de testimonios para armonizar visualmente con el Hero, Método MRAF® y Beneficios de la Realeza.
  - Integración sutil de marca de agua inclinada de alta resolución (`petit_a_petit_stamp.png`) en el fondo con opacidad suave y rotación dinámica (-13deg).
- **Encabezado Premium con Prueba Social Inmediata:**
  - Píldora royal superior: `✨ TESTIMONIOS REALES • MÉTODO MRAF®` con fondo dorado tenue (`rgba(213, 155, 40, 0.1)`) y borde dorado de marca `#D59B28`.
  - Título H2 100% vectorial en peso ultra bold (900) en Azul Marino Imperial `#001b50`.
  - Subrayado vectorial de pincelada roja sketch (`sketch_red_underline.svg`).
  - Barra de confianza flotante con valoración de 5 estrellas doradas (`⭐ 4.9 / 5 • Valoración promedio de +1,000 alumnos en más de 15 países`).
- **Tarjetas de Alumnos con Identidad Individualizada:**
  - **Tarjeta 1 (Mariana G. 🇲🇽):**
    - Borde superior en Dorado Imperial `#D59B28` (5px) con esquina superior derecha pronunciada (36px).
    - Tag temático: `#FluidezEn3Meses` en tonos dorados.
    - Anillo de avatar en Dorado de Marca (`border: 2.5px solid #D59B28`) y bandera de México con borde blanco flotante.
  - **Tarjeta 2 (Carlos T. 🇪🇸):**
    - Borde superior en Rojo Carmesí `#D92534` (5px).
    - Tag temático: `#HablaSinPena` en tonos rojos.
    - Anillo de avatar en Rojo Carmesí (`border: 2.5px solid #D92534`) y bandera de España con borde blanco flotante.
  - **Tarjeta 3 (Sofía R. 🇦🇷):**
    - Borde superior en Azul Marino Imperial `#001b50` (5px).
    - Tag temático: `#CeroAburrimiento` en tonos azul marino.
    - Anillo de avatar en Azul Marino Imperial (`border: 2.5px solid #001b50`) y bandera de Argentina con borde blanco flotante.
- **Micro-interacciones y Detalles de Acabado:**
  - Elevación fluida en hover (`transform: translateY(-8px); box-shadow: 0 22px 46px rgba(0, 27, 80, 0.12)`).
  - Comillas decorativas gigantes con cambio de color al tono temático en hover.
  - Insignia verde de verificación con icono de check: `Alumno Verificado`.
  - Indicador de slider inferior rediseñado con punto activo alargado en píldora roja carmesí `#D92534` (32px).
- **100% Adherencia a la Paleta Oficial de Marca:**
  - Dorado Imperial: `#D59B28`
  - Azul Marino Imperial: `#001b50`
  - Rojo Carmesí: `#D92534`

---

## [2.6.0] — 2026-09-03

### Agregado & Reconstruido (Encabezado 1:1 Nítido HD "Beneficios de la Realeza")
- **Eliminación Definitiva de Imagen Raster Borrosa (`beneficios_header_complete.png`):**
  - Removida la imagen completa con texto incrustado para erradicar cualquier tipo de pixelación o desenfoque.
- **Tipografía 100% Vectorial Nítida en HTML/CSS (`LandingPage.tsx` y `LandingPage.css`):**
  - **Título Principal:** `BENEFICIOS DE LA` en Azul Marino Imperial `#001b50` y `REALEZA` en Rojo Carmesí `#D92534` en peso extra bold (900).
  - **Subtítulo:** *"¿Por qué miles de alumnos eligen estudiar con Les Rois du Français?"* en tipografía *Outfit* 600 (`#001b50`).
  - **Callout Manuscrito:** *"¡Resultados Reales!"* en tipografía *Caveat* 700 en Dorado de Marca `#D59B28` con subrayado vectorial rojo (`sketch_red_underline.svg`).
- **Integración Milimétrica y Calibración de Stickers Transparentes (`frontend/public/imagenes-lp/`):**
  - **Avión de Papel con Estela en Bucle (`paper_plane_loop_trail.png`):** Calibrado en altura (`top: 48px`) y avance a la derecha (`right: -120px; z-index: 5`) para acompañar fluidamente el título y la burbuja "Ça va?".
  - **Burbuja 3D Glossy "Ça va?" (`ca_va_bubble_red.png`):** Posicionada en la derecha flotando despejada debajo del avión (`top: 104px`).
  - **Coronita Doodle Amarilla (`crown_doodle_yellow.png`):** Asentada milimétricamente en la cúspide y hombro derecho de la letra **A** de *REALEZA* (`top: -28px; right: -38px; rotate(18deg)`).
  - **Destellos Diagonales Rojos (`red_burst_diagonal.png`):** Posicionados arriba a la izquierda de la letra **B** de *BENEFICIOS*.
  - **Destellos Laterales Rojos (`red_burst_vertical.png`):** Flanqueando a izquierda y derecha el lema *"¡Resultados Reales!"*.
  - **Burbuja "Salut!" y Estrellas Doradas:** Burbuja ampliada a `126px` a la izquierda (`left: -140px`), removidas las 3 líneas y reposicionadas las estrellas doradas (`#D59B28`) a `60px` a la altura de *"¡Resultados Reales!"*.
  - **Laptop & Planta:** Destellos azules reposicionados sobre las hojas centrales de la planta (`top: 102px; right: -18px`) y patrón de puntos azules (*navy halftone*) ampliado en un 60% (`215px`, opacidad `0.85`).
  - **Tarjetas 2, 3 y VIP:**
    - Estrella roja doodle y rayo amarillo doodle colocados **dentro** de los recuadros blancos en la esquina superior derecha (`top: 16px; right: 18px`).
    - Removidos los puntos azules y halftone de Card 3 para un acabado pulcro.
    - Card VIP con distribución armónica: 2 beneficios en la primera fila y el 3er beneficio (*Apoyo constante en tu camino*) perfectamente centrado debajo de ambos.
- **Auditoría Exhaustiva de Paleta de Marca:**
  - Verificado 100% el uso estricto y unificado de los 3 colores oficiales de Les Rois du Français en toda la sección:
    - **Dorado Imperial:** `#D59B28`
    - **Azul Marino Imperial:** `#001b50`
    - **Rojo Carmesí:** `#D92534`

---

## [2.5.0] — 2026-08-29

### Agregado & Perfeccionado (Rediseño de Método MRAF® y Doodles Manuscritos)
- **Procesamiento de Doodles Manuscritos en PNG 100% Transparente (`frontend/public/imagenes-lp/`):**
  - **Gorrito Francés a Rayas (`beret_doodle_navy.png`):** Recoloreado al azul marino imperial `#001b50` con opacidad total 100%, escala ajustada a `76px` y posicionamiento flotante a la derecha de la gran letra **F** (`right: -88px; top: -10px; rotate(3deg)`).
  - **Rayo Rojo (`lightning_doodle_pure.png`):** Recoloreado al rojo oficial de la marca `#D92534`, sin bordes ni cajas blancas, posicionado a la derecha de la gran letra **R** (`right: -75px; top: 10px; width: 24px`).
  - **Corazón Blanco (`heart_doodle.png`):** Dibujo de corazón blanco manuscrito con destellos recortado a transparencia total, posicionado a la izquierda de la gran letra **A** (`left: -68px; top: 18px; width: 26px`).
- **Coronas de Tarjetas Interactivas M-R-A-F (`LandingPage.tsx`):**
  - **Corona F (`crown_f_nobg.png`):** Corona roja con letra F blanca aislada a 0% de fondo mediante algoritmo flood-fill.
  - **Corona A (`crown_a.png`):** Corona dorada oficial con letra A en azul marino `#001b50` recortada a transparencia total (incluyendo agujeros de aros superiores).
  - **Eliminación de Estrellas:** Removidas las 3 estrellas indicadas en las tarjetas del método MRAF por solicitud explícita del usuario.
- **Rama Floral Ornamental (`flora_fleur_sketch_hd.png`):**
  - Procesada a transparencia pura (0% recuadro o relleno beige).
  - Reubicada en la esquina inferior izquierda de la sección MRAF (`left: -50px; bottom: -40px; width: 310px; opacity: 0.85`), emergiendo sutilmente debajo del recorte del príncipe con la corona.
- **Directivas Globales de Marca (`LandingPage.css`):**
  - **Emoji-Free UI:** Reemplazados todos los emojis Unicode por íconos vectoriales SVG de Lucide React (`Crown`, `Star`, `Zap`, `Heart`).
  - **Tipografía Azul Marino Imperial `#001b50`:** Reemplazados todos los tonos de texto gris (`#4A5568`, `#64748B`, `#2D3748`, `#718096`) por Azul Marino `#001b50`.
  - **Pill Badge:** Actualizado *"Actitud Royal, Cero Aburrimiento"* a rojo degradado de marca (`.lrd-pill-red`, `#D92534`).

---

## [2.1.3] — 2026-08-20

### Arreglado & Optimizado (Responsivo Móvil)
- **Corrección de la Sección Método MRAF® en Celulares (`LandingPage.css`):**
  - Se corrigió la regla `.lrd-method-layout` ajustando su visualización a 1 sola columna centrada (`flex-direction: column`) en dispositivos móviles (< 1024px, incluyendo iPhone 12 Pro).
  - Se adaptó la cuadrícula `.lrd-mraf-grid` a una disposición compacta 2x2 para las tarjetas **M**, **R**, **A**, **F**, eliminando el desbordamiento horizontal y el espacio blanco a la derecha.
- **Ajuste de Media Queries para Testimonios y Guía Ebook (`LandingPage.css`):**
  - Ajustado el punto de interrupción a `@media (max-width: 1024px)` para aplicar la pila vertical a `.lrd-testimonials-flex`, permitiendo que la tarjeta de la Guía Gratuita Ebook y la lista de testimonios en 1 columna convivan perfectamente sin salirse del área visible del teléfono.
- **Sincronización:** Cambios aprobados localmente y publicados en ramas `dev` y `main` con despliegue exitoso en Render.

---

## [2.1.2] — 2026-08-18

### Cambiado
- **Reemplazo Definitivo de la Imagen de la Chica en Banner Azul (`why_girl_banner.png` y `woman_tiara.png`):**
  - Se procesó y guardó la **nueva foto recortada sin barras sobrantes** enviada por el cliente (`media__1787023239417.png`), actualizándola en `frontend/public/imagenes-lp/`, `imagenes-lp/` y `scratch/les-rois-du-francais/assets/`.

---

## [2.1.1] — 2026-08-18

### Cambiado
- **Limpieza de Ícono y Estilo Gris (`imagenes-lp/why_icon1.png` a `why_icon5.png`):**
  - **Eliminado artefacto izquierdo en la Torre Eiffel (`why_icon4.png`):** Se limpió la imagen removiendo la línea vertical lateral sobrante y centrando la Torre Eiffel en color **Gris Oscuro elegante (`#555555`)** a una altura proporcionada de `34px`.
- **Integración Continua de 1 Solo Bloque 50/50 (`LandingPage.tsx` y `LandingPage.css`):**
  - Removidos los contenedores aislados de tarjetas. Ahora la parte izquierda con los íconos y la tabla comparativa convive a la par en un 50% perfecto con el banner azul completo de la chica con tiara (`why_girl_banner.png`), luciendo como una sola sección unificada sin espacios vacíos.

---

## [2.1.0] — 2026-08-18

### Cambiado
- **Ajustes Exactos de la Sección "¿Por Qué Elegir...?" (`LandingPage.tsx` y `LandingPage.css`):**
  - **Maquetación Mitad y Mitad (50% / 50%):** Eliminada la brecha excesiva entre la información de la izquierda y la foto de la derecha (`grid-template-columns: 1fr 1fr; gap: 24px`).
  - **Título Naranja:** Título *LES ROIS DU FRANÇAIS?* configurado en color naranja vibrante (`#F24E1E`).
  - **Íconos del Menú Más Grandes y Claros:** Re-recortados los 5 íconos sin márgenes vacíos e incrementado su tamaño relativo (`height: 46px`).
  - **Íconos de Listas:**
    - Équis `✕` en OTRAS ESCUELAS configuradas en color **Azul (`#092B6B`)**.
    - Palomitas `✓` en LES ROIS DU FRANÇAIS configuradas en **Rojo dentro de un Círculo Rojo sin Relleno**.
  - **Alineación del VS:**
    - Corona azul agrandada (`36px`) y pegada directamente al texto **VS**.
    - Eliminadas las líneas verticales punteadas grises del divisor central.

---

## [2.0.0] — 2026-08-18

### Agregado & Reconstruido
- **Reconstrucción Total de la Sección "¿Por Qué Elegir Les Rois du Français?" (`LandingPage.tsx`, `LandingPage.css` y `style.css`):**
  - **Imagen de Chica Modelo en Banner Derecho (`imagenes-lp/why_girl_banner.png`):** Integrada la imagen oficial en alta resolución de la chica con tiara sobre fondo azul real apuntando hacia la tabla comparativa.
  - **Encabezado con Colores Oficiales:** Subtítulo *¿POR QUÉ ELEGIR* en Azul Real (`#092B6B`) y Título *LES ROIS DU FRANÇAIS?* en Rojo Carmesí (`#D92534`).
  - **Fila de 5 Íconos Oficiales Extraídos (`why_icon1.png` a `why_icon5.png`):** Extraída la fila de íconos vectoriales en alta resolución colocados verticalmente (ícono arriba, etiqueta en azul debajo).
  - **Tabla Comparativa Rediseñada:**
    - Píldora de encabezado para *OTRAS ESCUELAS* en fondo oscuro (`#202636`) y píldora para *LES ROIS DU FRANÇAIS* en fondo rojo (`#D92534`).
    - Íconos de lista `✕` y `✓` en rojo destacados con tipografía en azul.
  - **Separador Central VS con Corona Azul (`imagenes-lp/blue_crown_vs.png`):** Extraída la corona azul oficial del cliente posicionada sobre el texto **VS**.

---

## [1.9.0] — 2026-08-17

### Cambiado
- **Homologación de Colores Azul Marino Corporativo (`LandingPage.css` y `style.css`):**
  - **Fondo de la Tarjeta "Curso de Verano":** Se cambió el tono azul oscuro anterior por la gradiente azul marino profunda idéntica a la barra de estadísticas (`linear-gradient(135deg, #092B6B 0%, #001D5C 100%)`).
  - **Letras Grandes Método MRAF®:** Se unificó el tono azul del logo principal *MRAF®*, la descripción en francés y las letras gigantes (*M, R, A, F*) al tono azul marino real oficial (`#092B6B`).

---

## [1.8.1] — 2026-08-17

### Cambiado
- **Sobresalimiento y Tamaño de la Tarjeta "Curso de Verano" (`LandingPage.tsx` y `LandingPage.css`):**
  - **Efecto Pop-Out:** La tarjeta oscura de *Curso de Verano* ahora sobresale por encima de los otros tres planes (`transform: scale(1.06)`), con una sombra más pronunciada (`box-shadow: 0 16px 38px rgba(9, 29, 62, 0.35)`) y padding mayor (`34px 22px`).
  - **Sol Más Grande y Cercano:** Se incrementó el tamaño del ícono del Sol (`size={48}`) y se posicionó inmediatamente al lado del título *CURSO DE VERANO* (`gap: 12px`).

---

## [1.8.0] — 2026-08-17

### Cambiado
- **Rediseño de la Sección de Planes y Precios (`LandingPage.tsx` y `LandingPage.css`):**
  - **Eliminación de Coronas:** Removidas las coronas doradas de la parte superior de los 3 planes principales (3, 6 y 9 meses).
  - **Descuentos en Texto Plano Rojo/Naranja:** Los porcentajes de descuento (`15% DTO.`, `20% DTO.`, `25% DTO.`) pasaron de píldoras rellenas a texto plano destacado en color rojo/naranja (`#D92534`).
  - **Textos de Horarios en Azul:** La descripción debajo del descuento (`En cualquier horario...`) se configuró en tono **Azul Rey Corporativo** (`#002882`).
  - **Tarjeta Curso de Verano 100% Blanca:** Todos los textos de la tarjeta oscura (*CURSO DE VERANO*, *4 SEMANAS DE FRANCÉS* y descripción) se unificaron en blanco puro (`#FFFFFF`).
  - **Ícono del Sol a la Derecha:** Se removió el ícono de destellos/estrella y se integró el **ícono del Sol (`Sun`) en color blanco a la derecha del título** *CURSO DE VERANO*.

---

## [1.7.2] — 2026-08-17

### Cambiado
- **Ajuste Milimétrico de la Imagen del Rey (`LandingPage.css` y `style.css`):**
  - Deslizada la figura del Rey unos píxeles adicionales hacia abajo (`translateY(48px)`), eliminando el milimétrico espacio inferior para que haga contacto perfecto con la sección siguiente.

---

## [1.7.1] — 2026-08-17

### Cambiado
- **Ajuste Fino de la Posición del Rey (`LandingPage.tsx` y `LandingPage.css`):**
  - Restablecida la imagen recortada original preferida por el usuario (`rey.png`).
  - Restaurada la maquetación base del Hero (`padding: 50px 0 90px`) y deslizada sutilmente la figura del Rey unos píxeles más abajo (`transform: translateY(35px)`) para lograr una apariencia limpia y equilibrada.

---

## [1.7.0] — 2026-08-17

### Cambiado
- **Alineación Perfecta del Rey en el Hero (`LandingPage.tsx` y `LandingPage.css`):**
  - **Eliminación del Espacio Inferior (Gap):** Eliminado el padding inferior en `.lrd-hero-section` y ajustada la transformación del Rey (`transform: translateY(60px); margin-bottom: -60px`).
  - **Superposición Continua:** La figura recortada del Rey en alta definición (`king_cutout_perfect.png`) ahora se extiende hasta el borde inferior exacto de la sección Hero, desapareciendo de forma limpia por detrás de la tarjeta de estadísticas (*Stats Bar*), sin ningún espacio ni corte visible.

---

## [1.6.0] — 2026-08-17

### Agregado
- **Corona Roja Oficial del Hero (`imagenes-lp/hero_crown_red.png`):**
  - Extracción y aislamiento en alta resolución del ícono de corona roja dibujada a mano suministrado en la captura del cliente.
  - Generación de transparencia sin artefactos y conversión a Base64 (`imagenes-lp/hero_crown_red_b64.txt`).
- **Actualización del Hero (`LandingPage.tsx`, `LandingPage.css` y `elementor_copy_paste.html`):**
  - Reemplazado el gráfico de trazado SVG genérico por la imagen oficial de la corona roja (`hero_crown_red.png`), posicionada perfectamente sobre el título *"Tu reinado del francés en línea"*.

---

## [1.5.0] — 2026-08-17

### Cambiado
- **Extracción Exacta de Coronas de la Imagen Oficial (`imagenes-lp/crown_m.png`, `crown_r.png`, `crown_a.png`, `crown_f.png`):**
  - Se recortaron y aislaron los 4 íconos de coronas exactamente desde la imagen proporcionada (Azul, Roja, Azul con destellos, Roja con destellos) con fondo transparente limpio para garantizar 100% de coincidencia gráfica.
- **Eliminación Total de Bloques / Tarjetas en Método MRAF® (`LandingPage.css`):**
  - Se removió por completo cualquier fondo de tarjeta (`background: none`), bordes redondeados globales y sombras. Las columnas se ubican directamente sobre el fondo limpio del sitio, separadas únicamente por una delgada línea divisora gris vertical (`border-right: 1px solid rgba(0, 40, 130, 0.15)`).

---

## [1.4.0] — 2026-08-17

### Cambiado
- **Rediseño de la Sección Método MRAF® (`LandingPage.tsx` y `LandingPage.css`):**
  - **Subtítulo en Azul Corporativo:** Las letras de *"Méthode Rapide d'Apprentissage du Français"* pasaron de gris/atenuado a **Azul Rey Corporativo** (`#002882`).
  - **Coronas Rellenas Sólidas:** Las coronas superiores de las 4 columnas cambiaron a formato relleno sólido (`fill="#002882"` para M/A y `fill="#D92534"` para R/F).
  - **Letras MRAF 100% en Azul:** Todas las iniciales (**M, R, A, F**) se unificaron en color **Azul Rey** (`#002882`), eliminando el tono rojo en las letras R y F.
  - **Textos Descriptivos en Azul:** Todo el texto descriptivo interior de las tarjetas de método cambió a **Azul Rey** (`#002882`).
  - **Maquetación Limpia con Líneas Divisoras:** Eliminado el efecto de "cajitas/bloques flotantes". Ahora el contenedor es plano con fondo blanco/traslúcido, utilizando delgadas líneas divisoras verticales en color gris (`border-right: 1px solid #E2E8F0`) entre cada columna.

---

## [1.3.0] — 2026-08-17

### Cambiado
- **Rediseño de la Barra de Estadísticas (`LandingPage.css` y `style.css`):**
  - **Fondo Azul Marino:** El contenedor de estadísticas pasó de blanco a un gradiente azul marino continuo (`#092B6B` a `#001D5C`) con bordes sutiles traslúcidos.
  - **Color de Texto e Íconos a Blanco:** Todos los valores numéricos, etiquetas informativas e íconos cambiaron de color azul/gris a Blanco Puro (`#FFFFFF`) y blanco semi-traslúcido (`rgba(255,255,255,0.9)`).
  - **Disposición Vertical (Íconos arriba de los números):** Cambio de maquetación en `.lrd-stat-col` a `flex-direction: column` para posicionar cada ícono centrado directamente arriba de las cifras numéricas y sus descripciones, eliminando la alineación a la izquierda.

---

## [1.2.0] — 2026-08-17

### Agregado
- **Imagen Panorámica de la Torre Eiffel (`imagenes-lp/eiffel_tower_hero_full.png`):**
  - Implementación de la nueva imagen panorámica en alta resolución proporcionada para el fondo de la sección Hero.
  - La imagen incluye la Torre Eiffel completa posicionada a la derecha y el horizonte estilizado (skyline) de la ciudad en tonos azules vectoriales.
  - Copiada e integrada en la carpeta oficial del proyecto `imagenes-lp/` y en `frontend/public/imagenes-lp/`.
- **Integración de Código Base64 (`imagenes-lp/eiffel_hero_b64.txt`):**
  - Conversión e inclusión de la nueva imagen panorámica en formato Base64 para garantizar la portabilidad sin dependencias externas al copiar en WordPress.

### Cambiado
- **Estilos CSS Hero (`LandingPage.css` y `style.css`):**
  - Configurado `.lrd-hero-bg-eiffel` con `object-fit: cover` y `object-position: right center` para asegurar que la Torre Eiffel no se corte vertical u horizontalmente en monitores ultrapanorámicos ni dispositivos móviles.
- **Enrutamiento Público (`App.tsx`):**
  - La ruta raíz `/` y la ruta pública `/landing` ahora cargan directamente la Landing Page sin solicitar inicio de sesión.
  - El portal del alumno fue reubicado a la ruta `/dashboard`.
- **Plantilla Elementor Pro (`elementor_copy_paste.html`):**
  - Actualizado el widget de HTML único de Elementor con el nuevo fondo panorámico Base64 de la Torre Eiffel y la imagen recortada del Rey.

---

## [1.1.0] — 2026-08-16

### Agregado
- **Recorte Profesional del Rey (`imagenes-lp/king_cutout_perfect.png`):**
  - Extracción limpia de fondo (cutout) de la mascota oficial (Rey de Les Rois du Français) eliminando artefactos de pantalla verde.
- **Componentes Interactivos de Niveles MCER (A1 - C2):**
  - Sistema de pestañas dinámicas en React para conmutar la información pedagógica entre niveles (A1, A2, B1, B2, C1, C2).
- **Planes de Precios y Tabla Comparativa:**
  - Sección de precios con insignias de descuento, modalidades de pago y tabla comparativa "Método MRAF® vs Métodos Tradicionales".
- **Modales de Captación:**
  - Modal de captura de Leads para clase de prueba gratuita y modal interactivo para reproducción de video demo.

---

## [1.0.0] — 2026-08-10

### Agregado
- **Diseño Inicial de la Landing Page:**
  - Maquetación inicial responsive con paleta de colores corporativa: Azul Rey (#002882), Rojo Carmesí (#D92534) y Blanco (#FFFFFF).
  - Tipografías oficiales integradas desde Google Fonts: *Cinzel*, *Playfair Display*, *Outfit* y *Caveat*.
