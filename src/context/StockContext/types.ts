import { CartType } from "@/types/cart"
import { ProductInfoType } from "@/types/product";

export type SetterFuncType = ( product: ProductInfoType, value: number | string, type?: string) => void;

export type StockReportInputProps = {
    error: boolean;
    helperText: string;
    value: string;
}

export type StockReportType = {
    date: StockReportInputProps;
    reference: StockReportInputProps;
}

export type StockContextType = {
    addItem: (product: ProductInfoType, quantity: number) => void;
    getCart: () => CartType<ProductInfoType>;
    getStockReport: () => StockReportType;
    hasErrors: () => boolean;
    reset: () => void;
    setQuantity: SetterFuncType;
    setSellPrice: SetterFuncType;
    setDate: (value: string) => void;
    setReference: (value: string) => void;
    setTotal: SetterFuncType;
    productsList: ProductInfoType[];
    removeItem: (productId: string) => void;
    toString: () => string;
}