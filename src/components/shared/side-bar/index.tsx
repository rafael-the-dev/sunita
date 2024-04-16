import * as React from "react";
import classNames from "classnames";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import CloseIcon from '@mui/icons-material/Close';

import styles from "./styles.module.css";

import LogoutButton from "./components/logout-button";
import Link from "@/components/link";
import Menu from "./components/menu";

const SideBar = ({ closeHandler }: { closeHandler?: () => void }) => {

    return (
        <aside className={classNames(styles.container, "bg-primary-800 flex flex-col justify-between relative")}>
            <div className="overflow-hidden">
                <Hidden mdUp>
                    <IconButton
                        className="absolute opacity-30 right-1 text-white hover:opacity-70"
                        onClick={closeHandler}>
                        <CloseIcon />
                    </IconButton>
                </Hidden>
                <Typography
                    className="mt-4 mb-6"
                    component="h2">
                    <Link 
                        className="text-white no-underline px-2"
                        href="/">
                        Luis Langa
                    </Link>
                </Typography>
                <Menu />
            </div>
            <div className={classNames(styles.footer)}>
                <LogoutButton />
            </div>
        </aside>
    );
};

export default SideBar;