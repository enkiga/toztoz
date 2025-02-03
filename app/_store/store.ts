import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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
  endCursor: string;
  hasPreviousPage: boolean;
  startCursor: string;
  pageSize: number;
}

interface ProductsConnection {
  edges: {
    cursor: string;
    node: Product;
  }[];
  pageInfo: PageInfo;
  aggregate: { count: number };
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

interface Order {
  id?: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  county: string;
  city: string;
  district: string;
  street: string;
  itemTotal: number;
  shippingFee: number;
  orderTotal: number;
  mpesaCode: string;
  orderItem: OrderItem[];
  createdAt?: string;
  orderStatus?: string;
}

interface OrderItem {
  quantity: number;
  product: Product;
}

interface storeState {
  products: Product[];
  categories: Category[];
  cart: Cart;
  cartItem: CartItem[];
  order: Order;
  orderItem: OrderItem[];
  fetchProducts: () => Promise<Product[]>;
  fetchProductsConnection: (variables: {
    first?: number;
    after?: any;
    last?: number;
    before?: any;
    productPrice_gte?: number;
    productPrice_lte?: number;
    orderBy?: any;
  }) => Promise<ProductsConnection>;
  fetchListProducts: (count: number) => Promise<Product[]>;
  fetchProductPreview: (count: number) => Promise<Product[]>;
  fetchProductByCategory: (categorySlug: string) => Promise<Product[]>;
  fetchProductByCategoryConnection: (
    categorySlug: string,
    variables: {
      first?: number;
      after?: any;
      last?: number;
      before?: any;
      productPrice_gte?: number;
      productPrice_lte?: number;
      orderBy?: any;
    }
  ) => Promise<ProductsConnection>;
  fetchCategories: () => Promise<Category[]>;
  fetchProductBySlug: (productSlug: string) => Promise<Product>;
  addToCart: (product: Product, selectedQuantity: number) => void;
  removeFromCart: (productSlug: string) => void;
  clearCart: () => void;
  createOrder: (order: Order) => Promise<Order>;
  fetchUserOrders: (email: string) => Promise<Order[]>;
  searchProducts: (searchTerm: string) => Promise<Product[]>;
}

const useStore = create<storeState>()(
  persist(
    (set, get) => ({
      products: [],
      categories: [],
      cart: { id: "", userEmail: "", item: [] },
      cartItem: [],
      order: {
        customerName: "",
        customerEmail: "",
        customerMobile: "",
        county: "",
        city: "",
        district: "",
        street: "",
        orderItem: [],
        itemTotal: 0,
        shippingFee: 0,
        orderTotal: 0,
        mpesaCode: "",
      },
      orderItem: [],

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
            id
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

      createOrder: async (order: Order) => {
        const { createOrder } = await request<{ createOrder: Order }>(
          MASTER_URL,
          gql`
            mutation MyMutation(
              $orderItem: OrderItemCreateManyInlineInput!
              $customerEmail: String!
              $customerName: String!
              $customerMobile: String!
              $city: String!
              $county: String!
              $district: String!
              $mpesaCode: String!
              $street: String!
              $itemTotal: Int!
              $orderTotal: Int = 10
              $shippingFee: Int = 10
            ) {
              createOrder(
                data: {
                  customerName: $customerName
                  orderItem: $orderItem
                  customerEmail: $customerEmail
                  customerMobile: $customerMobile
                  city: $city
                  county: $county
                  district: $district
                  mpesaCode: $mpesaCode
                  orderTotal: $orderTotal
                  shippingFee: $shippingFee
                  street: $street
                  itemTotal: $itemTotal
                  orderStatus: pending
                }
              ) {
                createdAt
              }
              publishManyOrdersConnection {
                edges {
                  node {
                    customerName
                    customerEmail
                    customerMobile
                    county
                    city
                    district
                    street
                    itemTotal
                    shippingFee
                    orderTotal
                    mpesaCode
                    orderItem {
                      quantity
                      product {
                        id
                        productSlug
                      }
                    }
                  }
                }
              }
            }
          `,
          {
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerMobile: order.customerMobile,
            county: order.county,
            city: order.city,
            district: order.district,
            street: order.street,
            itemTotal: order.itemTotal,
            shippingFee: order.shippingFee,
            orderTotal: order.orderTotal,
            mpesaCode: order.mpesaCode,

            orderItem: {
              create: order.orderItem.map((item) => ({
                quantity: item.quantity,
                product: { connect: { id: item.product.id } },
              })),
            },
          }
        );

        return createOrder;
      },

      fetchUserOrders: async (email: string) => {
        const { orders } = await request<{ orders: Order[] }>(
          MASTER_URL,
          gql`
            query MyQuery {
              orders(where: { customerEmail: "${email}" }) {
                city
                county
                createdAt
                customerEmail
                customerMobile
                customerName
                district
                id
                itemTotal
                mpesaCode
                orderItem {
                  id
                  product {
                    id
                    productImage {
                      url
                    }
                    productName
                    productSlug
                    productPrice
                  }
                  quantity
                }
                orderStatus
                orderTotal
                shippingFee
                street
              }
            }
          `
        );
        return orders;
      },

      fetchProductsConnection: async (variables: {
        first?: number;
        after?: any;
        last?: number;
        before?: any;
        productPrice_gte?: number;
        productPrice_lte?: number;
        orderBy?: any;
      }) => {
        const { productsConnection } = await request<{
          productsConnection: ProductsConnection;
        }>(
          MASTER_URL,
          gql`
            query MyQuery(
              $first: Int
              $last: Int
              $after: String
              $before: String
              $productPrice_gte: Int
              $productPrice_lte: Int
              $orderBy: ProductOrderByInput
            ) {
              productsConnection(
                first: $first
                last: $last
                after: $after
                before: $before
                where: {
                  productPrice_gte: $productPrice_gte
                  productPrice_lte: $productPrice_lte
                }
                orderBy: $orderBy
              ) {
                aggregate {
                  count
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  pageSize
                  endCursor
                  startCursor
                }
                edges {
                  cursor
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
              }
            }
          `,
          variables
        );
        return productsConnection;
      },

      fetchProductByCategoryConnection: async (
        categorySlug: string,
        variables: {
          first?: number;
          after?: any;
          last?: number;
          before?: any;
          productPrice_gte?: number;
          productPrice_lte?: number;
          orderBy?: any;
        }
      ) => {
        const { productsConnection } = await request<{
          productsConnection: ProductsConnection;
        }>(
          MASTER_URL,
          gql`
            query MyQuery(
              $categorySlug: String!
              $first: Int
              $after: String
              $before: String
              $last: Int
              $productPrice_gte: Int
              $productPrice_lte: Int
              $orderBy: ProductOrderByInput
            ) {
              productsConnection(
                first: $first
                where: {
                  category_every: { categorySlug: $categorySlug }
                  productPrice_gte: $productPrice_gte
                  productPrice_lte: $productPrice_lte
                }
                after: $after
                before: $before
                last: $last
                orderBy: $orderBy
              ) {
                aggregate {
                  count
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  pageSize
                  endCursor
                  startCursor
                }
                edges {
                  cursor
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
              }
            }
          `,
          {
            categorySlug,
            ...variables,
          }
        );
        return productsConnection;
      },

      searchProducts: async (searchTerm: string) => {
        const { products } = await request<{ products: Product[] }>(
          MASTER_URL,
          gql`
            query MyQuery($searchTerm: String!) {
              products(
                where: {
                  OR: [
                    { productName_contains: $searchTerm }
                    { productSlug_contains: $searchTerm }
                    { productDescription_contains: $searchTerm }
                    {
                      category_some: {
                        OR: [
                          { categoryName_contains: $searchTerm }
                          { categorySlug_contains: $searchTerm }
                        ]
                      }
                    }
                  ]
                }
                first: 10
              ) {
                id
                productName
                productSlug
                productImage {
                  url
                }
                category {
                  categorySlug
                }
              }
            }
          `,
          { searchTerm }
        );
        return products;
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ cartItem: state.cartItem }),
    }
  )
);

export { useStore };
