import { SaleInfoType } from "./sale";

export type AnalyticsType = {
    expenses?: {
        list: [];
    };
    sales: {
        list: SaleInfoType[];
        profit: number;
        total: number;
        // list: string;
    };
}