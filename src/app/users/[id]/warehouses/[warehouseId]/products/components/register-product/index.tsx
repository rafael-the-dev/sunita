'use client';

import { useCallback, useContext } from "react";

import { AppContext } from "@/context/AppContext";

import Button from "@/components/shared/button";
import Body from "./components/body";

const RegisterProductContainer = () => {
    const { setDialog } = useContext(AppContext);

    const clickHandler = useCallback(() => setDialog({
        header: { title: "Register product" },
        body: <Body />
    }), [ setDialog ])

    return (
        <div>
            <Button 
                className=""
                onClick={clickHandler}>
                Register
            </Button>
        </div>
    );
};

export default RegisterProductContainer;
