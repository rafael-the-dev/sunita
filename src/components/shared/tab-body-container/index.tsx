"use client";

import { FC, ReactNode, useContext } from "react";

import { TabsContext, TabsContextProvider } from "@/context/TabsContext";

import TabsList from "@/components/shared/tabs-list";//:;

const Container = () => {
    const { getTabsList } = useContext(TabsContext)
    
    return (
        <main>
            <TabsList />
            { 
                getTabsList().map(tab => tab.component) 
            }
        </main>
    );
};

const Provider = <T, >({ component, Component, initialList }: { component: ReactNode, Component: FC, initialList?: T[] }) => (
    <TabsContextProvider 
        component={component} 
        Component={Component}
        initialList={initialList}>
        <Container />
    </TabsContextProvider>
);

export default Provider;


