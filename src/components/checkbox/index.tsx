import { Checkbox, FormControlLabel } from "@mui/material";
import { FormControlLabelProps } from "@mui/material/FormControlLabel/FormControlLabel";
import { styled } from "@mui/material/styles";

const CustomCheckbox = styled(Checkbox)({
    "& .MuiSvgIcon-root": {
        borderRadius: 10
    },
    '&.Mui-checked': {
        color: "#27272a"
    }
});

const CheckboxContainer = ({ checked, label, onChange }: FormControlLabelProps) => (
    <FormControlLabel 
        control={<CustomCheckbox checked={checked} onChange={onChange} />} 
        label={label}
    />
);

export default CheckboxContainer;