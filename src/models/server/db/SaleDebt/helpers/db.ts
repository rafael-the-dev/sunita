import currency from "currency.js";

import { ConfigType } from "@/types/app-config-server";
import { MongoDbConfigType } from "@/types/mongoDb";
import { RequestCartItem } from "@/types/cart";
import { SaleDebtInfoType } from "@/types/sale";
import { StoreProductType } from "@/types/product";

import getProductProxy from "@/models/server/proxy/product";
import { updateProduct } from "@/helpers/products";

export const updateSaleDebt = (saleProxy: SaleDebtInfoType, storeId: string, mongoDbConfig: MongoDbConfigType) => {
    return mongoDbConfig
        .collections
        .WAREHOUSES
        .updateOne(
            { id: storeId, "unpaid-sales.id": saleProxy.id },
            { 
                $set: {
                    "unpaid-sales.$[sale].changes": saleProxy.changes,
                    "unpaid-sales.$[sale].items": saleProxy.items,
                    "unpaid-sales.$[sale].profit": saleProxy.profit,
                    "unpaid-sales.$[sale].paymentMethods": saleProxy.paymentMethods,
                    "unpaid-sales.$[sale].remainingAmount": saleProxy.remainingAmount,
                    "unpaid-sales.$[sale].totalReceived": saleProxy.totalReceived,
                    "unpaid-sales.$[sale].total": saleProxy.total,
                }
            },
            {
                arrayFilters: [
                    { "sale.id": saleProxy.id }
                ]
            }
        )
}

type UpdateUnpaidSaleDebtProductsPropsType = {
    cartItemsMapper: Map<string, RequestCartItem>,
    products: StoreProductType[],
    unpaidSale: SaleDebtInfoType
}

export const updateProductInDB = (products: StoreProductType[], config: ConfigType) => {
    return products.map(product => {
            return updateProduct(
                getProductProxy(product), 
                config.user.stores[0].storeId, 
                config
            )
        }
    )
}

export const updateSaleDebtProduct = async ({ cartItemsMapper, products, unpaidSale }: UpdateUnpaidSaleDebtProductsPropsType, config: ConfigType) => {
    products.forEach(product => {
        const productProxy = getProductProxy(product)

        const mappedCartItem = cartItemsMapper.get(product.id);
        const saleItem = unpaidSale.items.find(item => item.product.id === product.id);  

        const difference = currency(saleItem.quantity).subtract(mappedCartItem.quantity).value;
        saleItem.quantity = currency(saleItem.quantity).subtract(difference).value;
        saleItem.total = currency(saleItem.quantity).multiply(saleItem.product.sellPrice).value;

        productProxy.stock.quantity = currency(product.stock.quantity).add(difference).value
    })

    await Promise.all(updateProductInDB(products, config))
}