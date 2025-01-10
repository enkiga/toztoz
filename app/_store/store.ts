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
  productName: string;
  productPrice: number;
  productImage: [{ url: string }];
  productDescription: string;
  productQuantity: number;
  productSlug: string;
  productStatus: string;
  category: [{ categoryName: string; categorySlug: string }];
}

interface Category {
  id: string;
  categoryName: string;
  categorySlug: string;
}

interface storeState {
  products: Product[];
  categories: Category[];
  fetchProducts: () => Promise<Product[]>;
  fetchProductPreview: (count: number) => Promise<Product[]>;
  fetchProductByCategory: (categorySlug: string) => Promise<Product[]>;
  fetchCategories: () => Promise<Category[]>;
  fetchProductBySlug: (productSlug: string) => Promise<Product>;
}

const useStore = create<storeState>((set) => ({
  products: [],
  categories: [],

  fetchProducts: async () => {
    const { products } = await request<{ products: Product[] }>(
      MASTER_URL,
      gql`
        query MyQuery {
          products(first: 12) {
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
    return products;
  },

  fetchProductPreview: async (count: number) => {
    const { products } = await request<{ products: Product[] }>(
      MASTER_URL,
      gql`
        query MyQuery {
          products(first: ${count}) {
            productImage {
              url
            }
            productName
            productPrice
            productSlug
            category {
              categorySlug
            }
          }
        }
      `
    );
    set({ products });
    return products;
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
    return categories;
  },

  fetchProductByCategory: async (categorySlug: string) => {
    const { products } = await request<{ products: Product[] }>(
      MASTER_URL,
      gql`
        query MyQuery {
          products(first: 12, where: {category_every: {categorySlug: "${categorySlug}"}}) {
            productName
            id
            productImage {
              url
            }
            productPrice
            productSlug
            category {
              categorySlug
            }
          }
        }
      `
    );
    set({ products });
    return products;
  },

  fetchProductBySlug: async (productSlug: string) => {
    const { product } = await request<{ product: Product }>(
      MASTER_URL,
      gql`
        query MyQuery {
          product(where: {productSlug: "${productSlug}"}) {
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
              categorySlug
            }
          }
        }
      `
    );
    return product;
  },
}));

export { useStore };
