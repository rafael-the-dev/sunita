import * as React from "react";

import { CategoryType } from "@/types/category";

import { ProductFilterContext } from "@/context/ProductFilterContext";

import Collapse from "../collapse";
import Checkbox from "@/components/checkbox";

type PropsType = {
    list: CategoryType[]
}

const Categories = ({ list }: PropsType) => {
    const { category, isChecked, setManySearchParams } = React.useContext(ProductFilterContext);

    const changeHandler = React.useCallback((e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setManySearchParams("category", e.target.value)
    }, [ setManySearchParams ]);

    return (
        <Collapse title="Categories">
            <ul>
                {
                    list.map(item => (
                        <li key={item.id}>
                            <Checkbox 
                                checked={isChecked(category, item.name)}
                                label={item.name}
                                onChange={changeHandler}
                                value={item.name}
                            />
                        </li>
                    ))
                }
            </ul>
        </Collapse>
    );
};

export default Categories;