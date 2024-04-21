'use client';

import * as React from "react";
import { usePathname, useRouter } from "next/navigation"
import classNames from "classnames";

import styles from "./styles.module.css";

import { getEndAndStartTime } from "./js/helpers"
import { getItem } from "@/helpers/local-storage";

import { LoginContext } from "@/context/LoginContext";

import Button from "@/components/shared/button";
import Dialog from "@/components/dialog";
import RefreshTokenButton from "./components/refresh-button";

const ignorablePaths = [ "/login" ]

const ExpiredTokenDialog = () => {
    const { credentials, setCredentials } = React.useContext(LoginContext);

    const pathname = usePathname();
    const router = useRouter();

    const dialogTimeoutRef = React.useRef(null);
    const isFirstCredentialsTest = React.useRef(true);
    const onClose = React.useRef<() => void | null>(null);
    const onOpen = React.useRef<() => void | null>(null);
    const verificationTimeoutRef = React.useRef(null);

    const closeHandler = React.useCallback(() => onClose.current?.(), []);
    const openHandler = React.useCallback(() => onOpen.current?.(), []);

    const clearTokenTimeout = React.useCallback(() => {
        if(dialogTimeoutRef.current) clearTimeout(dialogTimeoutRef.current)
        if(verificationTimeoutRef.current) clearTimeout(verificationTimeoutRef.current);
    }, []);

    const verifyExpirationTime = React.useCallback(async () => {
        const { end } = getEndAndStartTime({ expiresIn: credentials.access.expiresIn });

        const isValid = new Date(Date.now()) >= end;

        if(isValid) {
            try {
                //await logoutHelper();
            } catch(e) {
                router.push("/login")
            } finally {
                router.push("/login")
                setCredentials(null);
            }
        }
    }, [ credentials, router, setCredentials ]);
    
    const setTokenTimeout = React.useCallback(({ endTime, startTime }) => {
        dialogTimeoutRef.current = setTimeout(openHandler, startTime - Date.now());
        verificationTimeoutRef.current = setTimeout(verifyExpirationTime, endTime - Date.now());
    }, [ openHandler, verifyExpirationTime ]);

    const checkTokenExpirationTime = React.useCallback((expiresIn: number) => {
        clearTokenTimeout();

        const { end, start } = getEndAndStartTime({ expiresIn });

        setTokenTimeout({ endTime: end, startTime: start });
    }, [ clearTokenTimeout, setTokenTimeout ]);

    //check token expiration time every credentials state is updated
    React.useEffect(() => {
        if(credentials && isFirstCredentialsTest.current && !ignorablePaths.includes(pathname)) {
            checkTokenExpirationTime(credentials.access.expiresIn);
            isFirstCredentialsTest.current = false;
        }
    }, [ credentials, checkTokenExpirationTime, pathname ]);

    React.useEffect(() => {
        // clear data when component is unmounted
        return () => {
            clearTokenTimeout();
        }
    }, [ clearTokenTimeout ]);

    if(!credentials || ignorablePaths.includes(pathname)) return <></>;

    return (
        <Dialog
            classes={{ paper: classNames(styles.paper, `m-0`) }}
            onCloseRef={onClose}
            onOpenRef={onOpen}>
            <Dialog.Body className="p-0">
                Your token will expire in 5 min
            </Dialog.Body>
            <Dialog.Footer className="mt-6 pb-0 pr-0">
                <Button onClick={closeHandler} variant='outlined'>Close</Button>
                <RefreshTokenButton 
                    closeHandler={closeHandler} 
                    clearTokenTimeout={clearTokenTimeout} 
                    setTokenTimeout={setTokenTimeout}
                />
            </Dialog.Footer>
        </Dialog>
    );
};

export default ExpiredTokenDialog;