'use client';

import { FetchDataFuncType } from "@/hooks/useFetch/types";
import * as React from "react";

import { LANGUAGE } from "@/types/language"

import { configLocalStorage, getItem, setItem } from "@/helpers/local-storage";

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

const isValidLanguage = (language: LANGUAGE) => {
    return Object
        .values(LANGUAGE)
        .includes(language)
}

export const AppContext = React.createContext<AppContextType | null>(null);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [ dialog, setDialog ] = React.useState<DialogType | null>(null);
    const [ language, setLanguage ] = React.useState(LANGUAGE.PORTUGUESE)

    const isLoading = React.useRef(false);
    const fetchDataRef = React.useRef<FetchDataFuncType>(null)

    const changeLanguage = React.useCallback(
        (language: LANGUAGE) => {
            const isValid = isValidLanguage(language)

            if(isValid) setLanguage(language)
        },
        []
    )

    React.useEffect(
        () => {
            try {
                const language = getItem<LANGUAGE>("language")

                if(isValidLanguage(language)) setLanguage(language)
            } catch(e) {
                configLocalStorage();
            }
        }, 
        []
    );

    React.useEffect(
        () => {
            setItem({ 
                key: "language", 
                value: language 
            });
        },
        [ language ]
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