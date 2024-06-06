import moment from "moment";
import currency from "currency.js";

import { ConfigType } from "@/types/app-config-server";
import { WarehouseType } from "@/types/warehouse";
import { WarehouseProductType } from "@/types/product";
import { AnalyticStockReportInfoType, StockClientRequestBodyType, StockClientRequestItemType, StockReportInfoType, StockReportType } from "@/types/stock";
import { isValidDate, isValidPrice, isValidReference } from "@/helpers/stock-report";
import { getId } from "@/helpers/id";

import Store from "./Warehouse";
import { sort } from "@/helpers/sort";


type AddPropsType = {
    storeId: string;
    stockDetails: StockClientRequestBodyType
}

type GetAllProspType = {
    storeId: string;
}

class Stock {
    static async getAll({ storeId }: GetAllProspType, { mongoDbConfig, user }: ConfigType): Promise<AnalyticStockReportInfoType> {
        const list =  await mongoDbConfig.collections
            .WAREHOUSES
            .aggregate([
                { $match: { id: storeId }},
                { $unwind: "$stock-reports" },
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
                        /*user: { 
                            $first: {
                                firstName: "$user_info.firstName",
                                lastName: "$user_info.lastName",
                                username: "$user_info.username"
                            }
                        }*/
                    }
                }
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
        const createdAt = moment(stockDetails.createdAt);

        //check if date is not greater than current date, Date.now()
        isValidDate(createdAt);

        //check if cart's total price is valid
        isValidPrice(structuredClone(stockDetails))

        const reportId = getId();

        let currentProducts: WarehouseProductType[] = [];
        let currentStockReports: StockReportType[] = [];
        let hasRetrieveCurrentStoreDetails = false;

        const productsMap = new Map<string, StockClientRequestItemType>()

        const config = {
            mongoDbConfig,
            user
        };

        try {
            const storeDetails = await Store.get({ id: storeId }, { mongoDbConfig, user });

            //throw an InvalidArgumentError if reference is invalid
            isValidReference(storeDetails, stockDetails.reference);
            
            stockDetails.items.forEach(item => {
                productsMap.set(item.product.id, item);
            });

            //clone products and stock-reports upcoming use, in case an error occur
            currentProducts = structuredClone(storeDetails.products);
            currentStockReports = structuredClone(storeDetails["stock-reports"]);

            hasRetrieveCurrentStoreDetails = true;

            await Promise.all([
                Store.update<StockReportType[]>(
                    {
                        helper(store: WarehouseType) {
                            const reports = structuredClone(store['stock-reports']);

                            const report: StockReportType = {
                                createdAt: createdAt.toISOString(),
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
                    config  
                ),
                Store.update<WarehouseProductType[]>(
                    {
                        helper(store: WarehouseType) {
                            const products = structuredClone(store.products);

                            products.forEach(product => {
                                // get current product from mappedStockItem map
                                const mappedStockItem = productsMap.get(product.id);

                                /**
                                 * it was mapped update its quantity, sellPrice, purchasePrice and profit fields base on mapped details
                                 */
                                if(mappedStockItem) {
                                    const mappedStockItemProduct = mappedStockItem.product;

                                    product.stock.quantity = currency(product.stock.quantity).add(mappedStockItem.quantity).value;
                                    product.sellPrice = mappedStockItemProduct.sellPrice;
                                    product.purchasePrice = mappedStockItemProduct.purchasePrice;
                                    product.profit = currency(mappedStockItemProduct.sellPrice).subtract(mappedStockItemProduct.purchasePrice).value
                                }
                            })

                            return products;
                        },
                        id: storeId,
                        key: "products"
                    },
                    config 
                )
            ])
        } catch(e) {
            /**
             * update store with its previous stock-reports and products with occurend an errory
             */
            await Promise.all([
                Store.update<StockReportType[]>(
                    {
                        helper(store: WarehouseType) {
                            return hasRetrieveCurrentStoreDetails ? currentStockReports : store["stock-reports"];
                        },
                        id: storeId,
                        key: "stock-reports"
                    },
                    config  
                ),
                Store.update<WarehouseProductType[]>(
                    {
                        helper(store: WarehouseType) {
                            return hasRetrieveCurrentStoreDetails ? currentProducts : store.products;
                        },
                        id: storeId,
                        key: "products"
                    },
                    config 
                )
            ])

            throw e
        }
    }
}

export default Stock;