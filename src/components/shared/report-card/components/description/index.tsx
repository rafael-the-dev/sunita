import { ReactNode } from "react"
import classNames from "classnames"
import Typography from "@mui/material/Typography"

type PropsTypes = {
    className?: string,
    children: ReactNode
}

const Description = ({ className, children }: PropsTypes) => (
    <Typography
        component="span"
        className={classNames(className, "font-semibold mt-3 text-2xl")}>
        { children }
    </Typography>
)

export default Description