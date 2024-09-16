export interface IBenefit{
    id: number;
    employeeId: number;
    type: string;
    amount: number;
    startDate: Date;
    endDate: Date;
    status: string;
}