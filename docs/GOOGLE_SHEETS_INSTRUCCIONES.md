# Instrucciones: Integración con Google Sheets

## Nueva Bota 90 - Sistema de Gestión de Menú

---

## Introducción

El sitio web de Nueva Bota 90 está conectado a Google Sheets para que podáis actualizar el menú y la carta de vinos directamente sin necesidad de conocimientos técnicos.

**Ventajas:**
- ✅ Actualizar precios y platos en tiempo real
- ✅ Añadir o eliminar elementos del menú fácilmente
- ✅ Ocultar platos agotados sin borrarlos
- ✅ No requiere conocimientos de programación
- ✅ Los cambios aparecen automáticamente en la web (hasta 1 hora)

---

## 🔐 Cómo Acceder al Panel de Administración

### Acceso Rápido a las Hojas de Google

Para editar el menú de forma rápida y sencilla, utiliza el **Panel de Administración**:

1. **URL del Panel:** Visita la página de administración de tu sitio web
   - Ejemplo: `https://tu-sitio-web.vercel.app/admin`

2. **Credenciales de acceso:**
   - **Usuario:** `admin`
   - **Contraseña:** (la que te proporcionó el desarrollador)

3. **Inicio de sesión:**
   - El navegador mostrará un cuadro de diálogo solicitando usuario y contraseña
   - Introduce las credenciales y haz clic en "Iniciar sesión" o pulsa Enter

### Panel de Administración

Una vez dentro del panel, verás una interfaz sencilla con dos botones principales:

- **Abrir hoja de la carta** → Te lleva directamente a la hoja de Google donde puedes editar el menú de comida
- **Abrir hoja de vinos** → Te lleva directamente a la hoja de Google donde puedes editar la lista de vinos

Los botones abrirán las hojas en una nueva pestaña del navegador para que puedas editar el contenido fácilmente.

### ⏱️ Importante - Tiempo de Actualización

**Los cambios pueden tardar hasta 1 hora en reflejarse en la web** debido al sistema de caché que optimiza la velocidad del sitio.

Si necesitas que los cambios aparezcan de forma más inmediata, contacta con el equipo técnico.

---

## Enlaces a las Hojas de Cálculo

### CARTA (Comida)
**Enlace para editar:** [Abrir hoja de cálculo CARTA](https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_AQUI)

Esta hoja contiene todos los platos del menú: tablas, tostas, ensaladas, compartir, etc.

### VINOS (Carta de Vinos)
**Enlace para editar:** [Abrir hoja de cálculo VINOS](https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_AQUI)

Esta hoja contiene la carta de vinos organizada por categorías: blancos, tintos, rosados, etc.

---

## Estructura de las Hojas de Cálculo

### CARTA (Menú de Comida)

La hoja de CARTA tiene las siguientes columnas:

| Columna | Descripción | Ejemplo | Requerido |
|---------|-------------|---------|-----------|
| **seccion** | Sección del menú (Tablas, Tostas, Ensaladas, etc.) | `Tablas` | ✅ Sí |
| **nombre** | Nombre del plato | `Chicharrones` | ✅ Sí |
| **descripcion** | Descripción opcional del plato | `Con salsa especial` | ❌ No |
| **precio** | Precio único (si solo tiene un precio) | `11.00` | ❌ No |
| **precio_media** | Precio de media ración | `6.00` | ❌ No |
| **precio_entera** | Precio de ración entera | `9.50` | ❌ No |
| **disponible** | Si el plato está disponible | `TRUE` | ✅ Sí |
| **orden** | Orden de aparición en el menú | `1` | ✅ Sí |

**Ejemplo de fila:**
```
seccion: Tablas
nombre: Chicharrones
descripcion:
precio:
precio_media: 6.00
precio_entera: 9.50
disponible: TRUE
orden: 1
```

### VINOS (Carta de Vinos)

La hoja de VINOS tiene las siguientes columnas:

| Columna | Descripción | Ejemplo | Requerido |
|---------|-------------|---------|-----------|
| **categoria** | Categoría del vino (Blancos, Tintos, Rosados) | `Blancos` | ✅ Sí |
| **nombre** | Nombre del vino | `Verdejo Rueda` | ✅ Sí |
| **descripcion** | Notas de cata opcionales | `Aromático y equilibrado` | ❌ No |
| **origen** | Región o denominación de origen | `Castilla y León` | ❌ No |
| **precio** | Precio de la botella | `18.00` | ✅ Sí |
| **disponible** | Si el vino está disponible | `TRUE` | ✅ Sí |
| **orden** | Orden de aparición en la carta | `10` | ✅ Sí |

**Ejemplo de fila:**
```
categoria: Blancos
nombre: Verdejo Rueda
descripcion: Aromático y equilibrado
origen: Castilla y León
precio: 18
disponible: TRUE
orden: 10
```

