import { FormEvent, ReactNode } from "react"

type PropsType = {
    children: ReactNode,
    className?: string,
    onSubmit?: (e: FormEvent<HTMLFormElement>) => void
}

const Form = ({ children, className, onSubmit }: PropsType) => {
    return (
        <form
            className={className}
            onSubmit={onSubmit}>
            { children }
        </form>
    )
}

export default Form