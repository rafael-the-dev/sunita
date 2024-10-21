
export enum LATE_PAYMENT_FINE_PERIOD {
    DAY = "d",
    WEEK = "w",
    MONTH = "w",
    YEAR = "y"
}

export enum PERIOD {
    DAY = "DD",
    WEEK = "ddd",
    MONTH = "MMM",
    YEAR = "YYYY"
}

export type SerieType = {
    period: string,
    totalAmount: number
}

export type ChartSerieType = {
    list: SerieType[],
    period: string
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

export 
type MethodType = "DELETE" | "GET" | "POST" | "PUT"