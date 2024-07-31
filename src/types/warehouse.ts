import { CategoryType as ExpenseCategory } from "./category"
import { ContactType } from "./contact";
import { ExpenseType } from "./expense";
import { WarehouseProductType } from "./product"
import { RoomType, BookingDBType } from "./room"
import { SaleType } from "./sale";
import { StockReportType } from "./stock";
import { StoreUserType } from "./user";
import { STATUS } from ".";

export enum STORE_AMENITIES {
    BAR = "bar",
    GYM = "gym",
    POLL = "poll",
    PARKING = "parking",
    TV = "televesion",
    WI_FI = "wi-fi"
}

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

export type BaseStore = {
    amenities: STORE_AMENITIES[],
    address: StoreAddressType,
    contact: ContactType;
    description: string,
    id: string;
    name: string,
    rooms: RoomType[];
    status: STATUS
}

type Supplier = {
    createdAt: string | Date,
    id: string
}

export type WarehouseType = BaseStore & {
    "expenses-categories": ExpenseCategory[],
    expenses: ExpenseType[];
    products: WarehouseProductType[];
    "rooms-booking": BookingDBType[],
    sales: SaleType[];
    suppliers: Supplier[],
    "stock-reports": StockReportType[];
    users: StoreUserType[]
};

export type StoresResponse<T> = {
    list: T
}

