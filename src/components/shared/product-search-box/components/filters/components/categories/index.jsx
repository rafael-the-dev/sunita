import * as React from "react";

import Collapse from "../collapse";
import Checkbox from "@/components/checkbox";

const Categories = () => {
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

    return (
        <Collapse title="Categories">
            <ul>
                {
                    list.map(({ label, value }) => (
                        <li key={value}>
                            <Checkbox 
                                label={label}
                            />
                        </li>
                    ))
                }
            </ul>
        </Collapse>
    );
};

export default Categories;