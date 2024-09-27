import RestApis from "../../config/RestApis";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {ICrmCustomer} from "../../model/ICrmCustomer";
import {ICrmMarketingCampaign} from "../../model/ICrmMarketingCampaign.tsx";
import {ICrmOpportunity} from "../../model/ICrmOpportunity.tsx";
import {ICrmSalesActivity} from "../../model/ICrmSalesActivity.tsx";
import {ICrmTicket} from "../../model/ICrmTicket.tsx";
import {IResponse} from "../../model/IResponse";


interface ICrmState {
    customerList: ICrmCustomer[]
    marketingCampaignList: ICrmMarketingCampaign[]
    opportunityList: ICrmOpportunity[]
    salesActivityList: ICrmSalesActivity[]
    ticketList: ICrmTicket[]
}

const initialCrmState: ICrmState = {
    customerList: [],
    marketingCampaignList: [],
    opportunityList: [],
    salesActivityList: [],
    ticketList: []
}

interface IfetchSaveCustomer {
    memberId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
}

//# region Customer Operations
export const fetchSaveCustomer = createAsyncThunk(
    'crm/fetchSaveCustomer',
    async (payload: IfetchSaveCustomer) => {
        const values = {
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            phone: payload.phone,
            address: payload.address
        };

        const result = await axios.post(
            RestApis.crm_service_customer + "/save",
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
    async (id: number) => {
        const result = await axios.delete(
            RestApis.crm_service_customer + "/delete?id=" + id,
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

interface IfetchUpdateCustomer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
}

export const fetchUpdateCustomer = createAsyncThunk(
    'crm/fetchUpdateCustomer',
    async (payload: IfetchUpdateCustomer) => {
        const values = {
            id: payload.id,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            phone: payload.phone,
            address: payload.address
        };

        const result = await axios.put(
            RestApis.crm_service_customer + "/update",
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

interface IfetchFindAllCustomer {
    page: number;
    size: number;
    searchText: string
}

export const fetchFindAllCustomer = createAsyncThunk(
    'crm/fetchCustomerList',
    async (payload: IfetchFindAllCustomer) => {
        const values = {page: payload.page, size: payload.size, searchText: payload.searchText};

        const result = await axios.post(
            RestApis.crm_service_customer + "/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);


//# endregion Customer Operations

// # region Marketing Campaign Operations
interface IfetchSaveMarketingCampaign {
    memberId: number;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    budget: number;
    status: string
}

export const fetchSaveMarketingCampaign = createAsyncThunk(
    'crm/fetchSaveMarketingCampaign',
    async (payload: IfetchSaveMarketingCampaign) => {
        const values = {
            name: payload.name,
            description: payload.description,
            startDate: payload.startDate,
            endDate: payload.endDate,
            budget: payload.budget,
            status: payload.status
        };

        const result = await axios.post(
            RestApis.crm_service_marketing_campaign + "/save",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

export const fetchDeleteMarketingCampaign = createAsyncThunk(
    'crm/fetchDeleteMarketingCampaign',
    async (id: number) => {
        const result = await axios.delete(
            RestApis.crm_service_marketing_campaign + "/delete?id=" + id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);


export const fetchUpdateMarketingCampaign = createAsyncThunk(
    'crm/fetchUpdateMarketingCampaign',
    async (payload: IfetchSaveMarketingCampaign) => {
        const values = {
            id: payload.memberId,
            name: payload.name,
            description: payload.description,
            startDate: payload.startDate,
            endDate: payload.endDate,
            budget: payload.budget,
            status: payload.status
        };

        const result = await axios.put(
            RestApis.crm_service_marketing_campaign + "/update",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);

interface IFetchFindAllMarketingCampaign {
    page: number;
    size: number;
    searchText: string
}

export const fetchFindAllMarketingCampaign = createAsyncThunk(
    'crm/fetchMarketingCampaignList',
    async (payload: IFetchFindAllMarketingCampaign) => {
        const values = {page: payload.page, size: payload.size, searchText: payload.searchText};

        const result = await axios.post(
            RestApis.crm_service_marketing_campaign + "/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
);


const crmSlice = createSlice({
    name: 'crm',
    initialState: initialCrmState,
    reducers: {
        closeModal: () => {

        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFindAllCustomer.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.customerList = action.payload.data;
            })
        builder.addCase(fetchFindAllMarketingCampaign.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.marketingCampaignList = action.payload.data;
            })
    }
});

export default crmSlice.reducer;

export const {} = crmSlice.actions;

