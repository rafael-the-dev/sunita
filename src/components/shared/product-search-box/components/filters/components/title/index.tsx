import * as React from "react";
import Typography from "@mui/material/Typography";

type Props = {
    children: React.ReactNode
};

const Title = ({ children }: Props ) => (
    <Typography
        className="font-semibold"
        variant="h5">
        { children }
    </Typography>
);

export default Title;

