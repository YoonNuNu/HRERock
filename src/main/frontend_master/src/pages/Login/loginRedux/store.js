import { configureStore } from "@reduxjs/toolkit";
import LoginSlice, { login } from "./LoginSlice";

export default configureStore({

    reducer: {
        auth :LoginSlice
    },

})