import { useContext } from "react";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import Typography from "@mui/material/Typography";

import styles from "./styles.module.css";

import { LoginContext } from "@/context/LoginContext";
//:;
const Title = () => {
    const { credentials } = useContext(LoginContext)
    const pathname = usePathname();
    
    const start = `/users/${credentials?.user?.username}`

    const getTitle = () => {
        const title = {
            [`${start}/warehouses/12345/expenses`]: "Expenses",
            [`${start}/warehouses/12345/products`]: "Products",
            [`${start}/warehouses/12345/products/stock-reports`]: "Stock reports",
            [`${start}/warehouses/12345/sales`]: "Sale",
            [start]: "Dashboard",
        }[pathname];

        return title;
    };

    return (
        <Typography
            component="h1"
            className={classNames(styles.title, "font-bold overflow-hidden text-xl text-ellipsis text-nowrap")}>
            { getTitle() }
        </Typography>
    );
};

export default Title;