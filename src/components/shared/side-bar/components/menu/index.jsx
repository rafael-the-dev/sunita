import { useContext } from "react";

import { LoginContext } from "@/context/LoginContext"

import ListItem from "./components/list-item";

const Menu = () => {
    const { user } = useContext(LoginContext);

    const list = [
        {
            label: "Home",
            path: `/users/${user.username}`
        },
        {
            label: "Sales",
            path: `/users/${user.username}/warehouses/${12345}/sales`
        },
        {
            label: "Products",
            path: `/users/${user.username}/warehouses/${12345}/products`
        },
    ];

    return (
        <ul>
            {
                list.map((item, index) => (
                    <ListItem 
                        key={index}
                        { ...item }
                    />
                ))
            }
        </ul>
    );
};

export default Menu;