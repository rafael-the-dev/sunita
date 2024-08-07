import { useContext } from "react";
import classNames from "classnames"

import styles from "./styles.module.css"

import BedroomIcon from '@mui/icons-material/Hotel';
import ExpensesIcon from '@mui/icons-material/Forward';
import HomeIcon from '@mui/icons-material/Home';
import SaleIcon from '@mui/icons-material/ShoppingCart';
import UsersIcon from '@mui/icons-material/PeopleAlt';
import FinancesIcon from '@mui/icons-material/AttachMoney';

import ProductsIcon from "../../../../../../public/images/icons/milk-svgrepo-com.svg"

import { LoginContext } from "@/context/LoginContext"

import ListItem from "./components/list-item";

const Menu = () => {
    const { credentials, user } = useContext(LoginContext);

    const list = [
        {
            icon: <HomeIcon />,
            label: "Home",
            path: `/users/${ credentials?.user?.username }`
        },
        {
            icon: <SaleIcon />,
            label: "Sales",
            path: `/users/${ credentials?.user?.username }/warehouses/${ credentials?.user?.stores[0]?.storeId }/sales`
        },
        {
            icon: <ProductsIcon className={classNames(styles.productsIcon, "fill-current h-4 w-4 text-2xl")} />,
            label: "Products",
            path: `/users/${ credentials?.user?.username }/warehouses/${ credentials?.user?.stores[0]?.storeId }/products`
        },
        {
            icon: <BedroomIcon />,
            label: "Rooms",
            path: `/stores/${ credentials?.user?.stores[0]?.storeId }/rooms`
        },
        {
            icon: <ExpensesIcon className={classNames(styles.expensesIcon)} />,
            label: "Expenses",
            path: `/users/${ credentials?.user?.username }/warehouses/${ credentials?.user?.stores[0]?.storeId }/expenses`
        },
        {
            icon: <UsersIcon />,
            label: "Users",
            path: `/stores/${ credentials?.user?.stores[0]?.storeId }/users`
        },
        {
            icon: <FinancesIcon />,
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