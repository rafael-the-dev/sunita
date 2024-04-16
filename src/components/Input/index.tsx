import classNames from "classnames";
import * as React from 'react'
import classes from './styles.module.css';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

type Ref = HTMLInputElement;

const Input = React.forwardRef<Ref, InputProps>(({ autoComplete, className, onChange, ...rest }, ref) => {
    return (
        <input 
            { ...rest }
            autoComplete={ Boolean(autoComplete) ? "on": "off" }
            className={classNames(`border-0 bg-transparent outline-none px-2 text-sm
            `, classes.input, className)}
            ref={ref}
            onChange={onChange}
        />
    );
});

Input.displayName ="Input";

export default Input;