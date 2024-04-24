"use client"

import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles"

const Input = styled(TextField)({
    '&': {
        marginBottom: "1rem"
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: 0
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#27272a"
    }
});

export default Input;