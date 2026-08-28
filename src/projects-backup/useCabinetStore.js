import { create } from 'zustand'

export const useCabinetStore = create((set) => ({
  openDrawerId: null,
  activeFolderIndex: 0,
  setOpenDrawer: (id) => set((s) => ({ 
    openDrawerId: s.openDrawerId === id ? null : id,
    activeFolderIndex: 0,
  })),
  setActiveFolderIndex: (idx) => set({ activeFolderIndex: idx }),
}))