

import FormGroup from "@mui/material/FormGroup";

import Radio from "@/components/radio-button";
import { MutableRefObject } from "react";
import { ChangeEventFunc } from "@/types/events";

type PropsType = {
    isSelected: (id: string) => boolean;
    list: MutableRefObject<{ label: string, value: string }[]>;
    onChange: ChangeEventFunc<HTMLInputElement>;
}

const Container = ({ isSelected, list, onChange }: PropsType) => {

    return (
        <FormGroup row>
            {
                list.current.map(item => (
                    <Radio 
                        checked={isSelected(item.value)} 
                        key={item.value}
                        label={ item.label }
                        onChange={onChange}
                        value={item.value}
                    />
                ))
            }
        </FormGroup>
    )
}

export default Container;