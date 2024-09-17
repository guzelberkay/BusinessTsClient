export interface IAttendance{
    id: number;
    employeeId: number;
    checkInDateTime: Date;
    checkOutDateTime: Date;
    status: string;
}