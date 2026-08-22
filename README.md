# Aurelia Atelier — Catálogo de Moda de Lujo y Motor de Filtrado Multifacetado con Vue 3.5 & Pinia

<div align="center">

![Vue 3.5](https://img.shields.io/badge/Vue-3.5%2B-42b883?style=for-the-badge&logo=vue.js&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-3.0-ffd859?style=for-the-badge&logo=pinia&logoColor=black)
![Vue Router](https://img.shields.io/badge/Vue_Router-4.5-42b883?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Vitest](https://img.shields.io/badge/Tested_with-Vitest-FCC72B?style=for-the-badge&logo=vitest&logoColor=black)
![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages-22C55E?style=for-the-badge&logo=github&logoColor=white)

**Plataforma de comercio electrónico de alta costura con motor de filtrado multifacetado dinámico en tiempo real, sincronización bidireccional de parámetros URL con Vue Router y estética Obsidian & Amber Gold.**

[🚀 Demo en Vivo](https://alxnrocha.github.io/vue-catalog-filters/) • [📂 Repositorio en GitHub](https://github.com/alxnrocha/vue-catalog-filters)

</div>

---

## 🏛️ Arquitectura de Estado Reactivo (Pinia & Vue Router)

```mermaid
graph TD
    subgraph UI_Components [Componentes de Interfaz de Usuario]
        Header[AppHeader & CommandPalette ⌘K]
        Sidebar[FilterSidebar & MobileFilterDrawer]
        Grid[ProductGrid & ProductCard]
        QuickView[QuickViewModal & ProductGallery]
        Cart[CartDrawer & CheckoutDrawer]
        Chips[ActiveFilterChips & CatalogToolbar]
    end

    subgraph Pinia_Stores [Stores Centrales de Pinia]
        CatStore[useCatalogStore: Catálogo, Facetas & Filtros]
        CartStore[useCartStore: Carrito, Cupones & Totales]
        WishStore[useWishlistStore: Favoritos]
    end

    subgraph Routing_Sync [Servicios de Sincronización & Persistencia]
        UrlSync[useCatalogUrlSync / Vue Router 4]
        Storage[useLocalStorage / LocalStorage]
    end

    Header -->|Buscar ⌘K / Abrir Bolsa| CatStore
    Sidebar -->|Filtrar Categoría / Marca / Precio| CatStore
    Chips -->|Remover Filtro / Reset| CatStore
    Grid -->|Abrir QuickView / Favoritos| QuickView
    Grid -->|Añadir a Favoritos| WishStore
    QuickView -->|Añadir al Carrito| CartStore
    Cart -->|Finalizar Compra| CartStore

    CatStore <-->|Sincronización Bidireccional Query Params| UrlSync
    WishStore <-->|Persistencia Favoritos| Storage
    CartStore <-->|Persistencia Bolsa de Compra| Storage
```

---

## ✨ Características Principales

1. **🎨 Sistema de Diseño Obsidian & Amber Gold (Tailwind CSS v4):**
   - Paleta curada con fondo Obsidian Slate (`#070A10`), microbordes metálicos (`border-zinc-800/80`), acentos en Oro Ámbar (`#F59E0B`), tipografía *Playfair Display* e *Inter*.

2. **🔍 Motor de Filtrado Multifacetado en Tiempo Real (`useCatalogStore.ts`):**
   - Recálculo algorítmico de existencias por faceta (categoría, marca, talla, color), slider de doble rango de precio independiente (€50 - €1.000) y chips de filtros activos removibles.

3. **🔗 Sincronización Bidireccional de URL (`useCatalogUrlSync.ts`):**
   - Sincronización automática de filtros en query string con **Vue Router 4** para compartir búsquedas y conservar estado.

4. **⚡ Paleta de Comandos Global (`CommandPalette.vue`):**
   - Acceso instantáneo con el atajo **`⌘K`** / **`Ctrl+K`** con búsqueda predictiva en 48 piezas de catálogo.

5. **💎 Tarjetas de Producto y Vista Rápida (`QuickViewModal.vue`):**
   - Conmutador Grid/List, previsualización de muestras de color y modal Quick View con altura áurea fija (`h-[600px]`).

6. **🛍️ Bolsa Deslizante & Checkout en 3 Pasos:**
   - Drawer de carrito con cálculo de envío gratis, cupones (`AURELIA20`) y checkout simulado validado con **VeeValidate + Zod**.

---

## 🗂️ Estructura del Proyecto

```text
17-vue-catalog-filters/
├── src/
│   ├── components/
│   │   ├── cart/                      # CartDrawer.vue
│   │   ├── catalog/                   # FilterSidebar, ProductGrid, PriceRangeSlider
│   │   ├── checkout/                  # CheckoutDrawer.vue
│   │   ├── common/                    # AppHeader, AppFooter, CommandPalette
│   │   └── quickview/                 # QuickViewModal, ProductGallery
│   ├── composables/                   # useCatalogUrlSync.ts
│   ├── data/                          # products.mock.ts (48 prendas exclusivas)
│   ├── router/                        # Vue Router 4
│   ├── stores/                        # useCatalogStore, useCartStore, useWishlistStore
│   ├── types/                         # Tipos TypeScript
│   ├── App.vue
│   └── main.ts
├── tests/                             # 44 pruebas unitarias con Vitest
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- Node.js `>= 20.0.0`
- npm `>= 10.0.0`

### Ejecución Local
```bash
# 1. Clonar el repositorio
git clone https://github.com/alxnrocha/vue-catalog-filters.git
cd vue-catalog-filters

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Ejecutar suite de pruebas unitarias (44 tests)
npm test

# 5. Compilar para producción
npm run build
```

---

## 🛠️ Tecnologías Utilizadas

| Capa | Tecnología | Aspectos Clave |
|---|---|---|
| **Framework** | Vue 3.5 | Composition API, `<script setup>`, Reactividad nativa |
| **Enrutamiento** | Vue Router 4.5 | Sincronización bidireccional de parámetros query en URL |
| **Estado Global** | Pinia 3.0 | Stores modulares para catálogo, carrito y favoritos |
| **Lenguaje** | TypeScript 5.8 | Tipado estricto para entidades de alta costura |
| **Validación** | VeeValidate, Zod 3.24 | Validación reactiva del formulario de checkout |
| **Estilos** | Tailwind CSS v4 | Obsidian & Amber Gold, diseño responsive |
| **Testing** | Vitest, @vue/test-utils | 44 pruebas unitarias de facetas y cálculos |
| **Despliegue** | GitHub Pages | Despliegue estático continuo y optimizado |

---

<div align="center">
  <sub>Desarrollado con dedicación por <a href="https://github.com/alxnrocha">Alex Rocha</a> • Proyecto 17 del Portafolio Profesional Frontend.</sub>
</div>
