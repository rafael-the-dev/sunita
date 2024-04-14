import classNames from "classnames";

import Button from "@mui/material/Button";

const Container = ({ children, color = "primary", className, variant = "contained", ...rest }) => {

    const getClasses = () => {
        if(color === "primary") {
            switch(variant) {
                case "contained": return `bg-${color}-800 text-white hover:opacity-80`;
                case "outlined": return `border-${color}-800 text-${color}-800 hover:bg-${color}-800 hover:text-white`
            }
        } else {
            switch(variant) {
                case "contained": return `bg-white text-primary-800 hover:opacity-80`;
                case "outlined": return `border-white text-white hover:bg-white hover:text-primary-800`
            }
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