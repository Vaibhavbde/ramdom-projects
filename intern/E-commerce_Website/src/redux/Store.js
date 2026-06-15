import { configureStore } from "@reduxjs/toolkit";
import { reducers } from "./Slices/CartSlice";

export const store = configureStore({
    reducer: reducers,
});
