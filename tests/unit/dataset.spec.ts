import { describe, it, expect } from 'vitest';
import { mockProducts } from '@/data/products.mock';
import { mockCategories } from '@/data/categories.mock';
import { mockBrands } from '@/data/brands.mock';
import { mockColors } from '@/data/colors.mock';

describe('Mock Dataset & Types Integrity', () => {
  it('has at least 24 products with unique IDs', () => {
    expect(mockProducts.length).toBeGreaterThanOrEqual(24);
    const ids = new Set(mockProducts.map((p) => p.id));
    expect(ids.size).toBe(mockProducts.length);
  });

  it('all products have valid prices, images, ratings and stock', () => {
    mockProducts.forEach((product) => {
      expect(product.name).toBeTruthy();
      expect(product.brand).toBeTruthy();
      expect(product.price).toBeGreaterThan(0);
      expect(product.rating).toBeGreaterThanOrEqual(1);
      expect(product.rating).toBeLessThanOrEqual(5);
      expect(product.images.length).toBeGreaterThan(0);
      expect(product.colors.length).toBeGreaterThan(0);
      expect(product.sizes.length).toBeGreaterThan(0);
      expect(product.details.length).toBeGreaterThan(0);
      expect(typeof product.inStock).toBe('boolean');
    });
  });

  it('has categories, brands and colors metadata defined', () => {
    expect(mockCategories.length).toBeGreaterThanOrEqual(6);
    expect(mockBrands.length).toBeGreaterThanOrEqual(6);
    expect(mockColors.length).toBeGreaterThanOrEqual(8);
  });
});
