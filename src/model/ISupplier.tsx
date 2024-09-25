export interface ISupplier {
    id: number;
    memberId:number
    authId: number;
    name: string;
    contactInfo: string;
    address: string;
    notes: string;
    createdAt:Date;
    updatedAt:Date;
    status:string
}