import { create } from 'zustand';


interface Product {
    id:string;
    productname:string;
    productPrice:number;
    productImage:string;
    productDescription:string;
    productQuantity:number;
    productSlug:string;
    productStatus:string;
    category:string;
}

interface Category {
    id:string;
    categoryname:string;
    categorySlug:string;
}

interface storeState {
    products: Product[];
    categories: Category[];
    cart: Product[];
    fetchProducts: () => Promise<void>;
    fetchCategories: () => Promise<void>;
    addToCart: (product:Product) => void;
    removeFromCart: (product:Product) => void;
    clearCart: () => void;
}

const useStore = create<storeState>((set) => ({
    products: [],
    categories: [],
    cart: [],
    addToCart: (product) => set((state) => ({ cart: [...state.cart, product] })),
    removeFromCart: (product) => set((state) => ({ cart: state.cart.filter((item) => item.id !== product.id) })),
    clearCart: () => set({ cart: [] }),

    fetchProducts: async () => {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        set({ products: data });
    },

    fetchCategories: async () => {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const data = await response.json();
        set({ categories: data });
    }
}));