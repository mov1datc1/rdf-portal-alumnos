# Changelog — Landing Page Les Rois du Français

Todos los cambios notables de la **Landing Page** de *Les Rois du Français* serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y se adhiere al [Versionado Semántico](https://semver.org/lang/es/).

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
