export interface IPayroll{
    id: number;
    employeeId: number;
    firstName: string;
    lastName: string;
    salaryDate: Date;
    grossSalary: number;
    deduction: number;
    netSalary: number;
    status: string;
}