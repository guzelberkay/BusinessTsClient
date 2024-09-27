export interface IInvoice{
    id: number;
    customerIdOrSupplierId: number;
    invoiceDate: Date;
    totalAmount: number;
    paidAmount: number;
    invoiceStatus: string;
    description: string;
}