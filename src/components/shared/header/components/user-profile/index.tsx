import { useCallback, useContext, useRef } from "react";
import classNames from "classnames";

import Avatar from "@mui/material/Avatar";
// import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

import styles from "./styles.module.css";

import { UserType } from "@/types/user";
import { LoginContext } from "@/context/LoginContext";

import Popover from "@/components/popover";
import ListItem from "./components/list-item";

type ClickEventType = React.MouseEvent<HTMLButtonElement>;


const Container = () => {
    const result = useContext(LoginContext);
    const user = (result.user) as  UserType;

    const list = useRef([
        {
            icon: <PersonIcon  />,
            label: "Profile"
        },
        {
            icon: <LogoutIcon />,
            label: "Log out"
        }
    ]);

    const onClicHandlerkRef = useRef<(e: ClickEventType) => void | null>(null);

    const ClickHandler = useCallback((e: ClickEventType) => onClicHandlerkRef.current?.(e), []);

    return (
        <div className="flex items-center">
            <IconButton
                onClick={ClickHandler}>
                <Avatar 
                    alt={user.firstName}
                    className={classNames(styles.avatar)}
                    src="https://www.google.com/imgres?q=User%20avatar%20jpg&imgurl=https%3A%2F%2Fbanner2.cleanpng.com%2F20180402%2Fbje%2Fkisspng-computer-icons-avatar-login-user-avatar-5ac207e69ecd41.2588125315226654466505.jpg&imgrefurl=https%3A%2F%2Fwww.cleanpng.com%2Fpng-computer-icons-avatar-login-user-avatar-827205%2F&docid=53u2Z0OA3nDN7M&tbnid=Lg1fSQeXXxooyM&vet=12ahUKEwiZm4rA28aFAxUegf0HHQUeDZUQM3oECGQQAA..i&w=900&h=520&hcb=2&ved=2ahUKEwiZm4rA28aFAxUegf0HHQUeDZUQM3oECGQQAA"
                />
            </IconButton>
            <Popover
                id="user popover"
                onClickRef={onClicHandlerkRef}
                >
                <ul>
                    {
                        list.current.map((item, index) => (
                            <ListItem 
                                key={index}
                                { ...item }
                            />
                        ))
                    }
                    </ul>
            </Popover>
        </div>
    );
};

export default Container;