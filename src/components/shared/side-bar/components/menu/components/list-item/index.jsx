import { useCallback } from "react";
import { usePathname } from "next/navigation";
import classNames from "classnames";

import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";


import styles from "./styles.module.css";

import Link from "@/components/link";

const ListItem = ({ icon, label, path }) => {
    const pathname = usePathname();

    // console.log(pathname, path)
    const isSelected = path === pathname;

    return (
        <li 
            className={classNames(
                styles.container, `relative hover:bg-white hover:opacity-95 hover:text-primary-800`,
                isSelected ? "bg-white text-primary-800" :  "text-white",
                { [styles.listItemSelected]: isSelected }
                )}>
            <Link className="text-current no-underline" href={path}>
                <Typography
                    component="span"
                    className={classNames()}>
                    { label }
                </Typography>
            </Link>
        </li>
    );
};

export default ListItem;