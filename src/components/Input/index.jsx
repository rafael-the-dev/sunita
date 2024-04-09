import classNames from "classnames";
import { forwardRef } from 'react'
import classes from './styles.module.css'

const Input = forwardRef(({ autoComplete, className, onChange, ...rest }, ref) => {
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