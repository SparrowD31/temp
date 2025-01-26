import { create } from 'zustand';
import { playPopSound } from '../utils/sound';
import { useToastStore } from './useToastStore';

export const useCartStore = create((set) => ({
  items: [],
  addItem: (product, size) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.id === product.id && item.size === size
      );

      // Play sound when adding item
      playPopSound();
      
      // Show toast notification
      useToastStore.getState().showToast('Added to cart');

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id && item.size === size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return { items: [...state.items, { product, quantity: 1, size }] };
    }),
  removeItem: (productId, size) =>
    set((state) => ({
      items: state.items.filter(
        (item) => !(item.product.id === productId && item.size === size)
      ),
    })),
  updateQuantity: (productId, size, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      ),
    })),
  clearCart: () => set({ items: [] }),
}));