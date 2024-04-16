import * as React from "react";
import Link from "next/link";
import Typography from "@mui/material/Typography";

type Props = {
    className?: string;
    children: React.ReactNode;
    href: string;
}

const LinkContainer = ({ className, children, href , ...rest}: Props) => (
    <Typography 
        { ...rest }
        component={Link} 
        className={className}
        href={href}
        >
        { children }
    </Typography>
);

export default LinkContainer;