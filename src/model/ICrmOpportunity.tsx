export interface ICrmOpportunity {
    id: number;
    memberId: number;
    customerId: number;
    name: string;
    description: string;
    value: number;
    stage: string;
    probability: number;
    status:string
}