import { useCallback, useContext, useEffect, useRef, MutableRefObject} from "react";
import classNames from "classnames";

import { AppContext } from "@/context/AppContext";

import Dialog from "@/components/dialog"

const Container = () => {
    const { dialog, setDialog } = useContext(AppContext);

    const onCloseRef = useRef<() => void | null>(null);
    const onOpenRef = useRef<() => void | null>(null);

    const closeHandler = useCallback(() => {
        onCloseRef.current?.();
        setDialog(null);
    }, [ setDialog ]);

    useEffect(() => {
        if(dialog) onOpenRef.current?.();
        else closeHandler();
    }, [ closeHandler, dialog ]);

    return (
        <Dialog
            customClose={closeHandler}
            onCloseRef={onCloseRef}
            onOpenRef={onOpenRef}>
            <Dialog.Body className="p-0">
                { dialog?.body }
            </Dialog.Body>
            <Dialog.Footer className="mt-6 pb-0 pr-0">
            </Dialog.Footer>
        </Dialog>
    );
};

export default Container;