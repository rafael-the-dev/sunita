import { useContext } from "react";

import Icon from "@mui/material/Icon";

import LogoutIcon from '@mui/icons-material/Logout';

import Button from "@/components/shared/button";
import { LoginContext } from "@/context/LoginContext";

const LogoutButton = () => {
    const { logout } = useContext(LoginContext)

    return (
        <Button 
            color="secondary"
            className=" text-red-800 w-full"
            onClick={logout}>
            <Icon className="flex">
                <LogoutIcon />
            </Icon>
            Log out
        </Button>
    );

};

export default LogoutButton;