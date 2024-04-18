import Menu from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import classNames from "classnames";

import styles from "./styles.module.css";

const Categories = () => {
    const list = [
        {
            label: "T-shirt",
            value: "T-SHIRT"
        },
        {
            label: "Trouser",
            value: "TROUSER"
        },
        {
            label: "Sneacker",
            value: "SNEACKER"
        }
    ];

    return (
        <Menu 
            className={classNames(styles.formInput)}
            select>
            {
                list.map(item => (
                    <MenuItem 
                        key={item.value}
                    >
                        { item.label }
                    </MenuItem>
                ))
            }
        </Menu>
    );
};

export default Categories;