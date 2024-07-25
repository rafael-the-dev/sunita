import * as React from "react"
import classNames from "classnames"

import styles from "./styles.module.css"

import useSearchParams from "@/hooks/useSearchParams"
import { isInvalidNumber } from "@/helpers/validation"

import Collapse from "@/components/shared/collapse"
import Input from "@/components/Input"


enum PRICES_PARAMS {
    MIN = "min-price",
    MAX = "max-price"
}

const Price = ({ className }: { className?: string }) => {
    const searchParams = useSearchParams()

    const minPriceRef = React.useRef<HTMLInputElement>(null)
    const maxPriceRef = React.useRef<HTMLInputElement>(null)

    const minPrice = searchParams.get("min-price", 0)
    const maxPrice = searchParams.get("max-price", 1000)

    const isMinPriceLessThanZero = isInvalidNumber(minPrice, 0);
    const isMaxPriceGreaterThanMinPrice = isInvalidNumber(maxPrice, minPrice);

    const changeHandler = React.useCallback(
        (key: PRICES_PARAMS) => (e: React.ChangeEvent<HTMLInputElement>) => {
            searchParams.setSearchParam(key, e.target.value)
        }, 
        [ searchParams ]
    );

    React.useEffect(() => {
        if(minPriceRef.current) minPriceRef.current.value = minPrice.toString();
    }, [ minPrice ])

    React.useEffect(() => {
        if(maxPriceRef.current) maxPriceRef.current.value = maxPrice.toString();
    }, [ maxPrice ])

    return (
        <Collapse 
            classes={{ root: className }}
            open 
            title="Price">
            <div className="flex items-center justify-between">
                <div className={classNames(styles.input, "flex flex-col")}>
                    <label htmlFor="min-price">Min</label>
                    <Input 
                        className="!border mt-2 !py-2"
                        error={isMinPriceLessThanZero}
                        id="min-price"
                        onChange={changeHandler(PRICES_PARAMS.MIN)}
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
                        onChange={changeHandler(PRICES_PARAMS.MAX)}
                        placeholder="Max"
                        ref={maxPriceRef}
                    />
                </div>
            </div>
        </Collapse>
    )
}

export default Price