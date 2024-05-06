import { useCallback, useContext, useEffect, useRef, MutableRefObject} from "react";
import classNames from "classnames";

import { AppContext } from "@/context/AppContext";

import Dialog from "@/components/dialog"

const Container = () => {
    const { dialog, isLoading, setDialog } = useContext(AppContext);

    const onCloseRef = useRef<() => void | null>(null);
    const onOpenRef = useRef<() => void | null>(null);

    const closeHandler = useCallback(() => {
        if(isLoading.current) return;

        dialog?.header?.onClose?.();
        onCloseRef.current?.();
        setDialog(null);
    }, [ dialog, isLoading, setDialog ]);

    useEffect(() => {
        if(dialog) onOpenRef.current?.();
        else closeHandler();
    }, [ closeHandler, dialog ]);

    return (
        <Dialog
            classes={{ paper: "m-0 sm:max-w-max" }}
            customClose={closeHandler}
            onCloseRef={onCloseRef}
            onOpenRef={onOpenRef}>
            {
                dialog?.header && (
                    <Dialog.Header 
                        classes={{ root: "bg-primary-800 capitalize pl-3 text-white" }}
                        onClose={closeHandler}>
                        { dialog.header.title }
                    </Dialog.Header>
                )
            }
            <Dialog.Body className="p-0">
                { dialog?.body }
            </Dialog.Body>
            {
                dialog?.footer && (
                    <Dialog.Footer className="mt-6 pb-0 pr-0">
                    </Dialog.Footer>
                )
            }
        </Dialog>
    );
};

export default Container;