'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import classNames from "classnames"
import Dialog from "@mui/material/Dialog";
import DialogAction from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogHeader from "./components/dialog-header";

const Container = ({ ariaDescribedby, ariaLabelledby, children, classes, customClose, onClose, onOpen }) => {
    const pathname = usePathname();

    const currentPath = useRef(null);
    const [ open, setOpen ] = useState(false);

    const childrenMemo = useMemo(() => children, [ children ])
    const handleClose = useCallback(() => setOpen(false), []);

    useEffect(() => {
        onOpen.current = () => setOpen(true);
    }, [ onOpen ]);

    useEffect(() => {
        if(onClose) onClose.current = handleClose;
    }, [ onClose, handleClose ]);

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
            onClose={customClose ? customClose : handleClose}
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