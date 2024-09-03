import { ReactNode } from "react"
import classNames from "classnames"

import Typography from "@mui/material/Typography"

const Title = ({ children, className }: { children: ReactNode, className?: string }) => (
    <Typography
        component="legend"
        className={classNames(className, "font-semibold text-lg")}>
        { children }
    </Typography>
)

export default Title