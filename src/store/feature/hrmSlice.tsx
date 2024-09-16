import RestApis from "../../config/RestApis";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import { IAttendance, } from "../../model/IAttendance";
import { IBenefit } from "../../model/IBenefit";
import { IEmployee } from "../../model/IEmployee";
import { IPayroll } from "../../model/IPayroll";
import { IPerformance } from "../../model/IPerformance";




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
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
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
        const result = await axios.post(
            RestApis.hrm_service_employee+"/update",
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
export const fetchFindByIdEmployee = createAsyncThunk(
    'hrm/fetchFindByIdEmployee',
    async (id:number) => {
        const result = await axios.get(
            RestApis.hrm_service_employee+"/find-by-id?id="+id,
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
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
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
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;
    }
)
//#region Attendance
//#region Benefit
//#region Payroll
//#region Performance

const hrmSlice = createSlice({
    name: "hrm",
    initialState:initialHrmState,
    reducers: {
        setAttendanceList: (state, action: PayloadAction<IAttendance[]>) => {
            state.attendanceList = action.payload;
        },
        setBenefitList: (state, action: PayloadAction<IBenefit[]>) => {
            state.benefitList = action.payload;
        },
        setEmployeeList: (state, action: PayloadAction<IEmployee[]>) => {
            state.employeeList = action.payload;
        },
        setPayrollList: (state, action: PayloadAction<IPayroll[]>) => {
            state.payrollList = action.payload;
        },
        setPerformanceList: (state, action: PayloadAction<IPerformance[]>) => {
            state.performanceList = action.payload;
        },
    }
});

export const { setAttendanceList, setBenefitList, setEmployeeList, setPayrollList, setPerformanceList } = hrmSlice.actions;

export default hrmSlice.reducer;