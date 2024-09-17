export interface ICrmUser{
    id: number;
    authId: number;
    userId: number;
    customerId: number;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    status:string

}