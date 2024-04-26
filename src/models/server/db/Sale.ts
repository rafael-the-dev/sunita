import { v4 as uuidV4} from "uuid"
import currency from "currency.js";

import { ConfigType } from "@/types/app-config-server";
import { CartResquestType, RequestCartItem } from "@/types/cart";
import { SaleType } from "@/types/sale";

import ProductModel from "./Product";
import Store from "./Warehouse"
import Error404 from "@/errors/server/404Error";

class Sale {
    static async register({ cart, warehouseId }: { cart: CartResquestType, warehouseId: string }, { mongoDbConfig, user }: ConfigType) {
        const productsIds = cart.items.map(item => item.product.id)

        const [ products, warehouse ] = await Promise.all([
            await ProductModel.getAll({ warehouseId }, { mongoDbConfig, user }),
            mongoDbConfig.collections.WAREHOUSES.findOne({ id: warehouseId })
        ]);

        const selectedProducts = products.filter(product => productsIds.includes(product.id))
        
        const itemsList = [];
        const productsMap = new Map<string, RequestCartItem> ();

        const totalPrice =  cart.items.reduce((prevValue, currentItem) => {
            const currentProduct = selectedProducts.find(product => currentItem.product.id === product.id);

            if(!currentProduct) throw new Error404(`Product with '${currentItem.product.id}' id not found`);

            const item = {
                ...currentItem,
                product: {
                    id: currentItem.product.id,
                    price: currentProduct.sellPrice
                }
            };

            itemsList.push(item);
            productsMap.set(currentProduct.id, currentItem);

            const price = currency(currentProduct.sellPrice).multiply(currentItem.quantity);
            return currency(prevValue).add(price).value;
        }, 0)

        if(totalPrice !== cart.total) {
            throw new InvalidArgumentError("Client total price doesn't match with server total price")
        }

        let sale: SaleType = {
            changes: cart.changes,
            createAt: new Date(),
            id: uuidV4(),
            products: itemsList,
            total: cart.total,
            totalReceived: cart.totalReceived,
            user: "rafaeltivane"
        };

        const sales = structuredClone(warehouse.sales);
        sales.push(sale)
        
        const updatedProducts = products.map(product => {
            const mappedProduct = productsMap.get(product.id);

            if(mappedProduct) {
                return {
                    ...product,
                    stock: {
                        quantity: currency(product.stock.quantity).subtract(mappedProduct.quantity).value
                    }
                }
            }

            return product
        })

        await mongoDbConfig.collections.WAREHOUSES.updateOne({}, { $set: { products: updatedProducts, sales }});
    }
}

export default Sale