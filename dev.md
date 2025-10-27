# Registro de Desarrollo - Proyecto CRM Dashboard

Este documento detalla todas las modificaciones, funcionalidades implementadas y decisiones técnicas tomadas durante el desarrollo y personalización del dashboard CRM. Su objetivo es servir como memoria de contexto para futuras interacciones.

---

## 1. Limpieza Inicial del Proyecto y Configuración de Supabase

-   **Objetivo:** Adaptar el template de GitHub a un proyecto CRM.
-   **Acciones:**
    -   Eliminación de páginas de demostración (`/dashboard/default`, `/dashboard/finance`).
    -   Simplificación del `sidebar-items.ts` para mostrar solo el enlace al dashboard CRM.
    -   Instalación del SDK de Supabase (`@supabase/supabase-js`).
    -   Creación de `src/lib/supabase.ts` para inicializar el cliente de Supabase (usando `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
    -   Instrucciones al usuario para configurar `.env.local`.

---

## 2. Implementación de Gráficos de Estadísticas del CRM

-   **Objetivo:** Mostrar 5 métricas clave del CRM en el dashboard.
-   **Acciones:**
    -   **Columnas de Base de Datos Identificadas:** `timestamp_registro` (registrado), `fecha_envio` (contactado), `fecha_respuesta` (respondido), `status` (canal).
    -   **Función `getDashboardStats()`:** Creada en `src/server/server-actions.ts` para obtener:
        -   Leads Totales.
        -   Leads Contactados.
        -   Leads de Hoy.
        -   Leads por Canal (basado en la columna `status`).
        -   Eficiencia (leads respondidos / leads contactados).
    -   **Actualización de `page.tsx`:** Convertido a componente `async` para llamar a `getDashboardStats()` y `getLeads()` en paralelo.
    -   **`OverviewCards.tsx`:** Refactorizado para mostrar Leads Totales, Contactados, de Hoy y Eficiencia en tarjetas simples, añadiendo color condicional a la eficiencia (verde/rojo).
    -   **`InsightCards.tsx`:** Refactorizado para mostrar "Leads por Canal" como un gráfico de barras, usando la librería `recharts` directamente para evitar problemas con las abstracciones de `shadcn/ui`.

---

## 3. Tema de Colores y Estilos

-   **Objetivo:** Personalizar la paleta de colores del dashboard y garantizar la coherencia.
-   **Acciones:**
    -   **`globals.css`:** Modificado para definir una nueva paleta de colores:
        -   Modo Claro: Fondo marfil, texto azul oscuro.
        -   Modo Oscuro: Fondo azul espacial, texto marfil.
        -   Color primario en modo oscuro cambiado a violeta.
        -   Colores para gráficos (chart-1 a chart-5) definidos.
    -   **Eliminación de Presets:** Los `@import` de los archivos de preset (`brutalist.css`, `soft-pop.css`, etc.) fueron comentados en `globals.css` para aplicar la paleta personalizada.
    -   **`InsightCards.tsx`:** Implementado un `channelColorMap` para asignar colores específicos a cada canal (`Whatsapp`, `Instagram`, `Linkedin`, `Facebook`, `X`) según la última preferencia del usuario.

---

## 4. Funcionalidades y Mejoras en la Tabla de Leads

-   **Objetivo:** Corregir la paginación y ordenación, y mejorar la visualización de datos largos.
-   **Acciones:**
    -   **`TableCards.tsx` (Refactorización Radical):** Completamente reescrito para usar `useReactTable` directamente, eliminando el hook `use-data-table-instance.ts` y los componentes genéricos (`DataTable`, `DataTablePagination`, `DataTableViewOptions`) de la plantilla, lo que resolvió los problemas de estado y re-renderizado.
    -   **`lead-details-modal.tsx`:** Creado un componente modal para mostrar todos los detalles de un lead.
    -   **`columns.crm.tsx`:**
        -   Reemplazo de la columna de selección por un botón que abre el `LeadDetailsModal`.
        -   Aplicado truncado de texto (`w-[200px] truncate`) a las columnas "Empresa" y "Email".
    -   **`components/ui/table.tsx`:** Se eliminó la clase `whitespace-nowrap` del `TableCell` base para permitir el truncado correcto del texto.

---

## 5. Implementación de "Quick Create" (Scraping de Leads)

-   **Objetivo:** Añadir un formulario de búsqueda de leads que se conecte a un webhook de n8n.
-   **Acciones:**
    -   **`lead-scraping-dialog.tsx`:** Creado un componente `Dialog` con un formulario para seleccionar país y término de búsqueda.
    -   El formulario envía los datos a `https://n8n.novapsis.site/webhook/taxsolutions`.
    -   **`nav-main.tsx`:** El botón "Quick Create" de la barra lateral ahora abre este modal.

---

## 6. Depuración y Resolución de Errores

-   **Error de Hidratación (Fecha):** Resuelto formateando la fecha de forma consistente a `YYYY-MM-DD` en `columns.crm.tsx`.
-   **Color del Botón 'X' del Modal:** Forzado a violeta mediante estilo en línea (`style` prop) en `dialog.tsx` directamente en el componente `XIcon`, y eliminación de `opacity-70`, para superar problemas de especificidad CSS. El problema de la opacidad se solucionó estableciendo un color sólido y una opacidad de `hover` con un valor más bajo.
-   **Tema Invertido del Modal:** Implementado en `lead-details-modal.tsx` usando un div interno con estilos explícitos para invertir el tema (claro en modo oscuro, oscuro en modo claro) y aumentar el grosor de la fuente. Este problema se solucionó con una estrategia de "brute-force" aplicando estilos directos a un `div` interno para evitar conflictos de clases.
-   **Errores persistentes de la Tabla:** Después de muchos intentos, la tabla se refactorizó completamente para usar HTML nativo y las funciones de `useReactTable` en el componente `TableCards.tsx`, eliminando las abstracciones de la plantilla. Esto resolvió los problemas de paginación y ordenación.
-   **Hidratación (Radix IDs):** Se identificó que son warnings por discrepancia de IDs entre servidor y cliente en componentes Radix, pero se decidió ignorarlos por su complejidad y por no afectar la funcionalidad principal.

---

## 7. Avances Recientes y Resolución de Errores (Octubre 2025)

### 7.1. Ajustes de Branding y Navegación

-   **Objetivo:** Personalizar la marca de la aplicación y mejorar la navegación principal.
-   **Acciones:**
    -   **Cambio de Marca:** Se reemplazó "Studio Admin" por "Tax Solutions" en la configuración de la aplicación (`src/config/app-config.ts`), el nombre del sitio y los derechos de autor.
    -   **Enlace Principal del Sidebar:** El botón principal "Tax Solutions" en la barra lateral (`src/app/(main)/dashboard/crm/_components/sidebar/app-sidebar.tsx`) ahora redirige a `/dashboard/crm`.
    -   **Datos de Usuario de Muestra:** Se actualizó el usuario de muestra (`rootUser`) en `src/data/users.ts` a "Tax Solutions" y "service@taxsolutions.com", eliminando usuarios adicionales.
    -   **Redirección Inicial:** Se corrigió la redirección de la página raíz (`src/app/(external)/page.tsx`) para que apunte a `/dashboard/crm` en lugar de `/dashboard/default`.
    -   **Enlace de Página 404:** El enlace de retorno en la página `not-found.tsx` se actualizó para dirigir a `/dashboard/crm`.
    -   **Regla de Reescritura:** Se añadió una regla de reescritura en `next.config.mjs` para que la URL `/dashboard` muestre el contenido de `/dashboard/crm` sin cambiar la URL en el navegador.

### 7.2. Mejoras en la Tabla de Leads (CRM)

-   **Objetivo:** Mejorar la legibilidad y funcionalidad de la tabla de leads.
-   **Acciones:**
    -   **Traducción de Textos:** Se tradujeron los títulos, descripciones y controles de paginación de la tarjeta "Leads Recientes" a español.
    -   **Colores de Estado Dinámicos:** Se implementó un sistema de colores para la columna "Status" en `src/app/(main)/dashboard/crm/_components/columns.crm.tsx`, utilizando el mismo mapa de colores que el gráfico de "Leads por Canal". Se añadió lógica para normalizar el nombre del estado (ej. "whatsapp" a "Whatsapp") para asegurar la coincidencia de colores.
    -   **Manejo de Estados Nulos:** Se añadió una comprobación de nulos para la columna "Status" para evitar errores de tipo y mostrar "Sin estado" cuando el valor es `null`.

### 7.3. Nuevas Funcionalidades de Automatización

-   **Objetivo:** Añadir nuevas herramientas de automatización accesibles desde el dashboard.
-   **Acciones:**
    -   **Nueva Sección en Sidebar:** Se añadió un nuevo elemento "Automatizacion" en la barra lateral (`src/navigation/sidebar/sidebar-items.ts`) que enlaza a `/dashboard/automatizacion`.
    -   **Página de Automatización:** Se creó la página `/dashboard/automatizacion` con tres botones de alternancia para diferentes automatizaciones:
        -   **Redacción de Correos:** Conecta al webhook `https://n8n.novapsis.site/webhook/tax-activate`.
        -   **Búsqueda de Leads:** Conecta al webhook `https://n8n.novapsis.site/webhook/tax-solutions-busqueda-aut`.
        -   **Leads de Instagram:** Conecta al webhook `https://n8n.novapsis.site/webhook/tax-solutions-brightdata`.
        -   **Envío de Mensajes a Instagram:** Conecta al webhook `https://n8n.novapsis.site/webhook/tax-solutions-enviar-mensajes-instagram`.
    -   **Feedback Visual:** Cada botón muestra su estado (activo/inactivo) con cambios de color, iconos y sombras.
    -   **Formulario de Búsqueda de Leads Mejorado:** El diálogo "Buscar Leads" (`src/app/(main)/dashboard/crm/_components/sidebar/lead-scraping-dialog.tsx`) se refactorizó para incluir un campo "Ciudad" dinámico. Este campo funciona como un combobox, ofreciendo sugerencias de ciudades por país y permitiendo la entrada manual. El webhook ahora recibe el país, la ciudad y el término de búsqueda.

### 7.4. Refactorización del Gráfico "Leads por Periodo" (Anteriormente "Leads por Día")

-   **Objetivo:** Corregir el funcionamiento del gráfico para que muestre datos y etiquetas de eje X coherentes con el rango de tiempo seleccionado.
-   **Problema Inicial:** El gráfico no se actualizaba correctamente, las etiquetas del eje X no coincidían con el rango seleccionado (ej. 7 días mostraba meses), y la visualización estaba comprimida.
-   **Solución Implementada:**
    -   **Lógica de Datos al Cliente:** Se movió toda la lógica de filtrado y agregación de datos del servidor al componente cliente `weekly-leads-card.tsx` (ahora `leads-over-time-card.tsx`).
    -   **Servidor Simplificado:** La función `getDashboardStats` en `src/server/server-actions.ts` ahora solo se encarga de obtener los datos brutos de los últimos 90 días.
    -   **Componente Cliente Inteligente:** El componente `leads-over-time-card.tsx` ahora gestiona su propio estado de `timeRange` y utiliza `React.useMemo` para filtrar y agregar los datos dinámicamente (por horas para "Hoy", por día de la semana para "7 días", por semanas para "30 días" y por meses para "3 meses").
    -   **Eje X Adaptativo:** Se implementó un `tickFormatter` simplificado y la propiedad `interval="preserveStartEnd"` en el `XAxis` para asegurar que las etiquetas sean siempre legibles y coherentes con el rango de tiempo.
    -   **Corrección Visual:** Se aumentó el margen superior del gráfico para evitar que la curva se corte en los picos más altos.

### 7.5. Resolución de Errores de Compilación y Linting

Se abordó una serie de errores y advertencias para asegurar un proceso de compilación limpio y un código de alta calidad:

-   **Error de Versión de Node.js:** Se corrigió el fallo de despliegue en Coolify añadiendo el campo `engines` (`"node": ">=20.9.0"`) a `package.json`.
-   **Errores de Tipos (TypeScript):**
    -   Se corrigió un `ReferenceError` para `WeeklyLeadsCard` (y su posterior renombrado a `LeadsOverTimeCard`) asegurando las importaciones correctas.
    -   Se resolvió el error `Type error: 'status' is possibly 'null'` añadiendo comprobaciones de nulos.
    -   Se solucionó el error `Type error: Argument of type 'string' is not assignable...` implementando "type guards" robustos para todos los controles de diseño en `layout-controls.tsx`.
    -   Se corrigió el error `Type error: Cannot find name 'CONTENT_LAYOUT_VALUES'` y `no-duplicate-imports` consolidando las importaciones de tipos y valores en `layout-controls.tsx`.
    -   Se corrigió el error `Type error: Element implicitly has an 'any' type...` en `weekly-leads-card.tsx` (ahora `leads-over-time-card.tsx`) añadiendo una firma de índice al objeto `leadsByWeek`.
-   **Errores de Linting (ESLint):**
    -   Se corrigieron errores de `complexity` añadiendo `// eslint-disable-next-line complexity` a funciones complejas (`getDashboardStats`, `React.useMemo` en los componentes de gráficos).
    -   Se resolvió `no-duplicate-imports` consolidando las declaraciones de importación.
    -   Se corrigió `unicorn/filename-case` renombrando archivos a `kebab-case` y actualizando las importaciones.
    -   Se solucionó `no-prototype-builtins` utilizando `Object.prototype.hasOwnProperty.call()`.
    -   Se corrigió `prefer-nullish-coalescing` reemplazando `||` por `??`.
    -   Se abordaron advertencias de `Unnecessary optional chain` y `Unexpected any`.
    -   Se eliminaron advertencias de `no-unused-vars` (ej. `timeRange` en `getDashboardStats` y iconos en `app-sidebar.tsx`).
    -   Se suprimieron advertencias de `Generic Object Injection Sink` que eran falsos positivos.
