import { useContext } from "react"
import classNames from "classnames";

import styles from "./styles.module.css"
import { ExpensesContext } from "@/context/ExpensesContext";

import Button from "@/components/shared/button"
import ListItem from "./components/expense-item";
import TextField from "@/components/Textfield";
import Combobox from "@/components/shared/combobox";

const list = [
    {
        label: "Credelec",
        key: "credelect"
    },
    {
        label: "Food",
        key: "food"
    },
    {
        label: "Fuel",
        key: "fuel"
    }
]

const RegisterExpenses = () => {
    const { addItem, getItems, removeItem, totalPrice } = useContext(ExpensesContext);//:;

    return (
        <form className={classNames(styles.form)}>
            <div className="px-3 pb-6 pt-8">
                <div className="flex flex-col items-stretch justify-between sm:flex-row">
                    <TextField
                        className={classNames(styles.input, `font-semibold`)}
                        inputProps={{ readOnly: true }}
                        label="Total Price"
                        value={totalPrice}
                    />
                    <Combobox 
                        className={classNames(styles.input)}
                        label="Category"
                        list={list}
                        onChange={() => {}}
                        value="credelec"
                    />
                </div>
                <div>
                    {
                        getItems().map(item => (
                            <ListItem { ...item } key={item.id} />
                        ))
                    }
                </div>
                <div className="flex justify-center">
                    <Button onClick={addItem}>Add new item</Button>
                </div>
                <div className="flex justify-end mt-16">
                    <Button onClick={addItem}>Submit</Button>
                </div>
            </div>
        </form>
    )
};

export default RegisterExpenses;