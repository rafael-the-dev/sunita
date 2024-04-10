'use client';

import * as React from "react";

export const LoginContext = React.createContext();
LoginContext.displayName = "LoginContext";

import {bb } from "@/src/helpers/local-storage.js"

export const LoginContextProvider = ({ children }) => {
    const [ credentials, setCredentials ] = React.useState(true);

    const user = React.useMemo(() => {
        if(!credentials) return {};
        return credentials.user;
    }, [ credentials ]);

    React.useEffect(() => {
        localStorage.getItem("")
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

