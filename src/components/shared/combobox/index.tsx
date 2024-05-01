import * as React from "react";
import MenuItem from "@mui/material/MenuItem";

import Textfield from "@/components/Textfield";

type PropsType = {
    className?: string;
    label?: string;
    list: { key: string | number ; label: string | number ; }[];
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string | number;
}

const Combobox = ({ className, label, list, onChange, value }: PropsType) => {

    return (
        <Textfield
            className={className}
            label={label}
            onChange={onChange}
            select
            value={value}>
            {
                list.map(item => (
                    <MenuItem
                        key={item.key} 
                        value={item.key}
                        >
                        { item.label }
                    </MenuItem>
                ))
            }
        </Textfield>
    )
};

export default Combobox;