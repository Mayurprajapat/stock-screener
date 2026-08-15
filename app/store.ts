import { create } from "zustand";

interface StockStore {
  search: string;
  setSearch: (value: string) => void;

  selectedSymbol: string | null;
  setSelectedSymbol: (symbol: string | null) => void;

  selectedSectors: string[];
  toggleSector: (sector: string) => void;

  minMarketCap: number;
  setMinMarketCap: (value: number) => void;
}

export const useStockStore = create<StockStore>((set) => ({
  search: "",
  setSearch: (value) => set({ search: value }),

  selectedSymbol: null,
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),

  selectedSectors: [],
  toggleSector: (sector) =>
    set((state) => ({
      selectedSectors: state.selectedSectors.includes(sector)
        ? state.selectedSectors.filter((s) => s !== sector) // already hai to hatao
        : [...state.selectedSectors, sector],                // nahi hai to add karo
    })),

  minMarketCap: 0,
  setMinMarketCap: (value) => set({ minMarketCap: value }),
}));