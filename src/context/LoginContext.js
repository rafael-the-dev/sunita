'use client';

import * as React from "react";

export const LoginContext = React.createContext();
LoginContext.displayName = "LoginContext";

import { getItem, setItem } from "@/helpers/local-storage";

export const LoginContextProvider = ({ children }) => {
    const [ credentials, setCredentials ] = React.useState(true);

    const user = React.useMemo(() => {
        if(!credentials) return {};
        return credentials.user;
    }, [ credentials ]);

    React.useEffect(() => {
        try {
            console.log(getItem("user"))
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

