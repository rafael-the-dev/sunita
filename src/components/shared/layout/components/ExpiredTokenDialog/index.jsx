'use client';

import * as React from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

import { getEndAndStartTime } from "./js/helpers"

import { LoginContext } from "@/context/LoginContext";

import Button from "@/components/shared/button";
import Dialog from "@/components/dialog";

const ExpiredTokenDialog = () => {
    const { credentials } = React.useContext(LoginContext);

    const dialogTimeoutRef = React.useRef(null);
    const onClose = React.useRef(null);
    const onOpen = React.useRef(null);

    const closeHandler = React.useCallback(() => onClose.current?.(), []);
    const openHandler = React.useCallback(() => onOpen.current?.(), []);

    const verifyExpirationTime = React.useCallback(async () => {
        const { end, start } = getEndAndStartTime({ expiresIn });

        const isValid = Date.now() >= end;

        if(isValid) {
            try {
                await logoutHelper();
                addUser(null);
            } catch(e) {
                addUser(null);
                router.push("/login")
            }
        }
    }, [ addUser, getLocalStorageData, logoutHelper, router ]);

    const checkTokenExpirationTime = React.useCallback((expiresIn) => {
        const { end, start } = getEndAndStartTime({ expiresIn });

        // set new timeout
        dialogTimeoutRef.current = setTimeout(openHandler, start - Date.now());
    }, [ openHandler ]);

    //check token expiration time every credentials state is updated
    React.useEffect(() => {
        if(credentials) {
            checkTOkenExpirationTime(credentials.expiresIn);
        }

        // clear data when component is unmonted
        return () => {
            if(dialogTimeoutRef.current) clearTimeout(dialogTimeoutRef.current);
        }
    }, [ credentials, checkTOkenExpirationTime ])

    if(!credentials) return <></>;

    return (
        <Dialog
            classes={{ paper: classNames(styles.paper, `m-0`) }}
            onOpen={onOpen}>
            <Dialog.Body className="p-0">
                Your token will expire in 5 min
            </Dialog.Body>
            <Dialog.Footer className="mt-6 pb-0 pr-0">
                <Button variant='outlined'>Close</Button>
                <Button>Refresh</Button>
            </Dialog.Footer>
        </Dialog>
    );
};

export default ExpiredTokenDialog;