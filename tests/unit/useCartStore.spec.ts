import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCartStore } from '@/stores/useCartStore';
import { mockProducts } from '@/data/products.mock';

describe('useCartStore Pinia Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('adds items and calculates subtotal and totals correctly', () => {
    const store = useCartStore();
    store.clearCart();

    const product = mockProducts[0]; // Price 480
    store.addItem(product, product.colors[0], 'M', 2);

    expect(store.totalItemsCount).toBe(2);
    expect(store.subtotal).toBe(960);
    expect(store.isFreeShipping).toBe(true);
    expect(store.shippingAmount).toBe(0);
    expect(store.totalAmount).toBe(960);
  });

  it('applies promo code and computes discount', () => {
    const store = useCartStore();
    store.clearCart();

    const product = mockProducts[1]; // Price 320
    store.addItem(product, product.colors[0], 'L', 1);

    const success = store.applyPromoCode('AURELIA20');
    expect(success).toBe(true);
    expect(store.appliedDiscountPercent).toBe(20);
    expect(store.discountAmount).toBe(64);
    expect(store.totalAmount).toBe(256);
  });

  it('removes item and updates quantity', () => {
    const store = useCartStore();
    store.clearCart();

    const product = mockProducts[0];
    store.addItem(product, product.colors[0], 'S', 1);
    const itemId = store.items[0].id;

    store.updateQuantity(itemId, 3);
    expect(store.items[0].quantity).toBe(3);

    store.removeItem(itemId);
    expect(store.items.length).toBe(0);
  });
});
