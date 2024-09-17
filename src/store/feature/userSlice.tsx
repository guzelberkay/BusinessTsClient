import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../model/IUser";
import axios, { AxiosResponse } from "axios";
import { IResponse } from "../../model/IResponse";
import RestApis from "../../config/RestApis";

interface IUserState {
    user: IUser
    userRoleList: string[]
    userList: IUser[]
    isLoading: boolean
}

const initialUserState: IUserState = {
    user: {
        id: 0,
        authId: 0,
        firstName: "",
        lastName: "",
        role: []
    },
    userRoleList: [],
    userList: [],
    isLoading: false
    
};

//----------------------------------------------------

interface IFetchSaveUser {
    authId: number
    firstName: string
    lastName: string
    email: string
    password: string
    roleIds: number[]
}
/**
 * Admin tarafından bir kullanıcının kaydedilmesi işlemi için kullanılır
 * 
 * @param {IFetchSaveUser} payload - Kullanıcı bilgileri
 * 
 * @returns {Promise<AxiosResponse<IResponse>>} - Sunucudan dönen yanıt
 * 
 */
export const fetchSaveUser = createAsyncThunk(
    'user/fetchSaveUser',
    async (payload: IFetchSaveUser) => {
        const user = { authId: payload.authId, firstName: payload.firstName, lastName: payload.lastName, roleIds: payload.roleIds };
        const result = await axios.post(RestApis.user_management_service_user+"/save-user", 
            user,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;
    }
);

//----------------------------------------------------


interface IFetchUpdateUser {
    authId: number,
    firstName: string,
    lastName: string,
    email: string,
}
/**
 * Bir kullancı kendi profilindeki bilgileri değiştirmek istediğinde kullanılır. AuthId giriş yapan kullanıcının id'sidir. 
 * 
 * @param {IFetchUpdateUser} payload - Kullanıcı bilgileri
 * 
 * @returns {Promise<AxiosResponse<IResponse>>} - Sunucudan dönen yanıt
 */
export const fetchUpdateUser = createAsyncThunk(
    'user/fetchUpdateUser',
    async (payload: IFetchUpdateUser) => {
        const user = { authId: payload.authId, firstName: payload.firstName, lastName: payload.lastName, email: payload.email };
        const result = await axios.put(RestApis.user_management_service_user+"/update-user",
            user,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            }
        );
        return result.data;
    }
);


//----------------------------------------------------


/**
 * Admin bir kullanıcının hesabını soft delete yapmak istediğinde kullanılır.
 * 
 * @param {number} userId - Kullanıcının id'sidir
 * @returns {Promise<AxiosResponse<IResponse>>} - Sunucudan dönen yanıt.
 */
export const fetchDeleteUser = createAsyncThunk(
    'user/fetchDeleteUser',
    async (userId: number) => {
        const result = await axios.put(RestApis.user_management_service_user+"/delete-user", 
            userId,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            }
        );
        return result.data;
    }
);


//----------------------------------------------------


/**
 * 
 * Admin tarafından kullanıcı listesini getirmek istediğinde kullanılır. Kayıt olup rol bekleyen unasigned rolündeki kullanıcılara rol atanması istenirken kullanılabilir.
 * 
 * @returns {Promise<AxiosResponse<IResponse>>} - Sunucudan dönen yanıt içersinde kullanıcı listesi bulunur.
 * 
 */
export const fetchUserList = createAsyncThunk(
    'user/fetchUserList',
    async () => {
        const result = await axios.get(RestApis.user_management_service_user+"/get-all-users",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            }
        );
        return result.data;
    }
);

//----------------------------------------------------


/**
 * Admin tarafından  kullanıcılara rol atamak amaçlı kullanılır.
 * 
 * @param {number} userId - Rol atanmak istenen kullanıcının userId'sidir
 * @param {number} roleId - Atanılacak rol id'sidir
 */
export const fetchAddRoleToUser = createAsyncThunk(
    'user/fetchAddRoleToUser',
    async (addRoleToUserPayload: { userId: number, roleId: number }) => {
        const result = await axios.put(RestApis.user_management_service_user+"/add-role-to-user",
            addRoleToUserPayload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            }
        );
        return result.data;
    }
)

//----------------------------------------------------

/**
 * Giriş yapan kullanıcının rol bilgisini getirmek istediğinde kullanılır.
 * 
 * @returns {Promise<AxiosResponse<IResponse>>} - Sunucudan dönen yanıtta kullanıcının rolleri bulunur.
 */

export const fetchUserRoles = createAsyncThunk(
    'user/fetchUserRoles',
    async () => {
        const result = await axios.get(RestApis.user_management_service_user+"/get-user-roles",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            }
        );
        return result.data;
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState: initialUserState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserList.fulfilled, (state, action: PayloadAction<IResponse>) => {
            if(action.payload.code){
                state.userList = action.payload.data;
            }
        });

        builder.addCase(fetchUserRoles.fulfilled, (state, action: PayloadAction<IResponse>) => {
            if(action.payload.code){
                state.userRoleList = action.payload.data;
            }
        });
    }
});


export default userSlice.reducer;