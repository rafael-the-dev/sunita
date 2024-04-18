'use client';

import * as React from "react";

type DialogType = {
    header?: React.ReactNode;
    body: React.ReactNode;
    footer?: React.ReactNode
};

type AppContextType = {
    dialog: DialogType | null,
    setDialog: React.Dispatch<React.SetStateAction<DialogType>>
};

export const AppContext = React.createContext<AppContextType | null>(null);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [ dialog, setDialog ] = React.useState<DialogType | null>(null);

    return (
        <AppContext.Provider
            value={{
                dialog,
                setDialog
            }}>
            { children }
        </AppContext.Provider>
    )
};