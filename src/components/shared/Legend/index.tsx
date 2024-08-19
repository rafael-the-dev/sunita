import { ReactNode } from "react"
import classNames from "classnames"
import Typography from "@mui/material/Typography"

type PropsType = {
    children: ReactNode,
    className?: string
}

const Legend = ({ children, className }: PropsType) => (
    <Typography
        component="legend"
        className={classNames(className, "font-semibold mb-6")}>
        { children }
    </Typography>
)

export default Legend