import {configureStore} from "@reduxjs/toolkit";
import {authSlice, languageSlice, stockSlice, crmSlice, userSlice, hrmSlice, financeSlice, subscriptionSlice, roleSlice,projectSlice} from "./feature";


import {useSelector} from "react-redux";
import notificationSlice from "./feature/notificationSlice";
import fileSlice from "./feature/fileSlice";



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
        fileSlice: fileSlice,
        roleSlice: roleSlice,
        projectSlice: projectSlice
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = useSelector.withTypes<RootState>();
export default store;
