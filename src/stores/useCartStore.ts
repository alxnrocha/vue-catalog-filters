import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import type { CartItem } from '@/types/cart';
import type { Product, ProductColor, ProductSize } from '@/types/catalog';
import { mockProducts } from '@/data/products.mock';

export const useCartStore = defineStore('cart', () => {
  // Seed with 1 initial sample item for rich showcase
  const defaultItems: CartItem[] = [
    {
      id: 'prod-01-negro-M',
      product: mockProducts[0],
      selectedColor: mockProducts[0].colors[0],
      selectedSize: 'M',
      quantity: 1,
      unitPrice: mockProducts[0].price,
    },
  ];

  const items = useLocalStorage<CartItem[]>('aurelia-cart-items', defaultItems);
  const isCartOpen = ref(false);
  const promoCode = ref('');
  const appliedDiscountPercent = ref(0);
  const promoError = ref('');
  const promoSuccess = ref('');

  // Getters
  const totalItemsCount = computed(() => {
    return items.value.reduce((acc, item) => acc + item.quantity, 0);
  });

  const subtotal = computed(() => {
    return items.value.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  });

  const discountAmount = computed(() => {
    if (appliedDiscountPercent.value <= 0) return 0;
    return Math.round(subtotal.value * (appliedDiscountPercent.value / 100));
  });

  const freeShippingThreshold = 100;

  const isFreeShipping = computed(() => {
    return subtotal.value >= freeShippingThreshold;
  });

  const freeShippingRemaining = computed(() => {
    return Math.max(0, freeShippingThreshold - subtotal.value);
  });

  const freeShippingProgress = computed(() => {
    return Math.min(100, Math.round((subtotal.value / freeShippingThreshold) * 100));
  });

  const shippingAmount = computed(() => {
    if (items.value.length === 0) return 0;
    return isFreeShipping.value ? 0 : 15;
  });

  const totalAmount = computed(() => {
    return Math.max(0, subtotal.value - discountAmount.value + shippingAmount.value);
  });

  // Actions
  const openCart = () => {
    isCartOpen.value = true;
  };

  const closeCart = () => {
    isCartOpen.value = false;
  };

  const addItem = (
    product: Product,
    selectedColor: ProductColor,
    selectedSize: ProductSize,
    quantity: number = 1
  ) => {
    const itemId = `${product.id}-${selectedColor.id}-${selectedSize}`;
    const existingIndex = items.value.findIndex((item) => item.id === itemId);

    if (existingIndex > -1) {
      items.value[existingIndex].quantity += quantity;
    } else {
      items.value.push({
        id: itemId,
        product,
        selectedColor,
        selectedSize,
        quantity,
        unitPrice: product.price,
      });
    }

    openCart();
  };

  const removeItem = (itemId: string) => {
    const index = items.value.findIndex((item) => item.id === itemId);
    if (index > -1) {
      items.value.splice(index, 1);
    }
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    const item = items.value.find((i) => i.id === itemId);
    if (item) {
      if (newQty <= 0) {
        removeItem(itemId);
      } else {
        item.quantity = Math.min(newQty, item.product.stockCount);
      }
    }
  };

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      promoError.value = 'Introduce un cupón válido';
      promoSuccess.value = '';
      return false;
    }

    if (clean === 'AURELIA20' || clean === 'SALE20') {
      appliedDiscountPercent.value = 20;
      promoCode.value = clean;
      promoSuccess.value = '¡Cupón del 20% aplicado con éxito!';
      promoError.value = '';
      return true;
    } else if (clean === 'VIP10') {
      appliedDiscountPercent.value = 10;
      promoCode.value = clean;
      promoSuccess.value = '¡Cupón VIP del 10% aplicado!';
      promoError.value = '';
      return true;
    } else {
      promoError.value = 'Código no válido o expirado';
      promoSuccess.value = '';
      return false;
    }
  };

  const removePromoCode = () => {
    promoCode.value = '';
    appliedDiscountPercent.value = 0;
    promoSuccess.value = '';
    promoError.value = '';
  };

  const clearCart = () => {
    items.value = [];
    removePromoCode();
  };

  return {
    items,
    isCartOpen,
    promoCode,
    appliedDiscountPercent,
    promoError,
    promoSuccess,
    totalItemsCount,
    subtotal,
    discountAmount,
    isFreeShipping,
    freeShippingRemaining,
    freeShippingProgress,
    shippingAmount,
    totalAmount,
    openCart,
    closeCart,
    addItem,
    removeItem,
    updateQuantity,
    applyPromoCode,
    removePromoCode,
    clearCart,
  };
});
