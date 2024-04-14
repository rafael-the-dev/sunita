
import ListItem from "./components/list-item";

const list = [
    {
        label: "Home",
        path: "/users/rafaeltivane"
    },
    {
        label: "Sales",
        path: "/sales"
    },
    {
        label: "Products",
        path: "/products"
    },
];

const Menu = () => {

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