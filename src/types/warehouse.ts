import { STATUS } from ".";
import { CategoryType as ExpenseCategory } from "./category"
import { ExpenseType } from "./expense";
import { WarehouseProductType } from "./product"
import { SaleType } from "./sale";
import { StockReportType } from "./stock";
import { USER_CATEGORY } from "./user";

export type WarehouseType = {
    "expenses-categories": ExpenseCategory[],
    expenses: ExpenseType[];
    id: string;
    products: WarehouseProductType[];
    sales: SaleType[];
    "stock-reports": StockReportType[];
    users: {
        createdAt: Date | string;
        category: USER_CATEGORY;
        logs: [];
        status: STATUS;
        username: string;

    }[]
};