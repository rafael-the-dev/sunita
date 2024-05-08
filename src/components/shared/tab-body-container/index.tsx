"use client";

import { ReactNode, useContext } from "react";

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

const Provider = ({ component }: { component: ReactNode }) => (
    <TabsContextProvider component={component} >
        <Container />
    </TabsContextProvider>
);

export default Provider;


