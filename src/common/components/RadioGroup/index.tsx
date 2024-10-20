import { MutableRefObject } from "react";
import FormGroup from "@mui/material/FormGroup";

import { ChangeEventFunc } from "@/types/events";

import Checkbox from "@/components/checkbox"
import Radio from "@/components/radio-button";

type PropsType = {
    isSelected: (id: string) => boolean;
    list: MutableRefObject<{ label: string, value: string }[]>;
    onChange: ChangeEventFunc<HTMLInputElement>;
    radio?: boolean;
}

const Container = ({ isSelected, list, onChange, radio= true }: PropsType) => {
    
    return (
        <FormGroup row>
            {
                list.current.map(item => {
                    const itemProps = {
                        checked: isSelected(item.value),
                        key: item.value,
                        label: item.label,
                        onChange: onChange,
                        value: item.value
                    }

                    return radio ? <Radio { ...itemProps } /> : <Checkbox { ...itemProps} />
                })
            }
        </FormGroup>
    )
}

export default Container;