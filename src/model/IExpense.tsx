export interface IExpense{
    id: number;
    expenseCategory: string;
    expenseDate: Date;
    amount: number;
    description: string;
    status: string;
}