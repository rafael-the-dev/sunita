import { useCallback, useMemo, useRef } from "react";
import { IconButton } from "@mui/material";

import MenuIcon from '@mui/icons-material/Menu';

import styles from "./styles.module.css";

import Drawer from "@/components/drawer";
import SideBar from "@/components/shared/side-bar";


const Menu = () => {
    const onCloseHandlerRef =useRef<() => void>(null);
    const openHandlerRef = useRef<() => void>(null);

    const closeHandler = useCallback(() => onCloseHandlerRef.current?.(), []);
    const openHandler = useCallback(() => openHandlerRef.current?.(), []);

    const sideBarMemo = useMemo(() => <SideBar closeHandler={closeHandler} />, [ closeHandler ]);

    return (
        <>
            <IconButton
                onClick={openHandler}>
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor="left"
                classes={{ paper: styles.paper }}
                onCloseRef={onCloseHandlerRef}
                onOpen={openHandlerRef}>
                { sideBarMemo }
            </Drawer>
        </>
    );
};

export default Menu;