---

## Cómo Editar el Menú

### 1. Abrir la Hoja de Cálculo

Haz clic en el enlace de la hoja que quieras editar (CARTA o VINOS).

### 2. Modificar Datos

- **Editar un plato existente:** Haz clic en la celda que quieras cambiar y escribe el nuevo valor
- **Añadir un nuevo plato:** Copia una fila existente, pégala en la siguiente fila vacía y modifica los datos
- **Cambiar precios:** Simplemente actualiza el número en la columna correspondiente

### 3. Guardar Cambios

Los cambios se guardan automáticamente en Google Sheets. **No es necesario hacer nada más.**

### 4. Ver los Cambios en la Web

Los cambios aparecerán en la web automáticamente en un plazo de **hasta 1 hora**. El sistema actualiza los datos cada hora para mantener la web rápida.

---

## Cómo Ocultar Platos (Temporalmente Agotados)

Si un plato se agota temporalmente, **no lo borres**. En su lugar:

1. Localiza la fila del plato
2. En la columna `disponible`, cambia el valor a `FALSE`
3. El plato desaparecerá del menú en la web (hasta 1 hora)
4. Cuando vuelva a estar disponible, cambia el valor a `TRUE`

**Valores aceptados para "disponible":**
- ✅ `TRUE`, `true`, `1`, `yes` → El plato **aparece** en el menú
- ❌ `FALSE`, `false`, `0`, `no` → El plato **NO aparece** en el menú

---

## Formato de Precios

⚠️ **Importante:** Los precios deben escribirse como números, sin el símbolo €

**Correcto:**
- `9.50`
- `12.00`
- `18`

**Incorrecto:**
- ❌ `9,50` (usa punto, no coma)
- ❌ `9.50€` (sin símbolo de euro)
- ❌ `9,50 €` (sin símbolo de euro ni coma)

### Platos con Media y Entera Ración

Si un plato tiene dos precios (media y entera):

1. **Deja vacía** la columna `precio`
2. Rellena `precio_media` con el precio de la media
3. Rellena `precio_entera` con el precio de la entera

**Ejemplo:**
```
nombre: Chicharrones
precio:
precio_media: 6.00
precio_entera: 9.50
```

### Platos con Un Solo Precio

Si un plato tiene un solo precio:

1. Rellena la columna `precio`
2. **Deja vacías** las columnas `precio_media` y `precio_entera`

**Ejemplo:**
```
nombre: Tosta de Atún
precio: 11.00
precio_media:
precio_entera:
```

### Precios sin Definir (Consultar en Local)

Si quieres mostrar "Consultar precio en el local":

1. Pon `—` (guion largo) o deja vacío el precio
2. El sitio web mostrará un guion o no mostrará precio

**Ejemplo:**
```
nombre: Empanada Carne
precio: —
```

---

## Orden de Aparición

El número en la columna `orden` determina en qué posición aparece cada plato dentro de su sección o categoría.

- **Números menores** aparecen **primero**
- **Números mayores** aparecen **después**

**Ejemplo:**
```
Plato A (orden: 1) → Aparece primero
Plato B (orden: 2) → Aparece segundo
Plato C (orden: 10) → Aparece tercero
```

💡 **Consejo:** Usa números espaciados (1, 10, 20, 30...) para poder insertar platos entre medias sin tener que renumerar todo.

---

## ¡IMPORTANTE! No Cambiar Nombres de Columnas

⚠️ **CRÍTICO:** **NO cambies los nombres de las columnas** (la primera fila de la hoja).

Los nombres de las columnas son:
- CARTA: `seccion`, `nombre`, `descripcion`, `precio`, `precio_media`, `precio_entera`, `disponible`, `orden`
- VINOS: `categoria`, `nombre`, `descripcion`, `origen`, `precio`, `disponible`, `orden`

Si cambias estos nombres, el sistema dejará de funcionar y la web mostrará el menú anterior (de respaldo).

---

## Actualización Automática

### ¿Cuándo Aparecen los Cambios en la Web?

El sitio web actualiza los datos de Google Sheets automáticamente cada **1 hora**.

- **Cambio inmediato:** No
- **Tiempo máximo de espera:** 1 hora
- **Promedio:** 30-60 minutos

### ¿Por Qué No Es Inmediato?

Para mantener la web rápida y reducir costes, los datos se almacenan en caché durante 1 hora. Esto significa que el sitio web no consulta Google Sheets cada vez que un cliente visita la página.

### ¿Cómo Forzar una Actualización Inmediata?

Si necesitas que los cambios aparezcan inmediatamente:

1. Contacta con el equipo técnico
2. Ellos pueden forzar una nueva compilación del sitio web en Vercel

