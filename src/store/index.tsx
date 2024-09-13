import {configureStore} from "@reduxjs/toolkit";
import {authSlice, languageSlice,stockSlice} from "./feature";

import {useSelector} from "react-redux";


const store = configureStore({
    reducer: {
        auth: authSlice,
        pageSettings: languageSlice,
        stockSlice: stockSlice
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = useSelector.withTypes<RootState>();
export default store;
