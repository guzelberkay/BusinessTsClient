import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import RestApis from "../../config/RestApis";
import axios from "axios";

const initialAuthState={
    token: '',
    user: [],
    isLoadingLogin: false,
    isLoadingRegister: false,
    isAuth: false
}

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

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers:{},
    extraReducers: (build)=>{
        build.addCase(fetchRegister.pending,(state)=>{
            state.isLoadingRegister = true;
        });
        build.addCase(fetchRegister.fulfilled,(state)=>{
            state.isLoadingRegister = false;
        });
       
        
    }
});

export default authSlice.reducer;