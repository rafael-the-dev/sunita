import { createContext, useCallback, useRef, useState } from "react"

import { ContextType, DialogType, PropsType, TabType } from "./types"

import useSearchParams from "@/hooks/useSearchParams"

export const FixedTabsContext = createContext<ContextType>({} as ContextType)

export const FixedTabsContextProvider = ({ children, tabs }: PropsType) => {
    const searchParams = useSearchParams()

    const dialog = useRef<DialogType | null>(null)
    const isLoading = useRef(false);
    
    const onCloseRef = useRef<() => void | null>(null);
    const onOpenRef = useRef<() => void | null>(null);

    const tabId = searchParams.get("tab", "");
    const dialogQueryParam = searchParams.get("dialog", "");

    const getDialogQueryParam = useCallback(() => dialogQueryParam, [ dialogQueryParam ]);

    const getDialog = useCallback(
        () => dialog, 
        []
    );

    const getActiveTab = useCallback(
        () => {
            if(!tabId) return tabs[0];

            const tab = tabs.find(currentTab => currentTab.id === tabId);
            
            return tab ?? tabs[0];
        }, 
        [ tabId, tabs ]
    );

    const getTabsList = useCallback(() => structuredClone(tabs), [ tabs ]);

    const setDialog = useCallback(
        (newDialog: DialogType) => {
            dialog.current = newDialog;
            
            if(newDialog) onOpenRef.current?.();
        },
        []
    );

    const setTab = useCallback(
        (id: string) => {
            const tab = tabs.find(tab => tab.id === id);

            if(!tab) return;

            searchParams.setSearchParam("tab", id);
        }, 
        [ searchParams, tabs ]
    );

    return (
        <FixedTabsContext.Provider
            value={
                {
                    isLoading,
                    onCloseRef,
                    onOpenRef,

                    getActiveTab,
                    getDialog,
                    getDialogQueryParam,
                    getTabsList,
                    setDialog,
                    setTab
                }
            }>
            { children }
        </FixedTabsContext.Provider>
    )
}