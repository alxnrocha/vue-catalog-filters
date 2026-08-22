import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';

export const useWishlistStore = defineStore('wishlist', () => {
  const wishlistIds = useLocalStorage<string[]>('aurelia-wishlist', ['prod-01', 'prod-04']);

  const wishlistCount = computed(() => wishlistIds.value.length);

  const isInWishlist = (productId: string) => {
    return wishlistIds.value.includes(productId);
  };

  const toggleWishlist = (productId: string) => {
    const index = wishlistIds.value.indexOf(productId);
    if (index > -1) {
      wishlistIds.value.splice(index, 1);
    } else {
      wishlistIds.value.push(productId);
    }
  };

  const clearWishlist = () => {
    wishlistIds.value = [];
  };

  return {
    wishlistIds,
    wishlistCount,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
  };
});
