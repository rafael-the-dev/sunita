import * as React from "react"

import { ProductFilterContext } from "@/context/ProductFilterContext";

import Collapse from "../collapse";
import Input from "@/components/Input";

const Price = () => {
    const { price, setUniqueSearchParams } = React.useContext(ProductFilterContext);

    const changeHandler = React.useCallback((key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setUniqueSearchParams(key, e.target.value)
    }, [ setUniqueSearchParams ]);

    return (
        <Collapse title="Price">
            <div className="flex items-center">
                <div className="flex flex-col">
                    <label htmlFor="min-price">Min</label>
                    <Input 
                        className="!border mt-2 !py-2"
                        id="min-price"
                        onChange={changeHandler("min-price")}
                        placeholder="Min"
                        value={ price.min }
                    />
                </div>
                <span className="mx-4 text-2xl">|</span>
                <div className="flex flex-col">
                    <label htmlFor="max-price">Max</label>
                    <Input 
                        className="!border mt-2 !py-2"
                        id="max-price"
                        onChange={changeHandler("max-price")}
                        placeholder="Max"
                        value={ price.max }
                    />
                </div>
            </div>
        </Collapse>
    );
};

export default Price;