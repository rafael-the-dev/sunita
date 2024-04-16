'use client';

import * as React from 'react';
import classNames from 'classnames';

import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Input from "@/components/Input";

type Ref = HTMLInputElement;

type PasswordProps = React.InputHTMLAttributes<HTMLInputElement> & {
    iconPosition?: string,
    label?: string
};

const PasswordInput = React.forwardRef<Ref, PasswordProps>(({ iconPosition, label, ...rest}, ref) => {
    const [ showPassword, setShowPassword ] = React.useState(false);

    const togglePasswordVisibility = React.useCallback(() => setShowPassword((show) => !show), []);

    const handleMouseDownPassword = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault(), []);

    return  (
        <div className={classNames(`border border-solid border-primary-800 flex items-center mt-4 px-3 rounded-lg`)}>
            <IconButton
                aria-label="toggle password visibility"
                onClick={togglePasswordVisibility}
                onMouseDown={handleMouseDownPassword}
                edge="start"
            >
                {  showPassword ? <VisibilityOff className="text-slate-700" /> : <Visibility className="text-slate-700" /> }
            </IconButton>
            <Input 
                className="border-0 grow"
                ref={ref}
                required
                type={ showPassword ? 'text' : 'password'}
                { ...rest }
            />
        </div>
    );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;