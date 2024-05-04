import { CartType } from "@/types/cart"
import { ProductInfoType } from "@/types/product";

export type SetterFuncType = ( product: ProductInfoType, value: number | string, type?: string) => void;

export type StockContextType = {
    addItem: (product: ProductInfoType, quantity: number) => void;
    changeQuantity: (id: string, quantity: number) => void;
    getCart: () => CartType<ProductInfoType>;
    setQuantity: SetterFuncType;
    setSellPrice: SetterFuncType;
    setTotal: SetterFuncType;
    productsList: ProductInfoType[];
    removeItem: (productId: string) => void;
    toString: () => string;
}