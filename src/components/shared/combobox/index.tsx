import * as React from "react";
import MenuItem from "@mui/material/MenuItem";

import { PropsType } from "./types";

import Textfield from "@/components/Textfield";

const Combobox = ({ className, label, list, onChange, value }: PropsType) => {

    return (
        <Textfield
            className={className}
            label={label}
            onChange={onChange}
            select
            value={value}>
            {
                list.map(({ label, value }) => (
                    <MenuItem
                        key={value} 
                        value={value}
                        >
                        { label }
                    </MenuItem>
                ))
            }
        </Textfield>
    )
};

export default Combobox;