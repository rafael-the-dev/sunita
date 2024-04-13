'use client';

import * as React from "react";
import { useRouter } from "next/navigation";

export const LoginContext = React.createContext();
LoginContext.displayName = "LoginContext";

import { configLocalStorage, getItem, setItem } from "@/helpers/local-storage";

export const LoginContextProvider = ({ children }) => {
    const router = useRouter();

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

    const validateSavedToken = React.useCallback(async ({ signal }) => {
        try {
            const { token } = getItem("credentials");

            if(!token) throw new Error("Undefined local storage");

            const res = await fetch(`/api/auth/refresh?token=${token}`, { signal });
            const result = await res.json();

            if(res.status !== 200) throw new Error("Refresh token error");
            
            setCredentials(result);
            router.push(`/users/${result.data.username}`);
        } catch(e) {
            console.error(e);
        }
    }, [ router ]);

    React.useEffect(() => {
        const controller = new AbortController();

        validateSavedToken({ signal: controller.signal });

        return () => controller.abort();
    }, [ validateSavedToken ])

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

