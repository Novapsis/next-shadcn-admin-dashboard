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