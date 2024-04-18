'use client';

import * as React from "react";

type DialogType = {
    header?: {
        onClose?: () => void;
        title: string;
    };
    body: React.ReactNode;
    footer?: React.ReactNode
};

type AppContextType = {
    dialog: DialogType | null,
    isLoading: React.MutableRefObject<boolean>;
    setDialog: React.Dispatch<React.SetStateAction<DialogType>>
};

export const AppContext = React.createContext<AppContextType | null>(null);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [ dialog, setDialog ] = React.useState<DialogType | null>(null);
    const isLoading = React.useRef(false);

    return (
        <AppContext.Provider
            value={{
                dialog,
                isLoading,
                setDialog
            }}>
            { children }
        </AppContext.Provider>
    )
};