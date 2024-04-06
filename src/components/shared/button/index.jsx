import classNames from "classnames";

import Button from "@mui/material/Button";

const Container = ({ children, color, className, variant, ...rest }) => {

    color = color ?? "primary";
    variant = variant ?? "contained";
    
    const getClasses = () => {
        switch(variant) {
            case "contained": return `bg-${color}-800 text-white`;
            case "outlined": return ``
        }
    };

    return (
        <Button
            className={classNames(getClasses(), className)}
            variant={variant}
            { ...rest }>
            { children }
        </Button>
    );
};

export default Container;