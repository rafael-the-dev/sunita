import * as React from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

import { ProductFilterContext } from "@/context/ProductFilterContext";

import { isInvalidNumber } from "@/helpers/validation";

import Collapse from "../collapse";
import Input from "@/components/Input";

const Price = () => {
    const { price, setUniqueSearchParams } = React.useContext(ProductFilterContext);

    const minPriceRef = React.useRef<HTMLInputElement | null>(null);
    const maxPriceRef = React.useRef<HTMLInputElement | null>(null);

    const minPrice = price.min;
    const maxPrice = price.max;

    const isMinPriceLessThanZero = isInvalidNumber(minPrice, 0);

    const isMaxPriceGreaterThanMinPrice = isInvalidNumber(maxPrice, minPrice);

    const changeHandler = React.useCallback(
        (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setUniqueSearchParams(key, e.target.value)
        }, 
        [ setUniqueSearchParams ]
    );

    React.useEffect(() => {
        if(minPriceRef.current) minPriceRef.current.value = minPrice.toString();
    }, [ minPrice ])

    React.useEffect(() => {
        if(maxPriceRef.current) maxPriceRef.current.value = maxPrice.toString();
    }, [ maxPrice ])

    return (
        <Collapse open title="Price">
            <div className="flex items-center justify-between">
                <div className={classNames(styles.input, "flex flex-col")}>
                    <label htmlFor="min-price">Min</label>
                    <Input 
                        className="!border mt-2 !py-2"
                        error={isMinPriceLessThanZero}
                        id="min-price"
                        onChange={changeHandler("min-price")}
                        placeholder="Min"
                        ref={minPriceRef}
                    />
                </div>
                <span className="mx-[2%] text-2xl">|</span>
                <div className={classNames(styles.input, "flex flex-col")}>
                    <label htmlFor="max-price">Max</label>
                    <Input 
                        className="!border mt-2 !py-2"
                        error={isMaxPriceGreaterThanMinPrice}
                        id="max-price"
                        onChange={changeHandler("max-price")}
                        placeholder="Max"
                        ref={maxPriceRef}
                    />
                </div>
            </div>
        </Collapse>
    );
};

export default Price;