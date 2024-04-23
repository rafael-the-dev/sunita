import * as React from "react";

import { ProductFilterContext } from "@/context/ProductFilterContext";

import Collapse from "../collapse";
import Checkbox from "@/components/checkbox";

const Categories = () => {
    const { category, isChecked, setSearchParams } = React.useContext(ProductFilterContext);

    const list = [
        {
            label: "T-shirt",
            value: "T-SHIRT"
        },
        {
            label: "Hoodie",
            value: "HOODIE"
        },{
            label: "Trouser",
            value: "TROUSER"
        },{
            label: "Sneacker",
            value: "SNEACKER"
        },
    ];

    const changeHandler = React.useCallback((e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setSearchParams("category", e.target.value)
    }, [ setSearchParams ]);

    return (
        <Collapse title="Categories">
            <ul>
                {
                    list.map(({ label, value }) => (
                        <li key={value}>
                            <Checkbox 
                                checked={isChecked(category, value)}
                                label={label}
                                onChange={changeHandler}
                                value={value}
                            />
                        </li>
                    ))
                }
            </ul>
        </Collapse>
    );
};

export default Categories;