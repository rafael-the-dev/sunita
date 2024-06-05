import { useEffect } from "react";

import { CartType } from "@/types/cart";
import { ProductInfoType } from "@/types/product";

import { getItem, setItem } from "@/helpers/local-storage"


//:;
export const useLocalStorage = (cart: CartType<ProductInfoType>) => {

    useEffect(() => {
        setItem<CartType<ProductInfoType>[]>({
            fn(prevList) {
                if(!prevList || !Array.isArray(prevList)) return [];

                const currentCart = prevList.find(item => item.id === cart.id);

                if(currentCart) {
                    currentCart.items = structuredClone(cart.items);
                    currentCart.total = cart.total;
                } else {
                    prevList.push(cart)
                }

                return prevList;
            },
            key: "carts",
            value: [ cart ]
        });
    }, [ cart ]);
};