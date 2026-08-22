import type { Product, ProductColor, ProductSize } from '@/types/catalog';

export interface CartItem {
  id: string; // Unique combination of productId-colorId-size
  product: Product;
  selectedColor: ProductColor;
  selectedSize: ProductSize;
  quantity: number;
  unitPrice: number;
}
