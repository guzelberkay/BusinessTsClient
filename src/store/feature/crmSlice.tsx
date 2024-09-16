import RestApis from "../../config/RestApis";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {ICrmUser} from "../../model/ICrmUser";
import {ICrmCustomer} from "../../model/ICrmCustomer";
import { IResponse } from "../../model/IResponse";



interface ICrmState  {
    userList:ICrmUser[]
    customerList:ICrmCustomer[]
}

const initialCrmState:ICrmState = {
    userList: [],
    customerList:[]
}

interface IfetchSaveCustomer{
    firstName:string ;
    lastName:string ;
    email:string ;
    phone:string ;
    address:string ;
}

//# region Customer Operations
export const fetchSaveCustomer = createAsyncThunk(
    'crm/fetchSaveCustomer',
    async (payload:IfetchSaveCustomer) => {
        const values = { firstName: payload.firstName, lastName: payload.lastName, email: payload.email, phone: payload.phone, address: payload.address };
        
        const result = await axios.post(
            RestApis.crm_service_customer+"/save",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;
    }
);

export const fetchDeleteCustomer = createAsyncThunk(
    'crm/fetchDeleteCustomer',
    async (id:number) => {
        const result = await axios.delete(
            RestApis.crm_service_customer+"/delete?id="+id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;
    }
);
interface IfetchUpdateCustomer{
    id:number;
    firstName:string ;
    lastName:string ;
    email:string ;
    phone:string ;
    address:string ;
}

export const fetchUpdateCustomer = createAsyncThunk(
    'crm/fetchUpdateCustomer',
    async (payload:IfetchUpdateCustomer) => {
        const values = { id: payload.id, firstName: payload.firstName, lastName: payload.lastName, email: payload.email, phone: payload.phone, address: payload.address };
        
        const result = await axios.put(
            RestApis.crm_service_customer+"/update",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;
    }


)
interface IfetchFindAllCustomer{
    page:number;
    size:number;
    searchText:string
}

export const fetchFindAllCustomer = createAsyncThunk(
    'crm/fetchCustomerList',
    async (payload:IfetchFindAllCustomer) => {
        const values = { page: payload.page, size: payload.size, searchText: payload.searchText };
        
        const result = await axios.post(
            RestApis.crm_service_customer+"/find-all",
          values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;
    }
);
interface IfetchFindByNameCustomer{
    firstName:string;
}
export const fetchfindByNameCustomer = createAsyncThunk(
    'crm/fetchfindByNameCustomer',
    async (payload: IfetchFindByNameCustomer) => {
        const result = await axios.get(
            `${RestApis.crm_service_customer}/find-by-name?firstName=${payload.firstName}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;
    }
);

export const fetchCustomerById = createAsyncThunk(
    'crm/fetchCustomerById',
    async (id:number) => {
        const result = await axios.post(
            RestApis.crm_service_customer+"/find-by-id?id="+id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;
    }
);

//# endregion Customer Operations

const crmSlice = createSlice({
    name: 'crm',
    initialState: initialCrmState,
    reducers: {closeModal: () => {

        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFindAllCustomer.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.customerList = action.payload.data;
            })
            .addCase(fetchfindByNameCustomer.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.customerList = action.payload.data;
            })
        }
    });

    export default crmSlice.reducer;

    export const {...actions} = crmSlice.actions;

