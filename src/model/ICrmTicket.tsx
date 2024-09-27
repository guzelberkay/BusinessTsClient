export interface ICrmTicket{
    id: number;
    memberId: number;
    customerId: number;
    subject: string;
    description: string;
    ticketStatus: string;
    priority: string;
    createdDate: Date;
    closedDate: Date;
    status: string;
}