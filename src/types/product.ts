
export type ProductType = {
    category: string;
    id?: string;
    name: string;
    barcode?: string;
    purchasePrice: number;
    sellPrice: number;
};

export type ProductInfoType = {
    category: string;
    barcode?: string;
    id: string;
    name: string;
    profit: number;
    purchasePrice: number;
    stock: {
        quantity: number
    };
    sellPrice: number;
}

export type GblobalProductType = {
    category: string;
    id: string;
    name: string;
    barcode?: string;
    warehouses: string[]
}

export type WarehouseProductType = {
    id: string;
    profit: number;
    purchasePrice: number;
    stock: {
        quantity: number
    };
    sellPrice: number;
};