import { AddressType } from "./address"
import { CategoryType as ExpenseCategory } from "./category"
import { ContactType } from "./contact";
import { ExpenseType } from "./expense";
import { PaymentType } from "./payment-method";
import { WarehouseProductType } from "./product"
import { RoomType, BookingDBType } from "./room"
import { SaleDebtType, SaleType } from "./sale";
import { StockReportType } from "./stock";
import { StoreUserType } from "./user";
import { STATUS } from ".";
import { StoreCustomerType } from "./guest";
import { User as UserType } from "./user";

export enum STORE_AMENITIES {
    BAR = "bar",
    GYM = "gym",
    POLL = "poll",
    PARKING = "parking",
    TV = "televesion",
    WI_FI = "wi-fi"
} 

type TableMatch = {
    createdAt: string | Date,
    id: string
}

export type AbstractStoreType = {
    address: AddressType,
    contact: ContactType;
    id: string;
    name: string,
    status: STATUS
}

export type EnrollStoreType = AbstractStoreType & {
    payment: PaymentType,
    users: UserType[],
}

export type BaseStore = AbstractStoreType & {
    rooms: TableMatch[];
}

type Supplier = {
    createdAt: string | Date,
    id: string
}

export type WarehouseType = BaseStore & {
    clients: StoreCustomerType[],
    "expenses-categories": ExpenseCategory[],
    expenses: ExpenseType[];
    products: WarehouseProductType[];
    "rooms-booking": BookingDBType[],
    sales: SaleType[];
    suppliers: Supplier[],
    "stock-reports": StockReportType[];
    users: StoreUserType[],
    "unpaid-sales": SaleDebtType[]
};

export type StoreType = WarehouseType

export type StoresResponse<T> = {
    list: T
}

