'use client';

import * as React from "react";

export const LoginContext = React.createContext();
LoginContext.displayName = "LoginContext";

import { getItem, setItem } from "@/helpers/local-storage";

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
            getItem("user")
        } catch(e) {
            setItem({ key: "credentials", value: JSON.stringify({ user: {} }) });
        }
    }, []);

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

