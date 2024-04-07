import * as React from "react";


export const LoginContext = React.createContext();
LoginContext.displayName = "LoginContext";

export const LoginContextProvider = ({ children }) => {
    const [ credentials, setCredentials ] = React.useState(null);

    const user = React.useMemo(() => {
        if(!credentials) return {};
        return credentials.user;
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