---

## Secciones del Menú

Las secciones actuales del menú de CARTA son:

1. **Tablas** - Tablas de embutidos, jamón, queso, etc.
2. **Tostas** - Tostas XXL
3. **Hamburguesa** - Hamburguesas de ternera y vegetariana
4. **Compartimos** - Platos para compartir (costillas, croquetas, gyozas, etc.)
5. **Ensaladas** - Ensaladas y carpaccios
6. **Pokes** - Pokes de pollo, atún, falafel
7. **Empanadas Argentinas y Milanesas** - Empanadas y milanesas

⚠️ **Importante:** El nombre de la sección debe coincidir exactamente con uno de estos nombres. Si usas un nombre diferente, creará una nueva sección.

---

## Categorías de Vinos

Las categorías actuales de VINOS pueden ser:

1. **Blancos** - Vinos blancos
2. **Tintos** - Vinos tintos
3. **Rosados** - Vinos rosados
4. **Espumosos** - Cavas y champagnes
5. **Otros** - Otros vinos

Puedes crear nuevas categorías simplemente escribiendo un nuevo nombre en la columna `categoria`.

---

## Solución de Problemas

### El menú no se actualiza en la web

**Posibles causas:**
1. **Han pasado menos de 1 hora** → Espera y vuelve a comprobar
2. **Error en los datos** → Revisa que los precios son números y `disponible` es TRUE/FALSE
3. **Columnas renombradas** → Asegúrate de que los nombres de las columnas son correctos
4. **Fila vacía** → Las filas completamente vacías se ignoran

### Un plato no aparece en el menú

**Comprueba:**
1. ✅ ¿La columna `disponible` tiene el valor `TRUE`?
2. ✅ ¿La columna `nombre` está rellena?
3. ✅ ¿Has esperado al menos 1 hora desde el cambio?

### Los precios aparecen mal

**Comprueba:**
1. ✅ ¿Usas punto `.` en lugar de coma `,` para decimales?
2. ✅ ¿Los precios son números sin el símbolo `€`?
3. ✅ ¿Los valores están en las columnas correctas (`precio`, `precio_media`, `precio_entera`)?

---

## Configuración Técnica (Solo Personal Técnico)

### Variables de Entorno en Vercel

Para que la integración funcione, las siguientes variables de entorno deben estar configuradas en Vercel:

1. **Ir a:** [Vercel Dashboard](https://vercel.com/) → Proyecto → Settings → Environment Variables

2. **Añadir variables:**

**Variable 1:**
- **Name:** `NEXT_PUBLIC_GOOGLE_SHEET_CARTA_CSV_URL`
- **Value:** `https://docs.google.com/spreadsheets/d/e/2PACX-1vSf1tIWGcTniLmJtr2CCElkstlY1VKBf6tLZOQwqUuxIzNeDkxQo0KDThrDY3Cgc1EcIaWMKA4BKS37/pub?gid=0&single=true&output=csv`
- **Environment:** Production, Preview, Development

**Variable 2:**
- **Name:** `NEXT_PUBLIC_GOOGLE_SHEET_VINOS_CSV_URL`
- **Value:** `https://docs.google.com/spreadsheets/d/e/2PACX-1vSf1tIWGcTniLmJtr2CCElkstlY1VKBf6tLZOQwqUuxIzNeDkxQo0KDThrDY3Cgc1EcIaWMKA4BKS37/pub?gid=204872942&single=true&output=csv`
- **Environment:** Production, Preview, Development

3. **Redeploy:** Después de añadir las variables, hacer clic en "Redeploy" para aplicar los cambios.

### Cómo Obtener las URLs de CSV

1. Abre tu Google Sheet
2. Ve a **Archivo → Compartir → Publicar en la web**
3. Selecciona la hoja específica (CARTA o VINOS)
4. Elige formato: **Valores separados por comas (.csv)**
5. Haz clic en **Publicar**
6. Copia la URL generada
7. Pega la URL en la variable de entorno correspondiente en Vercel

---

## Contacto y Soporte

Si tienes problemas o preguntas sobre el sistema:

- **Email técnico:** [insertar email del equipo técnico]
- **Teléfono:** [insertar teléfono]

---

## Resumen Rápido

✅ **Editar platos:** Modificar directamente en Google Sheets
✅ **Ocultar platos:** Cambiar `disponible` a `FALSE`
✅ **Añadir platos:** Copiar fila existente y modificar datos
✅ **Precios:** Usar números con punto (ej: `9.50`), sin símbolo €
✅ **Actualización:** Hasta 1 hora para ver cambios en la web
❌ **NO cambiar** nombres de columnas
❌ **NO usar** comas en precios

---

**Última actualización:** Enero 2026
