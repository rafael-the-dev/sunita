import { ProductInfoType } from "./product";
import { UserType } from "./user"
export type StockClientRequestItemType = {
    product: {
        id: string;
        purchasePrice: number;
        sellPrice: number;
    };
    quantity: number;
    total: number;
};

export type StockClientRequestBodyType = {
    createdAt: Date | string;
    items: StockClientRequestItemType[];
    reference: string;
    total: number;
}

export type StockReportType = StockClientRequestBodyType & {
    id: string;
    modifiedAt: string | Date | null;
    user: string;
}

export type StockReportInfoItemType = {
    product: {
        category: string;
        barcode?: string;
        id: string;
        name: string;
        purchasePrice: number;
        sellPrice: number;
    };
    quantity: number;
    total: number;
}

export type StockReportInfoType = StockReportType & {
    items: StockReportInfoItemType[];
    user: UserType
}

export type AnalyticStockReportInfoType = {
    list: StockReportInfoType[];
    total: number;
}