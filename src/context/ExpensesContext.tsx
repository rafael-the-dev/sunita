import * as React from "react";
import currency from "currency.js";
import { v4 as uuidV4} from "uuid";

import { ExpenseInfoType, ExpenseItemType } from "@/types/expense"
import { AppContext } from "./AppContext";

type ExpensesContextType = {
    addItem: () => void;
    addCategory: (value: string) => void;
    canISubmit: boolean;
    getItems: () => ExpenseItemType[];
    getCategory: () => string;
    removeItem: (id: string) => void;
    totalPrice: number;
    toString: () => string;
    updateItem: (id: string, key: string, value: string) => void
}

export const ExpensesContext = React.createContext<ExpensesContextType | null>(null);
ExpensesContext.displayName = "ExpensesContext";

const getNewItem = () => {
    return {
        description: "",
        id: uuidV4(),
        price: 0
    }
};

export const ExpensesContextProvider = ({ children }) => {
    const { dialog } = React.useContext(AppContext);

    const [ category, setCategory ] = React.useState(() => {
        if(dialog && dialog.payload) {
            return (dialog.payload as ExpenseInfoType).category.id;
        }

        return "-1"
    });

    const [ itemsList, setItemsList ] = React.useState<ExpenseItemType[]>(() => {
        if(dialog && dialog.payload) {
            return (dialog.payload as ExpenseInfoType).items;
        }
        
        return [ getNewItem() ];
    });

    const canISubmit = React.useMemo(() => {
        return !Boolean(itemsList.find(({ description, price }) => {
            return !Boolean(description.trim()) || currency(price).value <= 0;
        }))
    }, [ itemsList ]);

    const totalPrice = React.useMemo(() => {
        return itemsList.reduce((prevValue, currentItem) => {
            return currency(currentItem.price).add(prevValue).value
        }, 0);
    }, [ itemsList ])

    const addItem = React.useCallback(() => {
        setItemsList(list => [ ...list, getNewItem() ]);
    }, []);

    const addCategory = React.useCallback((category: string) => setCategory(category), [])

    const removeItem = React.useCallback((id: string) => {
        setItemsList(list => [ ...list.filter(item => item.id !== id) ]);
    }, []);

    const updateItem = React.useCallback((id: string, key: string, value: string) => {
        setItemsList(currentList => {
            const list = structuredClone([ ...currentList ]);

            const item = list.find(item => item.id === id);

            if(!item) return currentList;

            item[key] = value;

            return list;
        })
    }, []);

    const getCategory = React.useCallback(() => category, [ category ])
    const getItems = React.useCallback(() => structuredClone(itemsList), [ itemsList ]);

    const toString = React.useCallback(() => {
        return JSON.stringify({
            category: getCategory(),
            items: getItems(),
            total: totalPrice
        })
    }, [ getCategory, getItems, totalPrice ])

    return (
        <ExpensesContext.Provider
            value={{
                addItem, addCategory,
                canISubmit,
                getCategory,
                getItems,
                removeItem,
                totalPrice,
                toString,
                updateItem
            }}>
            { children }
        </ExpensesContext.Provider>
    );
};