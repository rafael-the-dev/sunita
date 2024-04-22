import { ReactNode } from "react";

export type TableClassesType = {
    root?: string;
    table?: string;
    tableHeadCell?: string;
    tableHeaderRow?: string;
    tableFooter?: string;
};

export type TableDataType = {};

export type TableKeyType = {
    value: string;
    subKey?: TableKeyType;
};

export type TableHeadersType = {
    getComponent?: ({ item, key }: { item: Object, key: TableKeyType }) => ReactNode;
    label: string;
    key: TableKeyType;
    subValue?: any;
    value?: any;
}