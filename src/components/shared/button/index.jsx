import classNames from "classnames";

import Button from "@mui/material/Button";

const Container = ({ children, color = "primary", className, variant = "contained", ...rest }) => {

    const getClasses = () => {
        switch(variant) {
            case "contained": return `bg-${color}-800 text-white hover:opacity-80`;
            case "outlined": return `border-${color}-800 text-${color}-800 hover:bg-${color}-800 hover:text-white`
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