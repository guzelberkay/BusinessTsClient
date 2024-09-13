import {configureStore} from "@reduxjs/toolkit";
import {authSlice, languageSlice,stockSlice,userSlice} from "./feature";

import {useSelector} from "react-redux";



const store = configureStore({
    reducer: {
        auth: authSlice,
        pageSettings: languageSlice,
        stockSlice: stockSlice,
        userSlice: userSlice
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = useSelector.withTypes<RootState>();
export default store;
