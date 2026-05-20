# Manual de Configuración: Integración API de Zoom (Server-to-Server)

Este manual detalla los pasos exactos que debes seguir como administrador de la cuenta de Zoom para generar las credenciales de seguridad necesarias. Estas credenciales permitirán que tu plataforma (Portal RDF) cree reuniones y descargue grabaciones automáticamente sin requerir intervención manual.

> **Importante:** Tu cuenta de Zoom debe ser de pago (Pro, Business o Enterprise) para tener acceso a la grabación en la nube y a las herramientas de desarrollador completas.

---

## Fase 1: Crear la Aplicación en Zoom

1. Abre tu navegador e inicia sesión en tu cuenta de administrador de Zoom.
2. Ve al portal para desarrolladores: [Zoom App Marketplace](https://marketplace.zoom.us/).
3. En la esquina superior derecha, haz clic en el menú **"Develop"** (Desarrollar) y selecciona **"Build App"** (Crear App).
4. Lee y acepta los términos de servicio de desarrollador si te lo solicita.
5. Verás varias opciones de tipos de aplicaciones. Busca la tarjeta que dice **"Server-to-Server OAuth"** y haz clic en el botón **"Create"** (Crear).
6. Ponle un nombre a la aplicación, por ejemplo: `Portal Alumnos RDF` y haz clic en Crear.

---

## Fase 2: Configurar la Aplicación

Una vez creada, serás llevado a un panel con varias pestañas en el lado izquierdo. Completa los pasos en orden:

### 1. Pestaña "App Credentials" (TUS CLAVES SECRETAS)
Aquí verás tres valores alfanuméricos muy importantes. Por favor, **cópialos y guárdalos en un lugar seguro** (un bloc de notas temporal), ya que me los tendrás que proporcionar más adelante:
- **Account ID**
- **Client ID**
- **Client Secret**

### 2. Pestaña "Information"
Llena los datos básicos obligatorios:
- **Company Name:** Les Rois Du Français
- **Developer Contact Information:** Pon tu nombre y tu correo electrónico.
- Haz clic en **Continue**.

### 3. Pestaña "Feature"
Esta sección la usaremos en el futuro para configurar el "Webhook" (el aviso automático de que una grabación está lista). Por ahora, puedes dejarla intacta y hacer clic en **Continue**.

### 4. Pestaña "Scopes" (PERMISOS DE LA APLICACIÓN)
Aquí es donde le damos permiso a la plataforma para hacer acciones en Zoom en tu nombre. Haz clic en el botón **"+ Add Scopes"**.
Se abrirá un menú lateral. Busca y marca las casillas exactamente de los siguientes permisos:

*En la sección **Meeting** (Reuniones):*
- `meeting:read:admin` (Ver reuniones de la cuenta)
- `meeting:write:admin` (Crear y editar reuniones de la cuenta)

*En la sección **Recording** (Grabaciones):*
- `recording:read:admin` (Ver y descargar las grabaciones en la nube)

Una vez marcadas esas tres casillas, haz clic en **Done** en la parte inferior y luego en **Continue**.

---

## Fase 3: Activación

Llegarás a la última pestaña llamada **"Activation"**.
Si todos los pasos anteriores están correctos, verás un botón azul que dice **"Activate your app"**. Haz clic en él.

Tu aplicación ahora está activa y lista para comunicarse con tu plataforma web.

---

## Siguientes Pasos

Una vez que hayas activado la aplicación, escríbeme por el chat confirmando que está lista y **pásame los 3 códigos** que copiaste en la Fase 2 (Account ID, Client ID y Client Secret). 

*Nota: Para mantener la seguridad, no subiremos estas claves al código fuente en GitHub. Las inyectaremos de forma encriptada directamente en las variables de entorno de Render (tu servidor).*
