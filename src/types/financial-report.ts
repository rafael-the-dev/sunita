import { ExpenseInfoType } from "./expense";
import { SaleInfoType } from "./sale";

export type PayrollType = {
    amount: number;
    createdAt: Date | string;
    user: string;
}

export type FinancialReportType = {
    createdAt: Date | string;
    id: string;
    periodEnd: Date | string;
    periodStart: Date | string;
    totalExpenses: number;
    totalProfit: number;
    totalSales: number;
    totalSalaries: number;
}

export type FinancialReportDetailsType = FinancialReportType & {
    expenses: ExpenseInfoType[];
    sales: SaleInfoType[];
    salaries: PayrollType[];
}