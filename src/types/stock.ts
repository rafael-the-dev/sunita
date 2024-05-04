
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
    items: StockClientRequestItemType[];
    reference: string;
    total: number;
}

export type StockReportType = StockClientRequestBodyType & {
    createdAt: Date | string;
    id: string;
    modifiedAt: string | Date | null;
}