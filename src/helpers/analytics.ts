import currency from "currency.js";

import { SaleInfoType } from "@/types/sale";

export const getSalesStats = (sales: SaleInfoType[]) => {
    const salesStats = {
        profit: 0,
        total: 0
    };

    sales.forEach((currentSale) => {
        salesStats.profit = currency(salesStats.profit).add(currentSale.profit).value;
        salesStats.total = currency(salesStats.total).add(currentSale.total).value;
    });

    return salesStats;
};