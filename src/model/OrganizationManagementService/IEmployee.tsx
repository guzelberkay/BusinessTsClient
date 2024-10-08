import {IDepartment} from "./IDepartment.tsx";
import {IManager} from "./IManager.tsx";

export interface IEmployee {
    id: number;
    memberId:number
    authId: number;
    department:IDepartment;
    manager:IManager;
    identityNo: string;
    phoneNo: string;
    name: string;
    surname:string;
    email: string;
    createdAt:Date;
    updatedAt:Date;
    status:string
}