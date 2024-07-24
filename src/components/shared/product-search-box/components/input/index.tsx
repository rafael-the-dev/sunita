import { MutableRefObject, forwardRef } from "react"

import { InputProps } from "@/components/Input/type";

import Input from "@/components/Input";
import classNames from "classnames";

const InputContainer = forwardRef(({ ...rest }: InputProps, ref: MutableRefObject<HTMLInputElement>) => {

    return (
        <Input 
            { ...rest }
            className={classNames("!py-2", rest.className)}
            ref={ref}
        />
    );
});

InputContainer.displayName = "InputContainer"

export default InputContainer;