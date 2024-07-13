import { MutableRefObject, ReactNode } from "react"

export  type TabType = {
    id: string;
    name: string;
}

export type DialogType = {
    header?: {
        onClose?: () => void,
        title: string
    }
    body: ReactNode
    payload?: Object
};

export type ContextType = {
    isLoading: MutableRefObject<boolean>,
    onCloseRef: MutableRefObject<() => void>,
    onOpenRef: MutableRefObject<() => void>,

    getActiveTab: () => TabType;
    getDialog: () => MutableRefObject<DialogType>;
    getDialogQueryParam: () => string;
    getTabsList: () => TabType[];
    setDialog: (dialog: DialogType) => void;
    setTab: (id: string) => void;
}

export type PropsType = {
    children: ReactNode;
    tabs: TabType[];
}