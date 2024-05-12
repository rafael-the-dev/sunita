import { TableKeyType } from "@/components/table/types";


export const getColumnCellKey = (key: TableKeyType) => {
    const { subKey, value } = key;

    if(subKey) {
        return `${value}-${getColumnCellKey(key.subKey)}`;
    }

    return value
};