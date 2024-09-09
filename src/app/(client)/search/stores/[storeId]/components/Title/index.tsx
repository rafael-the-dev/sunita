import { ReactNode } from "react"
import classNames from "classnames"
import Typography from "@mui/material/Typography"

const Title = ({ children, className }: { children: ReactNode, className?: string }) => (
    <Typography    
        className={classNames(className, `font-semibold text-lg md:text-xl`)}
        component="h2">
       { children }
    </Typography>
)

export default Title