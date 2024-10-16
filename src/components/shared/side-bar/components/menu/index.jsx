import { useContext, useMemo } from "react";
import classNames from "classnames"

import styles from "./styles.module.css"

import BedroomIcon from '@mui/icons-material/Hotel';
import ExpensesIcon from '@mui/icons-material/Forward';
import HomeIcon from '@mui/icons-material/Home';
import NewSaleIcon from '@mui/icons-material/AddShoppingCart';
import SaleIcon from '@mui/icons-material/ShoppingCart';
import UsersIcon from '@mui/icons-material/PeopleAlt';
import FinancesIcon from '@mui/icons-material/AttachMoney';
import SystemIcon from '@mui/icons-material/AdminPanelSettings';

import ProductsIcon from "../../../../../../public/images/icons/milk-svgrepo-com.svg"

import { AppContext } from "@/context/AppContext"
import { LoginContext } from "@/context/LoginContext"

import lang from "./lang.json"

import { hasStoreRoutesAccess, hasSystemPageAcess } from "@/middlewares/auth/pages/helpers"

import ListItem from "./components/list-item";

const Menu = () => {
    const { language } = useContext(AppContext);
    const { credentials, user } = useContext(LoginContext);

    const list = useMemo(
        () => [
            {
                hasAccess: hasStoreRoutesAccess,
                icon: <HomeIcon />,
                label: lang["home"][language],
                path: `/stores/${ credentials?.user?.stores[0]?.storeId }`
            },
            {
                hasAccess: hasStoreRoutesAccess,
                icon: <NewSaleIcon />,
                label: lang["new-sale"][language],
                path: `/stores/${ credentials?.user?.stores[0]?.storeId }/sales/new-sale`
            },
            {
                hasAccess: hasStoreRoutesAccess,
                icon: <SaleIcon />,
                label: lang["sales"][language],
                path: `/stores/${ credentials?.user?.stores[0]?.storeId }/sales`
            },
            {
                hasAccess: hasStoreRoutesAccess,
                icon: <ProductsIcon className={classNames(styles.productsIcon, "fill-current h-4 w-4 text-2xl")} />,
                label: lang["products"][language],
                path: `/stores/${ credentials?.user?.stores[0]?.storeId }/products`
            },
            {
                hasAccess: hasStoreRoutesAccess,
                icon: <BedroomIcon />,
                label: lang["properties"][language],
                path: `/stores/${ credentials?.user?.stores[0]?.storeId }/rooms`
            },
            {
                hasAccess: hasStoreRoutesAccess,
                icon: <ExpensesIcon className={classNames(styles.expensesIcon)} />,
                label: lang["expenses"][language],
                path: `/stores/${ credentials?.user?.stores[0]?.storeId }/expenses`
            },
            {
                hasAccess: hasStoreRoutesAccess,
                icon: <UsersIcon />,
                label: lang["users"][language],
                path: `/stores/${ credentials?.user?.stores[0]?.storeId }/users`
            },
            {
                hasAccess: hasStoreRoutesAccess,
                icon: <FinancesIcon />,
                label: lang["finances"][language],
                path: `/stores/${ credentials?.user?.stores[0]?.storeId }/finances`
            },
            {
                hasAccess: hasSystemPageAcess,
                icon: <SystemIcon />,
                label: lang["System"][language],
                path: `/system/stores`
            },
        ],
        [ credentials, language ]
    );

    const listMemo = useMemo(
        () => (
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
        ),
        [ list ]
    )

    return listMemo;
};

export default Menu;