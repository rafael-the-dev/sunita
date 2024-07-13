import { useContext } from "react";

import { LoginContext } from "@/context/LoginContext"

import ListItem from "./components/list-item";

const Menu = () => {
    const { credentials, user } = useContext(LoginContext);

    const list = [
        {
            label: "Home",
            path: `/users/${ credentials?.user?.username }`
        },
        {
            label: "Sales",
            path: `/users/${ credentials?.user?.username }/warehouses/${ credentials?.user?.stores[0]?.storeId }/sales`
        },
        {
            label: "Products",
            path: `/users/${ credentials?.user?.username }/warehouses/${ credentials?.user?.stores[0]?.storeId }/products`
        },
        {
            label: "Rooms",
            path: `/stores/${ credentials?.user?.stores[0]?.storeId }/rooms`
        },
        {
            label: "Expenses",
            path: `/users/${ credentials?.user?.username }/warehouses/${ credentials?.user?.stores[0]?.storeId }/expenses`
        },
        {
            label: "Users",
            path: `/stores/${ credentials?.user?.stores[0]?.storeId }/users`
        },
        {
            label: "Finances",
            path: `/stores/${ credentials?.user?.stores[0]?.storeId }/finances`
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