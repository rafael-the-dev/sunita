import * as React from "react";
import currency from "currency.js";
import { v4 as uuidV4} from "uuid";

type ExpensesItemType = {
    description: string;
    id: string;
    price: number;
};

type ExpensesContextType = {
    addItem: () => void;
    addCategory: (value: string) => void;
    canISubmit: boolean;
    getItems: () => ExpensesItemType[];
    getCategory: () => string;
    removeItem: (id: string) => void;
    totalPrice: number;
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
    const [ category, setCategory ] = React.useState("credelec");
    const [ itemsList, setItemsList ] = React.useState<ExpensesItemType[]>([ getNewItem() ]);

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
    const getItems = React.useCallback(() => itemsList, [ itemsList ]);

    return (
        <ExpensesContext.Provider
            value={{
                addItem, addCategory,
                canISubmit,
                getCategory,
                getItems,
                removeItem,
                totalPrice,
                updateItem
            }}>
            { children }
        </ExpensesContext.Provider>
    );
};