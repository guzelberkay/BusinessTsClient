import {configureStore} from "@reduxjs/toolkit";
import {authSlice, languageSlice,stockSlice,userSlice} from "./feature";
import {authSlice, languageSlice,stockSlice, crmSlice} from "./feature";

import {useSelector} from "react-redux";



const store = configureStore({
    reducer: {
        auth: authSlice,
        pageSettings: languageSlice,
        stockSlice: stockSlice,
        crmSlice:crmSlice,
        userSlice: userSlice
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = useSelector.withTypes<RootState>();
export default store;
