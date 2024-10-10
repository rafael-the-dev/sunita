'use client';

import { FetchDataFuncType } from "@/hooks/useFetch/types";
import * as React from "react";

import { LANGUAGE } from "@/types/language"

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
    changeLanguage: (language: LANGUAGE) => void,
    dialog: DialogType | null,
    isLoading: React.MutableRefObject<boolean>;
    fetchDataRef: React.MutableRefObject<FetchDataFuncType>,
    language: LANGUAGE
    setDialog: React.Dispatch<React.SetStateAction<DialogType>>
};

export const AppContext = React.createContext<AppContextType | null>(null);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [ dialog, setDialog ] = React.useState<DialogType | null>(null);
    const [ language, setLanguage ] = React.useState(LANGUAGE.PORTUGUESE)

    const isLoading = React.useRef(false);
    const fetchDataRef = React.useRef<FetchDataFuncType>(null)

    const changeLanguage = React.useCallback(
        (language: LANGUAGE) => {
            const isValid = Object
                .values(LANGUAGE)
                .includes(language)

            if(isValid) setLanguage(language)
        },
        []
    )

    return (
        <AppContext.Provider
            value={{
                changeLanguage,
                dialog,
                fetchDataRef,
                isLoading,
                language,
                setDialog
            }}>
            { children }
        </AppContext.Provider>
    )
};