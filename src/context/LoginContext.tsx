'use client';

import * as React from "react";
import { useRouter } from "next/navigation";

import { CredentialsType } from "@/types/login" ;
import { UserType } from "@/types/user";

import { configLocalStorage, getItem, setItem } from "@/helpers/local-storage";

type LoginContextType = {
    credentials: CredentialsType,
    user: UserType | {},
    logout: () => void,
    setCredentials: React.Dispatch<React.SetStateAction<CredentialsType>>
};

export const LoginContext = React.createContext<LoginContextType | null>(null);
LoginContext.displayName = "LoginContext";

export const LoginContextProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    const [ credentials, setCredentials ] = React.useState<CredentialsType | null>(null);

    const user = React.useMemo<UserType | {}>(() => !credentials ? {} : credentials.user, [ credentials ]);

    const logout = React.useCallback(() => {
        setCredentials(null)
        router.push("/login")
    }, [ router ])

    React.useEffect(() => {
        try {
            getItem<CredentialsType>("credentials")
        } catch(e) {
            configLocalStorage();
        }
    }, []);

    React.useEffect(() => {
        try {
            if(credentials) {
                setItem({ 
                    key: "credentials", 
                    value: credentials 
                });
            }
        } catch(e) {
        }
    }, [ credentials ]);

    const validateSavedToken = React.useCallback(async ({ signal }) => {
        try {
            const { access: { token } } = getItem<CredentialsType>("credentials");

            if(!token) throw new Error("Undefined local storage");

            const res = await fetch(`/api/auth/refresh?token=${token}`, { signal });

            if(res.status !== 200) throw new Error("Refresh token error");

            const result = (await res.json()) as CredentialsType;
            
            setCredentials(result);
            router.push(`/users/${result.user.username}`);
        } catch(e) {
            console.error(e);
            router.push("/login");
        }
    }, [ router ]);

    React.useEffect(() => {
        const controller = new AbortController();

        validateSavedToken({ signal: controller.signal });

        return () => controller.abort();
    }, [ validateSavedToken ]);

    return (
        <LoginContext.Provider
            value={{
                // ========== PROPS ===========
                credentials,
                user,

                // ========== METHODS ===========
                logout,
                setCredentials,
            }}>
            { children }
        </LoginContext.Provider>
    );
};


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

