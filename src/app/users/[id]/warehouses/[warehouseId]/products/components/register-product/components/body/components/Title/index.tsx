import { ReactNode } from "react"
import classNames from "classnames"

import Typography from "@mui/material/Typography"

const Title = ({ children }: { children: ReactNode }) => (
    <Typography
        component="legend"
        className={classNames("font-semibold text-lg")}>
        { children }
    </Typography>
)

export default Title