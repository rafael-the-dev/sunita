
import classNames from "classnames";

import Avatar from "@mui/material/Avatar";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';

import Menu from "./components/menu";
import UserProfile from "./components/user-profile";
import Title from "./components/title";

const Header = () => {

    return (
        <header className="bg-primary-100 flex items-center justify-between px-1 py-2 md:px-4">
            <div className="flex grow items-center">
                <Hidden mdUp><Menu /></Hidden>
                <Title />
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