import { ChangeEvent, useCallback, useContext } from "react"

import { ExpensesContext } from "@/context/ExpensesContext";
import { AppContext } from "@/context/AppContext";

import ExpensesCategories from "@/components/shared/expenses-categories"

const Categories = () => {
    const { addCategory, getCategory } = useContext(ExpensesContext);
    const { dialog } = useContext(AppContext)

    const changeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => addCategory(e.target.value), [ addCategory ]);

    return (
        <ExpensesCategories 
            onChange={changeHandler}
            showAll={Boolean(dialog.payload)}
            value={getCategory()}
        />
    )
}

export default Categories