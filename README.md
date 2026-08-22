<div align="center">

# ✦ AURELIA ATELIER ✦
### Luxury Fashion E-Commerce Catalog & Dynamic Faceted Filter Engine

Plataforma de comercio electrónico de alta costura diseñada con **Vue 3.5**, **TypeScript**, **Tailwind CSS v4**, **Pinia** y **Vue Router**. Incorpora un motor de filtrado multifacetado reactivo en tiempo real, sincronización bidireccional de parámetros URL, paleta de comandos `⌘K`, modal interactivo de vista rápida, bolsa de compra deslizante y flujo de checkout simulado con validación de esquemas.

---

[![Vue 3.5](https://img.shields.io/badge/Vue-3.5.13-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Pinia](https://img.shields.io/badge/Pinia-3.0.1-FFE564?style=for-the-badge&logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![Vue Router](https://img.shields.io/badge/Vue_Router-4.5.0-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://router.vuejs.org/)
[![VeeValidate](https://img.shields.io/badge/VeeValidate-4.15.0-FF5F56?style=for-the-badge&logo=v&logoColor=white)](https://vee-validate.logaretm.com/)
[![Zod](https://img.shields.io/badge/Zod-3.24.2-3068B7?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-3.2.7-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Oxlint](https://img.shields.io/badge/Oxlint-Fast_Linter-EA580C?style=for-the-badge&logo=rust&logoColor=white)](https://oxc.rs/)
[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

</div>

---

## 🌟 Características Principales

### 🔍 1. Motor de Filtrado Multifacetado en Tiempo Real
- **Cruce Dinámico de Facetas:** Los contadores numéricos de categorías, marcas, colores y tallas se recalculan en tiempo real según el cruce exacto de todos los filtros activos (estilo *Algolia* / *Shopify Plus*).
- **Control Deslizante de Precio:** Slider dual de rango de precio con alças independientes y cálculo continuo de porcentaje.
- **Muestrarios de Color Interactivos:** Filtros visuales por muestras cromáticas de alta costura con cambio instantáneo de preview en las tarjetas.
- **Chips de Filtros Activos:** Barra superior de etiquetas removibles de forma individual o con limpieza global (*Clear All*).

### 🔗 2. Sincronización Bidireccional de URL (`useCatalogUrlSync`)
- Cada filtro aplicado se sincroniza automáticamente en la barra de direcciones del navegador (`?category=chaquetas&minPrice=200&brand=Acne+Studios`).
- Permite compartir enlaces con filtros específicos, restaurar el estado completo al recargar la página o navegar mediante el historial (*Back/Forward*).

### ⚡ 3. Paleta de Comandos Global (`CommandPalette.vue`)
- Acceso instantáneo mediante el atajo de teclado universal **`⌘K`** (macOS) o **`Ctrl+K`** (Windows/Linux).
- Búsqueda preditiva en tiempo real por nombre, marca, descripción y composición textil.
- Historial de búsquedas recientes persistente y navegación fluida por teclado (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`).

### 💎 4. Tarjetas de Producto y Vista Rápida (`QuickViewModal.vue`)
- **Modos de Visualización:** Conmutador de cuadrícula (*Grid View*) y lista (*List View*).
- **Previsualización de Color:** Al pasar el cursor sobre las muestras de color en la tarjeta, la imagen del producto cambia dinámicamente.
- **Modal Quick View:** Galería de alta definición con sangría completa, miniaturas flotantes con efecto translúcido, selector de talla con guía de medidas, contador de stock reactivo y cálculo matemático de estrellas fracionarias.

### 🛍️ 5. Bolsa de Compra y Checkout Simulado
- **Bolsa Deslizante (`CartDrawer.vue`):** Control de cantidades, barra de progreso para envío gratis (a partir de 100€) y motor de cupones de descuento (cupón activo: `AURELIA20` para un 20% de descuento adicional).
- **Checkout en 3 Pasos (`CheckoutDrawer.vue`):** Validación reactiva de campos mediante **VeeValidate** y esquemas **Zod** (Datos de envío, Método de pago seguro con tarjeta/Apple Pay y Confirmación de pedido con número de orden generado).

---

## 🏗️ Arquitectura del Proyecto

```
17-vue-catalog-filters/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Pipeline CI/CD (Oxlint, Vitest, Build & Deploy)
├── src/
│   ├── assets/
│   │   └── base.css                # Tokens de diseño y variables CSS de Tailwind v4
│   ├── components/
│   │   ├── cart/
│   │   │   └── CartDrawer.vue      # Bolsa de compras lateral
│   │   ├── catalog/
│   │   │   ├── ActiveFilterChips.vue # Chips de filtros activos removibles
│   │   │   ├── CatalogToolbar.vue  # Barra de herramientas (conteo, orden y vista)
│   │   │   ├── FilterSidebar.vue   # Barra lateral de filtros multifacetados
│   │   │   ├── MobileFilterDrawer.vue # Filtros móviles en panel deslizante
│   │   │   ├── PriceRangeSlider.vue # Slider de doble rango de precio
│   │   │   ├── ProductCard.vue     # Tarjeta de producto (Grid/List & Swatches)
│   │   │   └── ProductGrid.vue     # Cuadrícula de productos con paginación
│   │   ├── checkout/
│   │   │   └── CheckoutDrawer.vue  # Checkout simulado con VeeValidate + Zod
│   │   ├── common/
│   │   │   ├── AppFooter.vue       # Pie de página institucional
│   │   │   ├── AppHeader.vue       # Cabecera con buscador y accesos directos
│   │   │   └── CommandPalette.vue  # Modal de búsqueda rápida (⌘K)
│   │   └── quickview/
│   │       ├── ProductGallery.vue  # Galería de imágenes de alta resolución
│   │       └── QuickViewModal.vue  # Modal interactivo de detalle de producto
│   ├── composables/
│   │   └── useCatalogUrlSync.ts    # Sincronización bidireccional URL <-> Store
│   ├── data/
│   │   ├── brands.mock.ts          # Metadatos de marcas de lujo
│   │   ├── categories.mock.ts      # Metadatos de categorías
│   │   ├── colors.mock.ts          # Paleta cromática y códigos HEX
│   │   └── products.mock.ts        # Catálogo curado de 48 prendas exclusivas
│   ├── router/
│   │   └── index.ts                # Configuración de rutas con Vue Router 4
│   ├── stores/
│   │   ├── useCartStore.ts         # Estado de la bolsa de compras y cupones
│   │   ├── useCatalogStore.ts      # Estado principal del catálogo y filtros
│   │   └── useWishlistStore.ts     # Lista de favoritos con persistencia local
│   ├── types/
│   │   └── catalog.ts              # Definiciones de tipos TypeScript del dominio
│   ├── views/
│   │   └── CatalogView.vue         # Vista principal del catálogo
│   ├── App.vue                     # Componente raíz
│   └── main.ts                     # Punto de entrada de la aplicación
├── tests/
│   └── unit/                       # 17 suites de pruebas unitarias con Vitest
├── vite.config.ts                  # Configuración de Vite con Tailwind v4
└── tsconfig.json                   # Configuración estricta de TypeScript 5.7
```

---

## 🛠️ Tecnologías y Librerías

| Tecnología | Versión | Propósito |
| :--- | :--- | :--- |
| **Vue** | `v3.5.13` | Framework reactivo utilizando Composition API y `<script setup>` |
| **TypeScript** | `v5.7.3` | Tipado estático estricto en toda la capa de datos y componentes |
| **Vite** | `v6.4.3` | Entorno de desarrollo y empaquetador de producción ultra-rápido |
| **Tailwind CSS** | `v4.0.0` | Sistema de diseño de alta costura mediante `@tailwindcss/vite` |
| **Pinia** | `v3.0.1` | Gestión de estado global modular (`catalog`, `cart`, `wishlist`) |
| **Vue Router** | `v4.5.0` | Enrutamiento SPA y sincronización de query parameters |
| **VeeValidate + Zod** | `v4.15` / `v3.24` | Validación reactiva de esquemas y formularios en checkout |
| **@vueuse/core** | `v12.5.0` | Utilidades composables para almacenamiento local y atajos de teclado |
| **Lucide Vue Next** | `v1.16.0` | Iconografía vectorial minimalista |
| **Vitest** | `v3.2.7` | Framework de pruebas unitarias de alto rendimiento |
| **@vue/test-utils** | `v2.4.6` | Utilidades para pruebas de componentes Vue |
| **Oxlint** | `Latest` | Linter estático basado en Rust con cero falsos positivos |

---

## 🚀 Instalación y Uso Local

### Prerrequisitos
- **Node.js**: `v20.x` o superior
- **npm**: `v10.x` o superior

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/alxnrocha/vue-catalog-filters.git

# 2. Acceder al directorio
cd vue-catalog-filters/17-vue-catalog-filters

# 3. Instalar dependencias
npm install

# 4. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 🧪 Pruebas Unitarias y Calidad de Código

El proyecto cuenta con una cobertura integral de pruebas que validan la lógica de negocio, los estados reactivos de Pinia y el comportamiento de los componentes de la interfaz.

```bash
# Ejecutar la suite completa de pruebas unitarias
npm test

# Ejecutar el linter Oxlint
npm run lint

# Compilar y validar tipos con TypeScript
npm run build
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE).

---

<div align="center">
Desarrollado con pasión para la excelencia en ingeniería frontend.
</div>
