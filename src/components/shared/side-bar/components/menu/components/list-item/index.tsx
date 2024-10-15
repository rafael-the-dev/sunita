import { ReactNode, useCallback, useContext } from "react";
import { usePathname } from "next/navigation";
import classNames from "classnames";

import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";

import { CredentialsType } from "@/types/login";

import { LoginContext } from "@/context/LoginContext"

import styles from "./styles.module.css";

import Link from "@/components/link";

type PropsType = {
    hasAccess: (credentials: CredentialsType, pathname: string) => boolean,
    icon: ReactNode,
    label: string,
    path: string,
}

const ListItem = ({ hasAccess, icon, label, path }: PropsType) => {
    const { credentials } = useContext(LoginContext);

    const pathname = usePathname();

    const isSelected = path === pathname;

    if(!credentials?.user || !hasAccess(credentials, path)) return <></>;

    return (
        <li 
            className={classNames(
                styles.container, `relative hover:bg-white hover:opacity-95 hover:text-primary-800`,
                isSelected ? "bg-white text-primary-800" :  "text-white",
                { [styles.listItemSelected]: isSelected }
                )}>
            <Link className="flex items-center text-current no-underline" href={path}>
                { icon }
                <Typography
                    component="span"
                    className={classNames("ml-3")}>
                    { label }
                </Typography>
            </Link>
        </li>
    );
};

export default ListItem;