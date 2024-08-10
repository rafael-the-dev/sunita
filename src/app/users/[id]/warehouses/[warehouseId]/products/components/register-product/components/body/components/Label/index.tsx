import { ReactNode } from "react"
import classNames from "classnames"
import Typography from "@mui/material/Typography"

type PropsType = {
    children: ReactNode,
    className?: string
}

const Label = ({ children, className }: PropsType) => {

    return (
        <Typography 
            component="label"
            className={classNames(className, "font-semibold mb-4 text-primary-600 text-sm")}>
            { children }
        </Typography>
    )
}

export default Label