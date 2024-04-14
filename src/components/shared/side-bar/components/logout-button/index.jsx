
import Icon from "@mui/material/Icon";

import LogoutIcon from '@mui/icons-material/Logout';

import Button from "@/components/shared/button";

const LogoutButton = () => {

    return (
        <Button 
            color="secondary"
            className=" text-red-800 w-full">
            <Icon className="flex">
                <LogoutIcon />
            </Icon>
            Log out
        </Button>
    );

};

export default LogoutButton;