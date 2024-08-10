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
            className={classNames(className, "block font-semibold mb-3 text-primary-600 text-sm")}>
            { children }
        </Typography>
    )
}

export default Label