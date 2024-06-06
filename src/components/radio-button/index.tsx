
import { ChangeEventFunc } from "@/types/events";
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio";


type PropsType<T> = {
    checked?: boolean;
    label?: string;
    onChange: ChangeEventFunc<HTMLInputElement>;
    value?: string | T;
}

const RadioButton = <T, >({ checked, label, onChange, value }: PropsType<T>) => (
    <FormControlLabel 
        control={
            <Radio 
                checked={checked} 
                onChange={onChange}
                value={value}
            />} 
        label={label} 
    />
);

export default RadioButton;