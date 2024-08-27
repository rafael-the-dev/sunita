import { Context, ReactNode, useContext } from "react";

type ContextType<T> = {
    dialog: {
        header?: {
            onClose?: () => void;
            title: string;
        };
        body: ReactNode;
        footer?: ReactNode,
        payload?: T | Object
    }
}

const usePayload = <T,>(context: Context<ContextType<T>>) => {
    const { dialog } = useContext(context)

    const data = dialog?.payload
    const hasPayload = Boolean(dialog?.payload)

    return {
        data,
        hasPayload
    }

}

export default usePayload