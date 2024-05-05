
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
}