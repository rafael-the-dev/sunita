
import { WarehouseProductType } from "./product"
import { SaleType } from "./sale";

export type WarehouseType = {
    products: WarehouseProductType[];
    sales: SaleType[];
};