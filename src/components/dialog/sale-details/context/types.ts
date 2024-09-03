import { FetchDataFuncType } from "@/hooks/useFetch/types";
import { PaymentFunctionsType } from "@/hooks/usePayment/types"
import { PaymentType } from "@/types/payment-method";
import { SaleInfoItemType, SaleInfoType } from "@/types/sale"

export type QuantityFuncType = (productId: string, quantity: number | string) => void;
export type SetHelperFuncType =(productId: string, func: (item: SaleInfoItemType) => void) => void;

export type SaLeDetailsContextType = {
    changeQuantity: QuantityFuncType;
    getSaleDetails: () => SaleInfoType;
    isModified: boolean;
    increment: QuantityFuncType;
    payment: PaymentType,
    paymentHandlers: PaymentFunctionsType,
    removeItem: (productId: string) => void;
    toString: () => string;
    url: string;
}