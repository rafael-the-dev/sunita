import { ChangeEvent } from "react";

import { Checkbox, FormControlLabel } from "@mui/material";
import { styled } from "@mui/material/styles";

type CheckboxPropsType = {
    checked?: boolean;
    label: string;
    onChange: (e: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    value?: string;
};

const CustomCheckbox = styled(Checkbox)({
    "& .MuiSvgIcon-root": {
        borderRadius: 10
    },
    '&.Mui-checked': {
        color: "#27272a"
    }
});

const CheckboxContainer = ({ checked, label, onChange, value}: CheckboxPropsType) => (
    <FormControlLabel 
        control={<CustomCheckbox checked={checked} onChange={onChange} value={value} />} 
        label={label}
    />
);

export default CheckboxContainer;