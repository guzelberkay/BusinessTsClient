export interface IPayroll{
    id: number;
    employeeId: number;
    salaryDate: Date;
    grossSalary: number;
    deduction: number;
    netSalary: number;
    status: string;
}