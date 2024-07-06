import { CategoryType as ExpenseCategory } from "./category"
import { ExpenseType } from "./expense";
import { WarehouseProductType } from "./product"
import { SaleType } from "./sale";
import { StockReportType } from "./stock";
import { StoreUserType } from "./user";

export type WarehouseType = {
    "expenses-categories": ExpenseCategory[],
    expenses: ExpenseType[];
    id: string;
    products: WarehouseProductType[];
    sales: SaleType[];
    "stock-reports": StockReportType[];
    users: StoreUserType[]
};