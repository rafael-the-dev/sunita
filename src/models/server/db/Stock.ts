
import { ConfigType } from "@/types/app-config-server";
import { WarehouseType } from "@/types/warehouse";

import Store from "./Warehouse"
import { getId } from "@/helpers/id";
import Product from "./Product";
import { ProductInfoType, ProductType, WarehouseProductType } from "@/types/product";
import { StockClientRequestBodyType, StockClientRequestItemType, StockReportType } from "@/types/stock";
import currency from "currency.js";

type AddPropsType = {
    storeId: string;
    stockDetails: StockClientRequestBodyType
}

class Stock {
    static async add({ storeId, stockDetails }: AddPropsType, { mongoDbConfig, user }: ConfigType) {
        const reportId = getId();

        let currentProducts: ProductInfoType[] = [];
        const productsMap = new Map<string, StockClientRequestItemType>()

        try {
            const productsIds = stockDetails.items.map(item => {
                productsMap.set(item.product.id, item)
                return item.product.id
            });

            const products = await Product.getAll(
                { filters: { "products.id": { $in: productsIds }}, warehouseId: storeId }, 
                { mongoDbConfig, user }
            );

            currentProducts = structuredClone(products);

            await Promise.all([
                Store.update<StockReportType[]>(
                    {
                        helper(store: WarehouseType) {
                            const reports = structuredClone(store['stock-reports']);

                            const report: StockReportType = {
                                createdAt: new Date(Date.now()).toISOString(),
                                id: reportId,
                                items: stockDetails.items,
                                modifiedAt: null,
                                reference: stockDetails.reference,
                                total: stockDetails.total
                            }

                            reports.push(report)

                            return reports;
                        },
                        id: storeId,
                        key: "stock-reports"
                    },
                    {
                        mongoDbConfig,
                        user
                    }  
                ),
                Store.update<WarehouseProductType[]>(
                    {
                        helper(store: WarehouseType) {
                            const products = structuredClone(store.products);

                            products.forEach(product => {
                                const mappedStockItem = productsMap.get(product.id);

                                if(mappedStockItem) {
                                    product.stock.quantity = currency(product.stock.quantity).add(mappedStockItem.quantity).value;
                                    product.sellPrice = mappedStockItem.product.sellPrice;
                                    product.purchasePrice = mappedStockItem.product.purchasePrice;
                                }
                            })

                            return products;
                        },
                        id: storeId,
                        key: "products"
                    },
                    {
                        mongoDbConfig,
                        user
                    }  
                )
            ])
        } catch(e) {
            throw e
        }
    }
}

export default Stock;