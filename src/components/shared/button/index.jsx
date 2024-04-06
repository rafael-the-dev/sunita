import classNames from "classnames";

import Button from "@mui/material/Button";

const Container = ({ children, color, className, variant, ...rest }) => {

    color = color ?? "primary";
    variant = variant ?? "contained";
    
    const getClasses = () => {
        switch(variant) {
            case "contained": return `bg-${color}-800 text-white hover:opacity-80`;
            case "outlined": return `border-${color}-800 text-${color} hover:bg-${color}-800 hover:text-white`
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