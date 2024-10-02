import {configureStore} from "@reduxjs/toolkit";
import {authSlice, languageSlice, stockSlice, crmSlice, userSlice, hrmSlice, financeSlice, subscriptionSlice, roleSlice} from "./feature";


import {useSelector} from "react-redux";
import notificationSlice from "./feature/notificationSlice";



const store = configureStore({
    reducer: {
        auth: authSlice,
        pageSettings: languageSlice,
        notifications: notificationSlice,
        stockSlice: stockSlice,
        crmSlice:crmSlice,
        hrmSlice: hrmSlice,
        userSlice: userSlice,
        subscription: subscriptionSlice,
        financeSlice: financeSlice,
        roleSlice: roleSlice
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = useSelector.withTypes<RootState>();
export default store;
