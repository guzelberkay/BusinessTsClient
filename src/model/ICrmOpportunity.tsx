export interface ICrmOpportunity {
    id: number;
    memberId: number;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    budget: number;
    status: string;
}