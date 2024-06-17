'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames";

import { getEndAndStartTime } from "../../js/helpers"
import { getItem } from "@/helpers/local-storage";

import { LoginContext } from "@/context/LoginContext";

import Button from "@/components/shared/button";

type ButtonProps = {
    closeHandler: () => void;
    clearTokenTimeout: () => void;
    setTokenTimeout: ({ endTime, startTime }: { endTime: Date, startTime: Date}) => void
};

const RefreshButton = ({ closeHandler, clearTokenTimeout, setTokenTimeout }: ButtonProps) => {
    const { credentials, setCredentials } = React.useContext(LoginContext);
    const [ loading, setLoading ] = React.useState(false);

    const router = useRouter();

    const refreshTokenHandler = React.useCallback(async () => {
        try {
            setLoading(true);

            const options = {
                headers: {
                    authorization: `bearer ${credentials.access.token}`
                }
            }

            const res = await fetch(`/api/auth/refresh?token=${credentials.access.token}`, options);
            const data = await res.json();

            if(res.status !== 200) throw new Error("Refresh token error");
            
            clearTokenTimeout();

            const { expiresIn } = data.access;

            const { end, start } = getEndAndStartTime({ expiresIn });
            closeHandler();
            //addUser(data);
            setTokenTimeout({ endTime: end, startTime: start });
            
            setCredentials(credentials => ({ ...credentials, ...data.access }));

        } catch(e) {
            console.error(e)
            setCredentials(null);
            router.push("/login");
        } finally {
            setLoading(false)
        }
    }, [ credentials, clearTokenTimeout, closeHandler, router, setCredentials, setTokenTimeout ]);

    return (
        <Button 
            onClick={refreshTokenHandler}>
            { loading ? "Loading..." : "Refresh" }
        </Button>
    );
};

export default RefreshButton;