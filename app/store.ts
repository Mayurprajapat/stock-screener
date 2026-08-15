import { create } from "zustand";

interface StockStore {
  search: string;
  setSearch: (value: string) => void;

  selectedSymbol: string | null;
  setSelectedSymbol: (symbol: string | null) => void;
}

export const useStockStore = create<StockStore>((set) => ({
  search: "",
  setSearch: (value) => set({ search: value }),

  selectedSymbol: null,
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
}));