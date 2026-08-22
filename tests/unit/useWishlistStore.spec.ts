import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useWishlistStore } from '@/stores/useWishlistStore';

describe('useWishlistStore Pinia Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with seed wishlist items', () => {
    const store = useWishlistStore();
    expect(store.wishlistCount).toBeGreaterThanOrEqual(1);
    expect(store.isInWishlist('prod-01')).toBe(true);
  });

  it('toggles items in and out of wishlist', () => {
    const store = useWishlistStore();
    store.clearWishlist();
    expect(store.wishlistCount).toBe(0);

    store.toggleWishlist('prod-02');
    expect(store.isInWishlist('prod-02')).toBe(true);
    expect(store.wishlistCount).toBe(1);

    store.toggleWishlist('prod-02');
    expect(store.isInWishlist('prod-02')).toBe(false);
    expect(store.wishlistCount).toBe(0);
  });

  it('clears all wishlist items', () => {
    const store = useWishlistStore();
    store.toggleWishlist('prod-01');
    store.toggleWishlist('prod-03');
    expect(store.wishlistCount).toBeGreaterThanOrEqual(1);

    store.clearWishlist();
    expect(store.wishlistCount).toBe(0);
  });
});
