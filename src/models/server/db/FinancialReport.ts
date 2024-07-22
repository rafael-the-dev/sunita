import { ConfigType } from "@/types/app-config-server";

import { FinancialReportType } from "@/types/financial-report";

import Expense from "./Expenses";

class FinalcialReport {
    static async getAll({ storeId }: { storeId: string }, { mongoDbConfig, user }: ConfigType) {
        const [ expenses ] = await Promise.all([
            Expense.getAll({ storeId }, { mongoDbConfig, user })
        ])

        /*const financialReports: FinancialReportType = {
            createdAt:
            totalExpenses: 0
        }*/
    }
}

export default FinalcialReport