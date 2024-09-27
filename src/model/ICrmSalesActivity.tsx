export interface ICrmSalesActivity{
    id: number;
    memberId: number;
    opportunityId: number;
    type: string;
    date: Date;
    notes: string;
    status: string;
}