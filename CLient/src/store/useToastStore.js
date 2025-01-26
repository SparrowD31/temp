import { create } from 'zustand';

export const useToastStore = create((set) => ({
  message: '',
  isVisible: false,
  showToast: (message) => set({ message, isVisible: true }),
  hideToast: () => set({ isVisible: false }),
}));