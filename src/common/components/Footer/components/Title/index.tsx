import { ReactNode } from "react"
import Typography from "@mui/material/Typography"

const Title = ({ children }: { children: ReactNode}) => (
    <Typography
        component="h2"
        className="font-semibold opacity-80 text-lg">
        { children }
    </Typography>
)

export default Title