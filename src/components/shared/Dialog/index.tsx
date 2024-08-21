import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames"
import { usePathname } from "next/navigation"

import styles from "./styles.module.css"

import { DialogType } from "@/context/FixedTabsContext/types";

import useSearchParams from "@/hooks/useSearchParams";

import Dialog from "@/components/dialog"

type PropsType = {
    dialog: MutableRefObject<DialogType | null>,
    isLoading: MutableRefObject<boolean>;
    onClose: MutableRefObject<() => void>;
    onOpen: MutableRefObject<() => void>;
    setDialog: (dialog: DialogType) => void;
}

const Container = ({ dialog, isLoading, onClose, onOpen, setDialog }: PropsType) => {
    const [ open, setOpen ] = useState(false)

    const isOpen = useRef(false)
    const onCloseRef = useRef<() => void>(null)
    const onOpenRef = useRef<() => void>(null)

    const searchParams = useSearchParams()

    const pathname = usePathname()
    const pathnameRef = useRef(pathname)

    const closeHandler = useCallback(
        () => {
            if(isLoading.current) return;

            dialog.current?.header?.onClose?.();
            onCloseRef.current?.();
            setDialog(null);
            setOpen(false)
        }, 
        [ dialog, isLoading, setDialog ]
    );

    useEffect(
        () => {
            if(onClose) onClose.current = () => setOpen(false);
            if(onOpen) onOpen.current = () => setOpen(true);
        },
        [ onClose, onOpen ]
    )

    useEffect(
        () => {
            if(dialog.current && open) {
                isOpen.current = true;
                onOpenRef.current?.();
            } 
            else closeHandler();
        }, 
        [ closeHandler, dialog, open ]
    );

    useEffect(
        () => {
            if(dialog.current && pathname !== pathnameRef.current) {
                closeHandler();
                return;
            }

            pathnameRef.current = pathname;
        }, 
        [ closeHandler, dialog, pathname ]
    );

    useEffect(
        () => {
            if(!dialog.current && !open && isOpen.current) {
                searchParams.removeSearchParam("dialog");
                isOpen.current = false;
            }
        }, 
        [ dialog, open, searchParams ]
    )

    return (
        <Dialog
            classes={{ paper: "m-0 sm:max-w-max" }}
            customClose={closeHandler}
            onCloseRef={onCloseRef}
            onOpenRef={onOpenRef}>
            {
                dialog.current?.header && (
                    <Dialog.Header 
                        classes={{ root: "bg-primary-800 capitalize pl-3 text-white" }}
                        onClose={closeHandler}>
                        { dialog.current.header.title }
                    </Dialog.Header>
                )
            }
            <Dialog.Body className={classNames(styles.dialogBody, "p-0")}>
                { dialog.current?.body }
            </Dialog.Body>
        </Dialog>
    );
};

export default Container;