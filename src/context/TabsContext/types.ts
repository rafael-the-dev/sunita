import { ReactNode } from "react"

export type TabType = {
    component: ReactNode;
    id: string;
    name: string;
}

export type TabsPropsType = {
    addTab: () => void;
    activateTab: (id: string) => void;
    getActiveTab: () => TabType;
    getTabsList: () => TabType[];
    removeTab: (id: string) => void;
}