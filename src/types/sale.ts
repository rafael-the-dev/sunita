

export type SaleType = {
    changes: number;
    createAt: Date;
    id: string;
    products: {
        id: string;
        price: number;
        quantity: number;
    }[];
    total: number;
    totalReceived: number;
    user: string;
}