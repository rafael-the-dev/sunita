import * as React from "react";
import { v4 as uuidV4 } from "uuid"
import currency from "currency.js";

import { CartResquestType } from "@/types/cart";
import { FetchDataFuncType } from "@/hooks/useFetch/types";
import { PaymentMethodType, PaymentType } from "@/types/payment-method";
import { QuantityFuncType, SaLeDetailsContextType, SetHelperFuncType } from "./types";
import { SaleInfoItemType, SaleInfoType } from "@/types/sale";

import usePayment from "./hooks/usePayment";

import { isInvalidNumber } from "@/helpers/validation";
import { calculaCartTotalPrice, calculateProductTotalPrice } from "@/helpers/cart";

export const SaleDetailsContext = React.createContext<SaLeDetailsContextType>(null);

type PropsType = { 
    children: React.ReactNode;
    initial: SaleInfoType;
    url: string;
}

export const SaleDetailsContextProvider = ({ children, initial, url }: PropsType) => {
    const listItemsMap = React.useMemo(() => {
        const map = new Map<string, SaleInfoItemType>();
        
        initial.items.forEach(item => {
            map.set(item.product.id, item);
        });

        return map;
    }, [ initial ]);

    const paymentMaethodsMapper = React.useMemo(
        () => {
            const mapper = new Map<number | string, number>()

            initial
                .paymentMethods
                .forEach(pm => {
                    mapper.set(pm.id, pm.amount)
                })

            return mapper
        },
        [ initial ]
    )
    
    const [ saleDetails, setSaleDetails ] = React.useState<SaleInfoType>(() => {
        return {
            ...(structuredClone(initial)),
            items: initial.items.map(item => ({ ...item, id: uuidV4() }))
        }
    });

    const paymentHandlers = usePayment(
        {
            changes: initial.changes,
            paymentMethods: initial.paymentMethods,
            remainingAmount: initial.changes,
            totalReceived: initial.totalReceived
        },
        saleDetails.total
    )

    const payment = paymentHandlers.getPayment()

    const setHelper: SetHelperFuncType = React.useCallback((productId, func) => {
        setSaleDetails(cart => {
            const modifiedCart = structuredClone({ ...cart });
            
            const item = modifiedCart.items.find(cartItem => cartItem.product.id === productId);

            if(item) {
                const quantityTemp = item.quantity;

                func(item)

                if(isInvalidNumber(item.quantity)) {
                    item.quantity = 1;
                }

                const mappedItem = listItemsMap.get(productId);
                /** 
                    *item.quantity must not be greater than mappedItem.quantity
                    *It's only allowed to decrease qunatity, if you want to increate quantity of the the current sale
                    *create new sale from sales page
                */
                if(item.quantity > mappedItem.quantity) {
                    item.quantity = quantityTemp;
                }

                item.total = calculateProductTotalPrice(item.product.sellPrice, item.quantity);
            } 

            modifiedCart.total = calculaCartTotalPrice(modifiedCart);
            return modifiedCart;
        })
    }, [ listItemsMap ])

    const increment: QuantityFuncType = React.useCallback((productId, quantity) => {
        setHelper(
            productId, 
            item => item.quantity = currency(item.quantity).add(quantity).value 
        )
    }, [ setHelper ])

    const changeQuantity: QuantityFuncType = React.useCallback((productId, quantity) => {
        setHelper(
            productId, 
            item => item.quantity = currency(quantity).value 
        )
    }, [ setHelper ])

    /**
     * remove item from sale details' items list base on product ID
     */
    const removeItem = React.useCallback((productId: string) => {
        setSaleDetails(cart => {
            const cartClone = structuredClone(cart);

            cartClone.items = cartClone.items.filter(item => item.product.id !== productId);

            return cartClone;
        })
    }, []);

    const getSaleDetails = React.useCallback(() => structuredClone(saleDetails), [ saleDetails ]);
    
    const toString = React.useCallback(() => {
        const { items, total } = getSaleDetails();
        const { paymentMethods } = payment

        const body: CartResquestType = {
            changes: payment.changes,
            items: items.map(item => ({
                ...item,
                product: {
                    id: item.product.id
                }
            })),
            paymentMethods: {
                changes: payment.changes,
                list: paymentMethods,
                totalReceived: payment.totalReceived,
            },
            total,
            totalReceived: payment.totalReceived,
        };

        return JSON.stringify(body)
    }, [ getSaleDetails, payment ])

    const isModified = React.useMemo(() => {
        let result = false;

        getSaleDetails().items.forEach(item => {
            const mappedItem = listItemsMap.get(item.product.id);
            
            if(!mappedItem) {
                result = true;
                return;
            }

            if(mappedItem.total !== item.total) {
                result = true;
            }
        })

        const { paymentMethods } = payment

        for(let i = 0; i < paymentMethods.length; i++) {
            const amount = paymentMaethodsMapper.get(paymentMethods[i].id);

            if(!amount || paymentMethods[i].amount !== amount) {
                result = true;
                break;
            }
        }
        
        return result;
    }, [ getSaleDetails, listItemsMap, payment, paymentMaethodsMapper ]);

    return (
        <SaleDetailsContext.Provider
            value={{
                isModified,

                changeQuantity,
                getSaleDetails,
                increment,
                payment,
                paymentHandlers,
                removeItem,
                toString,
                url
            }}>
            { children }
        </SaleDetailsContext.Provider>
    )
};