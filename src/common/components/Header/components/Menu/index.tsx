"use client"

import * as React from "react"
import classNames from "classnames"
import IconButton from "@mui/material/IconButton"

import styles from "./styles.module.css"

import CloseIcon from "@mui/icons-material/Close"
import MenuIcon from "@mui/icons-material/Menu"

import Button from "@/components/shared/button"
import Drawer from "@/components/drawer"
import List from "../List"
import Link from "@/components/link"

const Menu = () => {
    const [ open, setOpen ] = React.useState(false)

    const onCloseFuncRef = React.useRef<() => void>(null)
    const onOpenFuncRef = React.useRef<() => void>(null)

    const closeState = React.useCallback(
        () => setOpen(false),
        []
    )

    const clickHandler = React.useCallback(
        () => setOpen(true),
        []
    )

    const drawerMemo = React.useMemo(
        () => (
            <Drawer
                anchor="left"
                classes={{ paper: classNames(styles.paper, `flex flex-col items-stretch justify-between pt-4 px-4`)}}
                onCloseHelper={closeState}
                onCloseRef={onCloseFuncRef}
                onOpen={onOpenFuncRef}>
                <nav>
                    <List />
                </nav>
                <Link
                    className="mb-8 no-underline"
                    href="/login">
                    <Button className="!bg-white block py-2 !text-black w-full">
                        Login
                    </Button>
                </Link>
            </Drawer>
        ),
        [ closeState ]
    )

    React.useEffect(
        () => {
            if(open) onOpenFuncRef.current?.()
            else onCloseFuncRef.current?.()
        },
        [ open ]
    )

    return (
        <>
            <IconButton onClick={clickHandler}>
                { open ? <CloseIcon /> : <MenuIcon /> }
            </IconButton>
            { drawerMemo }
        </>
    )
}

export default Menu