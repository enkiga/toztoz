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

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

interface ProductsConnection {
  edges: { node: Product }[];
  pageInfo: PageInfo;
  aggregate: { count: number };
}

interface ProductsQueryData {
  productsConnection: ProductsConnection;
}

interface Category {
  id: string;
  categoryName: string;
  categorySlug: string;
}

interface Cart {
  id: string;
  userEmail: string;
  item: CartItem[];
}

interface CartItem {
  id: string;
  product: Product;
  selectedQuantity: number;
}

interface storeState {
  products: Product[];
  categories: Category[];
  cart: Cart;
  cartItem: CartItem[];
  fetchProducts: () => Promise<Product[]>;
  fetchListProducts: (count: number) => Promise<Product[]>;
  fetchProductPreview: (count: number) => Promise<Product[]>;
  fetchProductByCategory: (categorySlug: string) => Promise<Product[]>;
  fetchCategories: () => Promise<Category[]>;
  fetchProductBySlug: (productSlug: string) => Promise<Product>;
  addToCart: (product: Product, selectedQuantity: number) => void;
  removeFromCart: (productSlug: string) => void;
  clearCart: () => void;
}

const useStore = create<storeState>((set, get) => ({
  products: [],
  categories: [],
  cart: { id: "", userEmail: "", item: [] },
  cartItem: [],

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

  fetchListProducts: async (count: number) => {
    const { productsConnection } = await request<{
      productsConnection: { edges: { node: Product }[] };
    }>(
      MASTER_URL,
      gql`
      query MyQuery {
        productsConnection(first: ${count}) {
          edges {
            node {
              id
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
          pageInfo {
            hasNextPage
            endCursor
            hasPreviousPage
            startCursor
          }
          aggregate {
            count
          }
        }
      }
    `
    );
    const products = productsConnection.edges.map((edge) => edge.node);
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

  addToCart: (product, selectedQuantity) => {
    const existingItem = get().cartItem.find(
      (item) => item.product.productSlug === product.productSlug
    );

    if (existingItem) {
      // If product exists, update its quantity
      return set({
        cartItem: get().cartItem.map((item) =>
          item.product.productSlug === product.productSlug
            ? {
                ...item,
                selectedQuantity: item.selectedQuantity + selectedQuantity,
              }
            : item
        ),
      });
    } else {
      // If product doesn't exist, add it to the cart
      return set({
        cartItem: [
          ...get().cartItem,
          {
            id: product.productSlug, // You might want to generate a unique ID here
            product,
            selectedQuantity,
          },
        ],
      });
    }
  },

  removeFromCart: (productSlug) => {
    set({
      cartItem: get().cartItem.filter(
        (item) => item.product.productSlug !== productSlug
      ),
    });
    return;
  },

  clearCart: () => {
    set({ cartItem: [] });
    return;
  },
}));

export { useStore };
