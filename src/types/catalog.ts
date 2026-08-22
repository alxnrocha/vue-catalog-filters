export type ProductCategory =
  | 'chaquetas'
  | 'camisetas'
  | 'pantalones'
  | 'vestidos'
  | 'calzado'
  | 'accesorios';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Única';

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  thumbnail?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number | null;
  discountPercentage?: number | null;
  rating: number;
  reviewsCount: number;
  description: string;
  details: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  inStock: boolean;
  stockCount: number;
  images: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  createdAt: string;
}

export type SortOption =
  | 'popularity'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'rating-desc';

export type ViewMode = 'grid' | 'list';

export interface CatalogFilters {
  search: string;
  category: string; // 'all' | ProductCategory
  minPrice: number;
  maxPrice: number;
  colors: string[]; // Color IDs
  sizes: ProductSize[];
  minRating: number; // 0, 3, 4, 4.5
  brands: string[];
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sortBy: SortOption;
  viewMode: ViewMode;
  page: number;
  itemsPerPage: number;
}

export interface CategoryMeta {
  id: string;
  label: string;
  count: number;
}

export interface BrandMeta {
  id: string;
  name: string;
  count: number;
}

export interface ColorMeta {
  id: string;
  name: string;
  hex: string;
  count: number;
}
