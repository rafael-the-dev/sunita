import Link from "next/link";
import Typography from "@mui/material/Typography";

const LinkContainer = ({ className, children, href , ...rest}) => (
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