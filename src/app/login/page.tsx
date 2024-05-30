'use client';

import * as React from 'react';
import classNames from 'classnames';
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography"

import styles from "./styles.module.css";

import { CredentialsType } from '@/types/login';
import { LoginContext } from "@/context/LoginContext";

import Alert from "@/components/alert";
import Button from "./components/SubmitButton";
import Input from "@/components/Input";
import PasswordInput from '@/components/shared/password';

const Login = () => {
    const router = useRouter();

    const { setCredentials } = React.useContext(LoginContext);

    const onCloseHandlerRef = React.useRef(null);
    const onOpenHandlerRef = React.useRef(null);

    const submitHandler = React.useCallback(async (prevState, formData) => {
        onCloseHandlerRef.current?.();

        const body = JSON.stringify({ 
            password: formData.get("password-input"), 
            username: formData.get("username-input")
        });

        const options = {
            body,
            method: "POST"
        };

        try {
            const res = await fetch('/api/auth/login', options);
            const result = await res.json();

            if(res.status !== 200) throw new Error(result);

            const { access, user } = result as CredentialsType;

            setCredentials({ access, user });

            router.push(`/users/${user.username}`);
        } catch(e) {
            console.error(e);

            return {
                ...prevState,
                error: e.message
            };
        }

    }, [ router, setCredentials ]);

    const [ state, formAction ] = useFormState(submitHandler, { error: null });

    const beforeUnloadHandler = React.useCallback(() => {
        console.log("hello...")
        router.push("/login")
    }, [ router ])

    React.useEffect(() => {
        if(state.error) onOpenHandlerRef.current?.(); 
    }, [ state ]);

    React.useEffect(() => {
        const currentWindow = window

        currentWindow.addEventListener("beforeunload", beforeUnloadHandler)

        return () => currentWindow.removeEventListener("beforeunload", beforeUnloadHandler)
    }, [ beforeUnloadHandler ])
    
    return (
        <main className="bg-primary-50 flex items-center justify-center min-h-screen">
            <Paper
                action={formAction}
                component="form"
                className={classNames(styles.form, `mx-auto px-4 py-8 rounded-xl sm:px-6`)}
                elevation={1}>
                <fieldset>
                    <Typography 
                        component="legend"
                        className='font-bold text-center text-2xl sm:text-3xl'
                        variant='h2'>
                        Login
                    </Typography>
                        <Alert 
                            className="mt-3"
                            description={state.error}
                            onClose={onCloseHandlerRef}
                            onOpen={onOpenHandlerRef}
                            severity="error"
                            title="Error"
                        />
                    <div className={classNames(`border border-solid border-primary-800 flex items-center mt-4 px-3 rounded-lg sm:mt-8`)}>
                        <AccountCircleIcon className="text-slate-700" />
                        <Input 
                            className="bg-primary-800 border-0 grow"
                            name="username-input"
                            placeholder='Username'
                            required
                        />
                    </div>
                    <PasswordInput 
                        name="password-input"
                        placeholder="Password"
                    />
                </fieldset>
                <div className='flex flex-col items-center mt-4'>
                    <Button>
                        Submit
                    </Button>
                </div>
            </Paper>
        </main>
    )
};

export default Login;
