'use client';

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { CredentialsType } from "@/types/login" ;
import { UserType } from "@/types/user";

import { getItem, setItem } from "@/helpers/local-storage";

type LoginContextType = {
    credentials: CredentialsType,
    revalidatingToken: boolean,
    user: UserType | {},
    logout: () => void,
    setCredentials: React.Dispatch<React.SetStateAction<CredentialsType>>
};

export const LoginContext = React.createContext<LoginContextType | null>(null);
LoginContext.displayName = "LoginContext";

export const LoginContextProvider = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();

    const isPublicPath = pathname === "/login"

    const [ credentials, setCredentials ] = React.useState<CredentialsType | null>(null);
    const [ revalidatingToken, setRevalidatingToken ] = React.useState(true)

    
    const isFirstRender = React.useRef(true)

    const user = React.useMemo<UserType | {}>(() => !credentials ? {} : credentials.user, [ credentials ]);

    const logout = React.useCallback(
        () => {
            setCredentials(null)
            router.push("/login")
        }, 
        [ router ]
    )

    /*React.useEffect(
        () => {
            if(!isFirstRender.current) return;

            const getCookie = (name: string) => {
                const nameEQ = name + "=";
                const cookies = document.cookie.split(';');

                for (let i = 0; i < cookies.length; i++) {
                    let cookie = cookies[i].trim();

                    if (cookie.indexOf(nameEQ) === 0) {
                        return cookie.substring(nameEQ.length, cookie.length);
                    }
                }

                return null;
            }

            const cookie = getCookie("credentials")

            if(cookie) {
                const credentialsCookie = JSON.parse(cookie);

                isFirstRender.current = false;

                setCredentials(credentialsCookie);

                const params = new URLSearchParams(window.location.search);

                router.push(`${pathname}?${params.toString()}`)
            }
        },
        [ pathname, router ]
    )*/

    React.useEffect(
        () => {
            try {
                if(credentials) {
                    setItem({ 
                        key: "credentials", 
                        value: credentials 
                    });

                    document.cookie = `token=${credentials.access.token}; SameSite=Strict`;
                }
            } catch(e) {
            }
        }, 
        [ credentials ]
    );

    const validateSavedToken = React.useCallback(
        async ({ signal }: { signal: AbortSignal }) => {
            isFirstRender.current = false;

            try {
                const { access: { token } } = getItem<CredentialsType>("credentials");

                if(!token) throw new Error("Undefined local storage");

                const options = {
                    headers: {
                        authorization: `bearer ${token}`
                    },
                    signal
                }
                const res = await fetch(`/api/auth/refresh?token=${token}`, options);

                if(res.status === 401) {
                    router.push("/login");
                    return;
                }

                if(res.status !== 200) throw new Error("Refresh token error");

                const result = (await res.json()) as CredentialsType;

                const params = new URLSearchParams(window.location.search)
                
                setCredentials(result);

                router.push(`${pathname}?${params.toString()}`)
            } catch(e) {
                console.error(e);
                router.push("/login");
            } finally {
                setRevalidatingToken(false)
            }
        }, 
        [ pathname, router ]
    );

    React.useEffect(
        () => {
            const controller = new AbortController();

            if(isFirstRender.current && revalidatingToken) {
                isFirstRender.current = false;

                validateSavedToken({ signal: controller.signal });

                //return () => controller.abort();
            }
            
        }, 
        [ revalidatingToken, validateSavedToken ]
    );
    
    React.useEffect(
        () => {
            if(!isPublicPath && !credentials && !revalidatingToken) {
                router.push("/login")
            }
        }, 
        [ credentials, isPublicPath, router, revalidatingToken ]
    );

    return (
        <LoginContext.Provider
            value={{
                // ========== PROPS ===========
                credentials,
                revalidatingToken,
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

