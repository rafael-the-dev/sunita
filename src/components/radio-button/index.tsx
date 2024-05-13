
import { ChangeEventFunc } from "@/types/events";
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio";


type PropsType = {
    checked?: boolean;
    label?: string;
    onChange: ChangeEventFunc<HTMLInputElement>;
    value?: string;
}

const RadioButton = ({ checked, label, onChange, value }: PropsType) => (
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