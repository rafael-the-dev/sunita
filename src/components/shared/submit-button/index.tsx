import { ReactNode } from "react"
import { useFormStatus } from "react-dom";
import classNames from "classnames";

import Button from "@/components/shared/button";

type ButtonProps = {
    children: ReactNode;
    className?: string;
}

const SubmitButton = ({ children, className }: ButtonProps) => {
    const { pending } = useFormStatus();

    return (
        <Button
            className={classNames("py-2 rounded-lg", className)}
            disabled={ pending }
            type="submit">
            { pending ? "Loading..." : children }
        </Button>
    );
};

export default SubmitButton;