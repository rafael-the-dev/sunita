
export enum STATUS {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUCCESSFUL = "successful",
    UNSUCCESSFUL = "unsuccessful"
}

export type FetchResponseType<T> = {
    data: T
}