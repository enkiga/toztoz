import { create } from "zustand";
import { gql, request } from "graphql-request";

const MASTER_URL = process.env.NEXT_PUBLIC_HYGRAPGH_ENDPOINT;

// Make MASTER_URL type safe
if (!MASTER_URL) {
  throw new Error("MASTER_URL is not defined");
} else if (typeof MASTER_URL !== "string") {
  throw new Error("MASTER_URL is not a string");
}

interface Product {
  id: string;
  productname: string;
  productPrice: number;
  productImage: string;
  productDescription: string;
  productQuantity: number;
  productSlug: string;
  productStatus: string;
  category: string;
}

interface Category {
  id: string;
  categoryname: string;
  categorySlug: string;
}

interface storeState {
  products: Product[];
  categories: Category[];
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
}

const useStore = create<storeState>((set) => ({
  products: [],
  categories: [],

  fetchProducts: async () => {
    const { products } = await request<{ products: Product[] }>(
      MASTER_URL,
      gql`
        query MyQuery {
          products {
            id
            productDescription
            productImage {
              url
            }
            productName
            productPrice
            productQuantity
            productSlug
            productStatus
            category {
              categoryName
            }
          }
        }
      `
    );
    set({ products });
  },

  fetchCategories: async () => {
    const { categories } = await request<{ categories: Category[] }>(
      MASTER_URL,
      gql`
        query MyQuery {
          categories {
            id
            categoryName
            categorySlug
          }
        }
      `
    );
    set({ categories });
  },
}));

export { useStore };
