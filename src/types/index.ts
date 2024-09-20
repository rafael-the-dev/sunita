
export enum LATE_PAYMENT_FINE_PERIOD {
    DAY = "d",
    WEEK = "w",
    MONTH = "w",
    YEAR = "y"
}

export enum STATUS {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUCCESSFUL = "successful",
    UNSUCCESSFUL = "unsuccessful"
}

export type FetchResponseType<T> = {
    data: T
}