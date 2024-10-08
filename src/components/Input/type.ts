import * as React from 'react'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    error?: boolean
};
