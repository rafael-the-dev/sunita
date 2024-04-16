import { useFormStatus } from "react-dom";

import Button from "@/components/shared/button";

const SubmitButton = ({ children }) => {
    const { pending } = useFormStatus();

    return (
        <Button
            className="py-3 rounded-lg w-full"
            disabled={ pending }
            type="submit">
            { pending ? "Loading..." : children }
        </Button>
    );
};

export default SubmitButton;