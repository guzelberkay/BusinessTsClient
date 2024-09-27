import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { IResponse } from "../../model/IResponse";
import RestApis from "../../config/RestApis";
import { IPlan } from "../../model/IPlan";

interface ISubscriptionState {
    planList: IPlan[]
}

const initialSubscriptionState: ISubscriptionState = {
    planList: [],
};

export const fetchFindAllPlans = createAsyncThunk(
    'subscription/IFetchFindAllPlans',
    async () => {
        const values = {};
        const result = await axios.post(
            RestApis.subscription_service_plan+"/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);
interface IFetchSaveSubscription{
    planId:number,
    subscriptionType: string
}
export const fetchSaveSubscription = createAsyncThunk(
    'subscription/fetchSaveSubscription',
    async (payload:IFetchSaveSubscription) => {
        const values = {planId: payload.planId, subscriptionType: payload.subscriptionType };
        const result = await axios.post(
            RestApis.subscription_service_subscription+"/save",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState: initialSubscriptionState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchFindAllPlans.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.planList = action.payload.data;
        });
    }
});


export default subscriptionSlice.reducer;