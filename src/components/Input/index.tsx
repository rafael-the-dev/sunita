import classNames from "classnames";
import * as React from 'react'
import classes from './styles.module.css';

import { InputProps } from "./type";

type Ref = HTMLInputElement;

const Input = React.forwardRef<Ref, InputProps>(({ autoComplete, className, error, onChange, ...rest }, ref) => {
    return (
        <input 
            { ...rest }
            autoComplete={ Boolean(autoComplete) ? "on": "off" }
            className={classNames(`bg-transparent outline-none px-2 text-sm
            `, classes.input, className, error ? "border border-red-600 border-solid" : "border-0")}
            ref={ref}
            onChange={onChange}
        />
    );
});

Input.displayName ="Input";

export default Input;