import { useContext } from "react";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { UserType } from "@/types/user";
import { LoginContext } from "@/context/LoginContext";

const Container = () => {
    const result = useContext(LoginContext);
    const user = (result.user) as  UserType;

    return (
        <div className="flex items-center">
            
            <Button
                className="capitalize ml-2 text-primary-800"
                endIcon={<KeyboardArrowDownIcon />}>
                { user.firstName }
            </Button>
            <Avatar 
                className="ml-1"
                sizes="small"
                src="https://www.google.com/imgres?q=avatar%20profile%20picture&imgurl=https%3A%2F%2Fi.pngimg.me%2Fthumb%2Ff%2F720%2F1d714a7743.jpg&imgrefurl=https%3A%2F%2Fnohat.cc%2Ff%2F3d-default-avatar-of-male-png-transparent%2F1d714a7743-202301260847.html&docid=GTrxHRS-_6ICOM&tbnid=W10oDnXwwDXHlM&vet=12ahUKEwiF39ypssKFAxV4wAIHHSGiAmEQM3oECBgQAA..i&w=720&h=720&hcb=2&ved=2ahUKEwiF39ypssKFAxV4wAIHHSGiAmEQM3oECBgQAA"
            />
        </div>
    );
};

export default Container;