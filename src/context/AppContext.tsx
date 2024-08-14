'use client';

import { FetchDataFuncType } from "@/hooks/useFetch/types";
import * as React from "react";

type DialogType = {
    header?: {
        onClose?: () => void;
        title: string;
    };
    body: React.ReactNode;
    footer?: React.ReactNode,
    payload?: Object
};

type AppContextType = {
    dialog: DialogType | null,
    isLoading: React.MutableRefObject<boolean>;
    fetchDataRef: React.MutableRefObject<FetchDataFuncType>
    setDialog: React.Dispatch<React.SetStateAction<DialogType>>
};

export const AppContext = React.createContext<AppContextType | null>(null);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [ dialog, setDialog ] = React.useState<DialogType | null>(null);

    const isLoading = React.useRef(false);
    const fetchDataRef = React.useRef<FetchDataFuncType>(null)

    return (
        <AppContext.Provider
            value={{
                dialog,
                fetchDataRef,
                isLoading,
                setDialog
            }}>
            { children }
        </AppContext.Provider>
    )
};