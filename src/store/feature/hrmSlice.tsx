import RestApis from "../../config/RestApis";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import { IAttendance, } from "../../model/IAttendance";
import { IBenefit } from "../../model/IBenefit";
import { IEmployee } from "../../model/IEmployee";
import { IPayroll } from "../../model/IPayroll";
import { IPerformance } from "../../model/IPerformance";
import { IResponse } from "../../model/IResponse";





interface IHrmState  {
    attendanceList:IAttendance[]
    benefitList:IBenefit[]
    employeeList:IEmployee[]
    payrollList:IPayroll[]
    performanceList:IPerformance[]
}

const initialHrmState:IHrmState = {
    attendanceList: [],
    benefitList:[],
    employeeList:[],
    payrollList:[],
    performanceList:[]
}


//#region Employee
interface IfetchSaveEmployee{
    firstName:string;
    lastName:string;
    position:string;
    department:string;
    email:string;
    phone:string;
    hireDate:Date;
    salary:number;
    
}

export const fetchSaveEmployee = createAsyncThunk(
    'hrm/fetchSaveEmployee',
    async (payload:IfetchSaveEmployee) => {
        const usersName = { 
            firstName: payload.firstName,
            lastName: payload.lastName,
            position: payload.position,
            department: payload.department,
            email: payload.email,
            phone: payload.phone,
            hireDate: payload.hireDate,
            salary: payload.salary
        };
        const result = await axios.post(
            RestApis.hrm_service_employee+"/save",
            usersName,
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
interface IfetchUpdateEmployee{
    
    id:number;
    firstName:string;
    lastName:string;
    position:string;
    department:string;
    email:string;
    phone:string;
    hireDate:Date;
    salary:number;
    
}
export const fetchUpdateEmployee = createAsyncThunk(
    'hrm/fetchUpdateEmployee',
    async (payload:IfetchUpdateEmployee) => {
        const values = { 
            id: payload.id,
            firstName: payload.firstName,
            lastName: payload.lastName,
            position: payload.position,
            department: payload.department,
            email: payload.email,
            phone: payload.phone,
            hireDate: payload.hireDate,
            salary: payload.salary
        };
        const result = await axios.put(
            RestApis.hrm_service_employee+"/update",
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


export const fetchFindByIdEmployee = createAsyncThunk(
    'hrm/fetchFindByIdEmployee',
    async (id:number) => {
        const result = await axios.post(
            RestApis.hrm_service_employee+"/find-by-id?id="+id,null,
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

interface IfetchFindAllEmployee{
    searchText:string;
    page:number;
    size:number;

}
export const fetchFindAllEmployee = createAsyncThunk(
    'hrm/fetchFindAllEmployee',
    async (payload:IfetchFindAllEmployee) => {
        const values = { searchText: payload.searchText,page: payload.page,size: payload.size };
        const result = await axios.post(
            RestApis.hrm_service_employee+"/find-all",
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

export const fetchDeleteEmployee = createAsyncThunk(
    'hrm/fetchDeleteEmployee',
    async (id:number) => {
        const result = await axios.delete(
            RestApis.hrm_service_employee+"/delete?id="+id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('token')
                }
            }
        );
        return result.data;
    }
)
//#region Attendance
//#region Benefit
//#region Payroll

interface IfetchFindAllPayroll{
    searchText:string;
    page:number;
    size:number;

}
export const fetchFindAllPayroll = createAsyncThunk(
    'hrm/fetchFindAllPayroll',
    async (payload:IfetchFindAllPayroll) => {
        const values = { searchText: payload.searchText,page: payload.page,size: payload.size };
        const result = await axios.post(
         "http://localhost:9096/dev/v1/payroll/find-all",
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

//#region Performance

const hrmSlice = createSlice({
    name: 'hrm',
    initialState: initialHrmState,
    reducers: {
        closeModal: () => {

        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFindAllEmployee.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.employeeList = action.payload.data;
        })
        builder.addCase(fetchFindAllPayroll.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.payrollList = action.payload.data;
        });
      
    }
});

export default hrmSlice.reducer;

export const {} = hrmSlice.actions;