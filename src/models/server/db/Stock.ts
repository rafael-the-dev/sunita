import moment from "moment";
import currency from "currency.js";

import { ConfigType } from "@/types/app-config-server";
import { WarehouseType } from "@/types/warehouse";
import { StoreProductType, WarehouseProductType } from "@/types/product";
import { AnalyticStockReportInfoType, StockClientRequestBodyType, StockClientRequestItemType, StockReportInfoType, StockReportType } from "@/types/stock";

import { isValidDate, isValidPrice, isValidReference } from "@/helpers/stock-report";
import { updateProduct } from "@/helpers/products";


import { getId } from "@/helpers/id";
import { sort } from "@/helpers/sort";
import getProductProxy from "../proxy/product";
import getStockProxy from "../proxy/stock";

import Store from "./Warehouse";
import Error404 from "@/errors/server/404Error";

import Product from "./Product"


type AddPropsType = {
    storeId: string;
    stockDetails: StockClientRequestBodyType
}

type GetAllProspType = {
    filters?: Object,
    storeId: string;
}

class Stock {
    static async getAll({ filters, storeId }: GetAllProspType, { mongoDbConfig, user }: ConfigType): Promise<AnalyticStockReportInfoType> {
       
        const list =  await mongoDbConfig.collections
            .WAREHOUSES
            .aggregate([
                { $match: { id: storeId }},
                { $unwind: "$stock-reports" },
                { $match: { ...(filters ?? {} ) } },
                { $unwind: "$stock-reports.items" },
                {
                    $lookup: {
                        from: "products",
                        foreignField: "id",
                        localField: "stock-reports.items.product.id",
                        as: "product_info"
                    }
                },
                { $unwind: "$product_info" },
                {
                    $lookup: {
                        from: "users",
                        foreignField: "username",
                        localField: "stock-reports.user",
                        as: "user_info"
                    },
                },
                { $unwind: "$user_info" },
                {
                    $addFields: {
                        "stock-reports.items.product": {
                            item: "$product_info", // Embed product info into sales document:;
                            // price: 
                        }
                    }
                },
                {
                    $group: {
                        _id: "$stock-reports.id",
                        createdAt: { $first: "$stock-reports.createdAt" },
                        id: { $first: "$stock-reports.id" },
                        items: {
                            $push: {
                                quantity: "$stock-reports.items.quantity",
                                total: "$stock-reports.items.total",
                                product: {
                                    barcode: "$product_info.barcode",
                                    category: "$product_info.category",
                                    id: "$stock-reports.items.product.id",
                                    name: "$product_info.name",
                                    purchasePrice: "$stock-reports.items.product.purchasePrice",
                                    sellPrice: "$stock-reports.items.product.sellPrice",
                                }
                            }
                        },
                        modifiedAt: { $first: "$stock-reports.modifiedAt" },
                        reference: { $first: "$stock-reports.reference" },
                        total: { $first: "$stock-reports.total" },
                        user: { 
                            $first: {
                                firstName: "$user_info.firstName",
                                lastName: "$user_info.lastName",
                                username: "$user_info.username"
                            }
                        }
                    }
                },
            ])
            .toArray() as StockReportInfoType[];
            
        const total = list.reduce((prevValue, currentReport) => {
            return currency(prevValue).add(currentReport.total).value
        }, 0)

        sort(list)

        return {
            list, 
            total
        }
        
    }

    static async add({ storeId, stockDetails }: AddPropsType, { mongoDbConfig, user }: ConfigType) {        
        const reportId = getId();

        const productsList = await Product.getAll(
            {
                filters: {
                    id: { $in: stockDetails.items.map(item => item.product.id) }
                },
                storeId
            },
            {
                mongoDbConfig,
                user
            }
        )

        /*const stores = await mongoDbConfig
            .collections
            .WAREHOUSES
            .aggregate([
                { $match: { id: storeId } },
                { $unwind: "$products" },
                { $match: { "products.id": { $in: stockDetails.items.map(item => item.product.id )} } },
                { $group: {
                    _id: "$_id",
                    products: {
                        $push: {
                            barcode: "$products.barcode",
                            id: "$products.id",
                            purchasePrice: "$products.purchasePrice",
                            sellPrice: "$products.sellPrice",
                            stock: "$products.stock",
                        }
                    },
                }}
            ])
            .toArray() as WarehouseType[]*/
        
        if(productsList.length === 0 || productsList.length !== stockDetails.items.length) throw new Error404("Select products not found.");

        let currentProducts: WarehouseProductType[] = [];
       
        const productsMap = new Map<string, StockClientRequestItemType>()

        try {
            stockDetails.items.forEach(item => {
                productsMap.set(item.product.id, item);
            });

            const report: StockReportType = {
                createdAt: "",
                id: reportId,
                items: [],
                modifiedAt: null,
                reference: "",
                total: 0,
                user: user.username
            };

            const stockProxy = getStockProxy(report);

            stockProxy.createdAt = stockDetails.createdAt;
            stockProxy.items = stockDetails.items;
            stockProxy.reference = stockDetails.reference;
            stockProxy.total = stockDetails.total;

            await mongoDbConfig
                .collections
                .WAREHOUSES
                .updateOne(
                    { id: storeId },
                    { 
                        $push: {
                            "stock-reports": report
                        }
                    }
                )

            const productsListClone = structuredClone(productsList)
            
            await Promise.all(
                structuredClone(stockDetails).items.map((item) => {
                    const product = productsListClone.find(product => product.id === item.product.id)

                    // get current product from mappedStockItem map
                    const mappedStockItem = productsMap.get(item.product.id);
                    
                    if(!product || !mappedStockItem) throw new Error404(`Product with id '${item.product.id}' not found`)

                    /**
                     * If It was mapped update its quantity, sellPrice, purchasePrice and profit fields base on mapped details
                     */
                    const productProxy = getProductProxy(product)
                    
                    const mappedStockItemProduct = mappedStockItem.product;

                    productProxy.stock.quantity = currency(product.stock.quantity).add(mappedStockItem.quantity).value;
                    productProxy.sellPrice = mappedStockItemProduct.sellPrice;
                    productProxy.purchasePrice = mappedStockItemProduct.purchasePrice;
                    productProxy.profit = currency(mappedStockItemProduct.sellPrice).subtract(mappedStockItemProduct.purchasePrice).value

                    return updateProduct(product, storeId, { mongoDbConfig, user })//updateProduct(productProxy, storeId, mongoDbConfig)
                })
            )
            
        } catch(e) {
            console.error(e)
            /**
             * update store with its previous stock-reports and products with occurend an errory
             */
            await Promise.all([
                mongoDbConfig
                    .collections
                    .WAREHOUSES
                    .updateOne(
                        { id: storeId },
                        { 
                            $pull: {
                                "stock-reports": {
                                    id: reportId
                                }
                            }
                        }
                    ),
                ...structuredClone(productsList).map(product => {
                    return updateProduct(product, storeId, { mongoDbConfig, user })
                })
            ])

            throw e
        }
    }
}

export default Stock;