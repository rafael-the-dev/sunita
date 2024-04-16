
import classNames from "classnames";

import Avatar from "@mui/material/Avatar";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';

import styles from "./styles.module.css";

import Menu from "./components/menu";
import UserProfile from "./components/user-profile";

const Header = () => {

    return (
        <header className="bg-primary-100 flex items-center justify-between px-1 py-2 md:px-4">
            <div className="flex grow items-center">
                <Hidden mdUp><Menu /></Hidden>
                <Typography
                    component="h1"
                    className={classNames(styles.title, "font-bold overflow-hidden text-xl text-ellipsis text-nowrap")}>
                    Dashboard
                </Typography>
            </div>
            <div className="flex items-center">
                <IconButton>
                    <NotificationsIcon />
                </IconButton>
                <IconButton>
                    <SettingsIcon />
                </IconButton>
                <UserProfile />
            </div>
        </header>
    );
};

export default Header;