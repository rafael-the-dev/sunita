import currency from "currency.js";

import { RequestCartItem } from "@/types/cart";
import { SaleItemType } from "@/types/sale";
import { StoreProductType } from "@/types/product";

import { getProduct, isValidCartItemTotalPrice, updateSale } from "@/helpers/sales";
import { isInvalidNumber } from "@/helpers/validation";

import InvalidArgumentError from "@/errors/server/InvalidArgumentError";

type PropsType = {
    cartItems: SaleItemType[],
    itemsList: SaleItemType[],
    itemsMapper: Map<string, RequestCartItem>,
    productsMapper: Map<string, StoreProductType>
}

export const getAndSetTotalValues = ({ cartItems, itemsList, itemsMapper, productsMapper }: PropsType) => {
    let totalProfit = 0

    const totalPrice =  cartItems.reduce((prevValue, currentItem) => {
        //check if current item quantity value is valid, then throws an error if not
        if(isInvalidNumber(currentItem.quantity)) {
            throw new InvalidArgumentError("Quantity must not be less than or equal to zero");
        }

        const currentProduct = getProduct(productsMapper, currentItem.product.id);

        if(currentItem.quantity > currentProduct.stock.quantity) {
            throw new InvalidArgumentError(`Quantity is greater than available stock`);
        }

        isValidCartItemTotalPrice(currentItem, currentProduct);

        const item = {
            ...currentItem,
            id: currentItem.product.id,
            product: {
                id: currentItem.product.id,
                price: currentProduct.sellPrice
            }
        };

        //sum profit
        totalProfit = currency(totalProfit).add(currency(currentProduct.profit).multiply(currentItem.quantity).value).value;
        itemsList.push(item);
        itemsMapper.set(currentProduct.id, currentItem);

        const price = currency(currentProduct.sellPrice).multiply(currentItem.quantity);
        return currency(prevValue).add(price).value;
    }, 0);

    return {
        totalPrice,
        totalProfit
    }
}