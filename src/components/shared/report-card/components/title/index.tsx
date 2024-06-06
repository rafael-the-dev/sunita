import { ReactNode } from "react"
import classNames from "classnames"
import Typography from "@mui/material/Typography"

type PropsTypes = {
    className?: string,
    children: ReactNode
}

const Title = ({ className, children }: PropsTypes) => (
    <Typography
        component="h2"
        className={classNames(className, "text-lg")}>
        { children }
    </Typography>
)

export default Title