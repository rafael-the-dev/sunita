

import { InputProps } from "@/components/Input/type";

import Input from "@/components/Input";
import classNames from "classnames";

const InputContainer = ({ ...rest }: InputProps) => {

    return (
        <Input 
            { ...rest }
            className={classNames("!py-2", rest.className)}
        />
    );
};

export default InputContainer;