import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import RestApis from "../../config/RestApis";
import axios from "axios";


interface IAuthState {
    token: string;
    user: any[]; 
    isLoadingLogin: boolean;
    isLoadingRegister: boolean;
    isAuth: boolean;
    isLoadingVerifyAccount: boolean;

}

const initialAuthState: IAuthState = {
    token: '',
    user: [],
    isLoadingLogin: false,
    isLoadingRegister: false,
    isAuth: false,
    isLoadingVerifyAccount: false,
  
};

interface IFetchRegister{
    firstName: string;
    lastName: string;
    email: string; 
    password: string;
    rePassword: string;
}

export const fetchRegister = createAsyncThunk(
    'auth/fetchRegister',
    async (payload: IFetchRegister, { rejectWithValue }) => {
        try {
            const response = await axios.post(RestApis.auth_service + '/register', {
                'firstName': payload.firstName,
                'lastName': payload.lastName,
                'email': payload.email,
                'password': payload.password,
                'rePassword': payload.rePassword
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data; 
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                // Axios error with response
                return rejectWithValue(error.response.data);
            } else {
                // Fallback error message
                return rejectWithValue({ message: 'Kayıt işlemi sırasında bir hata oluştu.' });
            }
        }
    }
);

interface IFetchVerifyAccount{
    token: string;
}


export const fetchVerifyAccount = createAsyncThunk(
    'auth/fetchVerifyAccount',
    async (payload: IFetchVerifyAccount, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${RestApis.auth_service}/verify-account`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    token: payload.token 
                }
            });

            console.log(response.data);
            return response.data; 
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                // Axios error with response
                return rejectWithValue(error.response.data);
            } else {
                // General error message
                return rejectWithValue({ message: 'An error occurred during the verification process.' });
            }
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        setToken(state,action: PayloadAction<string>){
            state.isAuth = true;
            state.token = action.payload;
        },
        clearToken(state){
            state.isAuth = false;
            state.token = '';
        }
    },
    extraReducers: (build)=>{
        build.addCase(fetchRegister.pending,(state)=>{
            state.isLoadingRegister = true;
        });
        build.addCase(fetchRegister.fulfilled,(state)=>{
            state.isLoadingRegister = false;
        });
        build.addCase(fetchVerifyAccount.pending, (state) => {
            state.isLoadingVerifyAccount = true;
        });
        build.addCase(fetchVerifyAccount.fulfilled, (state)=>{
            state.isLoadingVerifyAccount = false;
            
        });
       
       
        
    }
});

export const {
    setToken,clearToken
} = authSlice.actions;
export default authSlice.reducer;