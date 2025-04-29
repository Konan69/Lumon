import { Category } from "@/types";

import { create } from "zustand";

interface CategoryStore {
  categories: Category[] | null;
  setCategories: (categories: Category[] | null) => void;
  addCategory: (category: Category) => void;
}

const useCategoryStore = create<CategoryStore>()((set) => ({
  categories: null,
  setCategories: (categories) => {
    set({ categories });
  },
  addCategory: (category) => {
    set((state) => ({
      categories: state.categories
        ? [...state.categories, category]
        : [category],
    }));
  },
}));

export default useCategoryStore;
