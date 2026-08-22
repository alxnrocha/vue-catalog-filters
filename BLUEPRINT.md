# BLUEPRINT.md — Projeto 17: Aurelia Atelier (Vue Catálogo & Filtros Dinâmicos)

- **Nicho:** E-commerce / Catálogo de Vestuário de Luxo com Busca Facetada.
- **Repositório GitHub:** `https://github.com/alxnrocha/vue-catalog-filters` · **Pasta Local:** `17-vue-catalog-filters/`
- **Marco Técnico:** Gestão de estado em Vue 3.5+ com Pinia (Setup Stores), rotas com sincronização bidirecional de query params (deep linking) e validação de formulários com VeeValidate + Zod.

---

## 1. Arquitetura & Estrutura de Pastas

```text
17-vue-catalog-filters/
├── src/
│   ├── assets/                 # Estilos globais Tailwind v4 e fontes
│   ├── components/
│   │   ├── catalog/            # ActiveFilterChips.vue, FilterSidebar.vue, MobileFilterDrawer.vue, PriceRangeSlider.vue, ProductCard.vue, ProductGrid.vue, SortDropdown.vue, ViewToggle.vue
│   │   ├── checkout/           # CheckoutDrawer.vue, CheckoutForm.vue, OrderSuccessModal.vue
│   │   ├── common/             # AppHeader.vue, AppFooter.vue, CommandPalette.vue, Badge.vue, BaseButton.vue, BaseInput.vue
│   │   └── quickview/          # QuickViewModal.vue, ProductGallery.vue
│   ├── composables/            # useCatalogUrlSync.ts, useDebounce.ts, useFilterCounts.ts, useWishlist.ts
│   ├── data/                   # products.mock.ts, categories.mock.ts, brands.mock.ts, colors.mock.ts
│   ├── router/                 # index.ts (Vue Router com rotas do catálogo e sincronização)
│   ├── stores/                 # useCatalogStore.ts, useCartStore.ts, useWishlistStore.ts
│   ├── types/                  # catalog.ts, cart.ts, filter.ts
│   ├── App.vue                 # Shell raiz da aplicação
│   └── main.ts                 # Bootstrap Vue + Pinia + Vue Router + Tailwind
├── tests/
│   ├── unit/                   # useCatalogStore.spec.ts, useCatalogUrlSync.spec.ts, ProductCard.spec.ts, FilterSidebar.spec.ts
├── .github/workflows/          # deploy.yml (CI/CD GitHub Pages)
├── design/                     # PROMPTS.md, mockup.png
├── docs/                       # PROJECT_ROADMAP.md, GOAL_PROMPT.md
├── .gitignore
├── BLUEPRINT.md
├── DECISIONS.md
├── index.html
├── package.json
├── README.md
├── STATUS_PROGRESSO.md
├── tsconfig.json
└── vite.config.ts
```

---

## 2. Stack Tecnológica
- **Framework:** Vue 3.5+ (`<script setup>`, Composition API nativa).
- **TypeScript:** 5.7+ com tipagem estrita de DTOs e stores.
- **Vite:** 6.1+ com plugin `@vitejs/plugin-vue` e `@tailwindcss/vite`.
- **CSS:** Tailwind CSS v4 com design tokens obsidian e âmbar.
- **Gerenciamento de Estado:** Pinia 3.0 (Setup Stores com `ref`, `computed` e ações).
- **Roteamento:** Vue Router 4 com sincronização bidirecional de query params.
- **Formulários:** VeeValidate 4 + `@vee-validate/zod` + Zod 3.24.
- **Ícones:** Lucide Vue Next (`lucide-vue-next`).
- **Composables:** `@vueuse/core` (`useLocalStorage`, `useScrollLock`, `useWindowSize`).
- **Testes:** Vitest + `@vue/test-utils` + happy-dom.
- **Linter:** Oxlint.

---

## 3. Modelo de Dados & Tipos TypeScript

### 1. `Product`
```typescript
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'chaquetas' | 'camisetas' | 'pantalones' | 'vestidos' | 'calzado' | 'accesorios';
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  features: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  inStock: boolean;
  stockCount: number;
  images: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  createdAt: string;
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  imageThumbnail?: string;
}

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
```

### 2. `CatalogFilters`
```typescript
export interface CatalogFilters {
  search: string;
  category: string; // 'all' ou categoria específica
  minPrice: number;
  maxPrice: number;
  colors: string[]; // array de IDs de cores
  sizes: ProductSize[]; // array de tamanhos
  minRating: number; // 0, 3, 4, 4.5
  brands: string[]; // array de nomes de marcas
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sortBy: 'popularity' | 'price-asc' | 'price-desc' | 'newest' | 'rating-desc';
  viewMode: 'grid' | 'list';
  page: number;
  itemsPerPage: number;
}
```

---

## 4. Diferenciais Técnicos
1. **Sincronização Bidirecional de URL:** Qualquer alteração nos filtros reflete instantaneamente nos parâmetros da URL (`?category=chaquetas&minPrice=100&maxPrice=500&color=negro&sort=price-asc`) e navegar no histórico do navegador (voltar/avançar) ou colar a URL restaura o estado exato.
2. **Dual-Handle Price Slider:** Slider de alcance contínuo sem dependências externas pesadas, suave e reativo.
3. **Quick View & Carrinho Reativo:** Modal com galeria e carrinho deslizante com cálculo de frete grátis progressivo.
4. **Checkout Simulado com Zod:** Validação completa de formulário em múltiplos passos com feedback visual imediato.
