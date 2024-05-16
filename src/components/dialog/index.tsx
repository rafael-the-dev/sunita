'use client';

import { useCallback, useEffect, useMemo, useRef, useState, MutableRefObject, useContext } from "react"
import { usePathname } from "next/navigation"
import Dialog from "@mui/material/Dialog";
import DialogAction from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogHeader from "./components/dialog-header";
import { AppContext } from "@/context/AppContext";

type HandlerRef = MutableRefObject<() => void>;

type DialogProspsType = {
    ariaDescribedby?: string;
    ariaLabelledby?: string;
    children: React.ReactNode;
    classes?: { paper: string };
    customClose?: () => void;
    onCloseRef?: HandlerRef | null
    onOpenRef: HandlerRef;
};

const Container = ({ ariaDescribedby, ariaLabelledby, children, classes, customClose, onCloseRef, onOpenRef }: DialogProspsType) => {
    const { isLoading } = useContext(AppContext);

    const pathname = usePathname();
    const currentPath = useRef<string | null>(null);

    const [ open, setOpen ] = useState(false);

    const childrenMemo = useMemo(() => children, [ children ]);

    const handleClose = useCallback(() => {
        if(isLoading.current) return;
        setOpen(false);
    }, [ isLoading ]);

    useEffect(() => {
        onOpenRef.current = () => setOpen(true);
    }, [ onOpenRef ]);

    useEffect(() => {
        if(onCloseRef) onCloseRef.current = handleClose;
    }, [ onCloseRef, handleClose ]);

    useEffect(() => {
        if(pathname !== currentPath.current) {
            setOpen(false);
            return;
        }
        currentPath.current = pathname;
    }, [ pathname ]);

    return (
        <Dialog
            classes={classes}
            open={open}
            onClose={customClose ?? handleClose}
            aria-describedby={ariaDescribedby}
            aria-labelledby={ariaLabelledby}
        >
            { childrenMemo }
        </Dialog>
    );
};

Container.Body = DialogContent;
Container.Footer = DialogAction;
Container.Header = DialogHeader;

export default Container;