import { CategoryType as ExpenseCategory } from "./category"
import { ContactType } from "./contact";
import { ExpenseType } from "./expense";
import { WarehouseProductType } from "./product"
import { RoomType, SimpleBookingType } from "./room"
import { SaleType } from "./sale";
import { StockReportType } from "./stock";
import { StoreUserType } from "./user";

export type StoreAddressType = {
    country: string,
    city: string,
    cords: {
        lat: number,
        long: number
    },
    province: string,
    street: string
}


export type WarehouseType = {
    address: StoreAddressType,
    contact: ContactType;
    "expenses-categories": ExpenseCategory[],
    expenses: ExpenseType[];
    id: string;
    products: WarehouseProductType[];
    rooms: RoomType[];
    "rooms-booking": SimpleBookingType[],
    sales: SaleType[];
    "stock-reports": StockReportType[];
    users: StoreUserType[]
};