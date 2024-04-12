'use client';

import * as React from "react";

export const LoginContext = React.createContext();
LoginContext.displayName = "LoginContext";

import { configLocalStorage, getItem, setItem } from "@/helpers/local-storage";

export const LoginContextProvider = ({ children }) => {
    const [ credentials, setCredentials ] = React.useState(null);

    const user = React.useMemo(() => {
        if(!credentials) return {};
        return credentials.user;
    }, [ credentials ]);

    /*const logoutHelper = useCallback(async () => {
        const { token } = getLocalStorageData().user;

        const options = {
            body: JSON.stringify({}),
            headers: {
                "Authorization": token
            },
            method: "PUT"
        };

        await fetch("/api/logout", options);
        return;
    }, [ getLocalStorageData ]);*/

    React.useEffect(() => {
        try {
            getItem("credentials")
        } catch(e) {
            configLocalStorage();
        }
    }, []);

    React.useEffect(() => {
        try {
            if(credentials) setItem({ key: "credentials", value: credentials });
        } catch(e) {
        }
    }, [ credentials ]);

    return (
        <LoginContext.Provider
            value={{
                credentials,
                user,
                setCredentials
            }}>
            { children }
        </LoginContext.Provider>
    );
};

