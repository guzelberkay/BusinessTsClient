export interface IProduct {
    id: number;
    productCategoryId:number;
    name: string;
    description: string;
    price: number;
    stockCount: number;
    minimumStockLevel: number;
    createdAt:Date;
    updatedAt:Date;
    status:string
}