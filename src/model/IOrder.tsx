export interface IOrder {
    id: number;
    customerId:number
    productId:number
    quantity:number
    unityPrice:number
    total:number
    createdAt:Date;
    updatedAt:Date;
    status:string
}