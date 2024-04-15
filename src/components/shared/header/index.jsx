
import classNames from "classnames";

import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';

import UserProfile from "./components/user-profile";

const Header = () => {

    return (
        <header className="bg-primary-100 flex items-center justify-between px-4 py-2">
            <div>
                <Typography
                    component="h1"
                    className={classNames("font-bold text-xl")}>
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