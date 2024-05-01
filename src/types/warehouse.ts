
import { ExpenseType } from "./expense";
import { WarehouseProductType } from "./product"
import { SaleType } from "./sale";

export type WarehouseType = {
    expenses: ExpenseType[];
    products: WarehouseProductType[];
    sales: SaleType[];
};