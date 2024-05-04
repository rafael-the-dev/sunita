
import { ExpenseType } from "./expense";
import { WarehouseProductType } from "./product"
import { SaleType } from "./sale";
import { StockReportType } from "./stock";

export type WarehouseType = {
    expenses: ExpenseType[];
    products: WarehouseProductType[];
    sales: SaleType[];
    "stock-reports": StockReportType[];
};