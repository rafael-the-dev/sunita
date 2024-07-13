"use client";

import { ReactNode, useContext } from "react";

import { FixedTabsContext, FixedTabsContextProvider } from "@/context/FixedTabsContext";

import { TabType } from "@/context/FixedTabsContext/types";

import Dialog from '@/components/shared/Dialog'
import TabsList from "./components/tabs-list";

export const Container = ({ children }: { children: ReactNode }) => {
    const { 
        getDialog, 
        isLoading, 
        onCloseRef, onOpenRef,
        setDialog 
    } = useContext(FixedTabsContext)
   
    return (
        <main>
            <TabsList />
            { children }
            <Dialog 
                dialog={getDialog()}
                isLoading={isLoading}
                onClose={onCloseRef}
                onOpen={onOpenRef}
                setDialog={setDialog}
            />
        </main>
    );
};

export const Provider = ({ children, tabs }: { children: ReactNode, tabs: TabType[] }) => (
    <FixedTabsContextProvider tabs={tabs}>
        <Container>
            { children }
        </Container>
    </FixedTabsContextProvider>
);