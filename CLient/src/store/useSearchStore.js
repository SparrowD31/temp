import { create } from 'zustand';
import { mockProducts } from '../data/mockData';

export const useSearchStore = create((set) => ({
  searchTerm: '',
  searchResults: [],
  isSearching: false,
  setSearchTerm: (term) => {
    set({ searchTerm: term });
    if (!term.trim()) {
      set({ searchResults: [], isSearching: false });
      return;
    }

    const results = mockProducts.filter((product) => {
      const searchTerm = term.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    });

    set({ searchResults: results, isSearching: true });
  },
  clearSearch: () => set({ searchTerm: '', searchResults: [], isSearching: false }),
}));