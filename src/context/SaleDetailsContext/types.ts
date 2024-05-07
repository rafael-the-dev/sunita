import { FetchDataFuncType } from "@/hooks/useFetch/types";
import { SaleInfoItemType, SaleInfoType } from "@/types/sale"

export type QuantityFuncType = (productId: string, quantity: number | string) => void;
export type SetHelperFuncType =(productId: string, func: (item: SaleInfoItemType) => void) => void;

export type SaLeDetailsContextType = {
    changeQuantity: QuantityFuncType;
    getSaleDetails: () => SaleInfoType;
    isModified: boolean;
    increment: QuantityFuncType;
    removeItem: (productId: string) => void;
    refreshData: FetchDataFuncType;
    toString: () => string;
}