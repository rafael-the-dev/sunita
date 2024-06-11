
export type ClientCategoryRequestType = {
    name: string;
}

export enum CATEGORY_STATUS {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export type CategoryType = ClientCategoryRequestType &  {
    id: string;
    status: CATEGORY_STATUS;
}