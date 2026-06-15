import { createSlice } from "@reduxjs/toolkit";


const CartSlice = createSlice({
    name:"cart",
    initialState:[],
    reducers: {
        add: (state, action) => {
            state.push(action.payload)
        },
        remove: (state, action) => {
            return state.filter((item) => item.id !== action.payload)
        }
    }
})

// Product Slice
const ProductSlice = createSlice({
    name: "products",
    initialState: {
        data: [],
        filtered: [],
        selectedCategory: "All",
        selectedPrice: "",
    },
    reducers: {
        setProducts: (state, action) => {
            state.data = action.payload;
            state.filtered = action.payload; // initialize filtered with all products
        },
        updateFilteredProducts: (state, action) => {
            state.filtered = action.payload;
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        setSelectedPrice: (state, action) => {
            state.selectedPrice = action.payload;
        },
    },
});


export const { add, remove } = CartSlice.actions;
export const { setProducts, updateFilteredProducts, setSelectedCategory,
    setSelectedPrice, } = ProductSlice.actions;

export const reducers = {
    cart: CartSlice.reducer,
    products: ProductSlice.reducer,
};
