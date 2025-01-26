import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { playPopSound } from '../utils/sound';
import { useToastStore } from './useToastStore';

export const useFavoriteStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggleFavorite: (productId) => {
        // Play sound when toggling favorite
        playPopSound();
        
        const isFavorite = get().items.includes(productId);
        
        // Show toast notification
        useToastStore.getState().showToast(
          isFavorite ? 'Removed from favorites' : 'Added to favorites'
        );
        
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items.filter((id) => id !== productId)
            : [...state.items, productId],
        }));
      },
      isFavorite: (productId) => get().items.includes(productId),
    }),
    {
      name: 'favorites-storage',
    }
  )
);