import { ChangeEvent, useCallback } from "react"
import FormGroup from "@mui/material/FormGroup"

import useSearchParams from "../../../../hooks/useSearchParams"

import Collapse from "@/components/shared/collapse"
import RadioButton from "@/components/radio-button"

enum PRICING_TYPES {
    ALL = "All",
    DAILY = "daily",
    HOURLY = "hourly"
}

const PricingType = () => {
    const { changeHandler, searchParams } = useSearchParams()

    const pricingType = searchParams.get("pricing-type", PRICING_TYPES.ALL)

    return (
        <Collapse classes={{ root: "bg-white" }} title="Type of price">
            <FormGroup>
                {
                    Object
                        .values(PRICING_TYPES)
                        .map(value => (
                            <RadioButton 
                                checked={searchParams.isChecked(pricingType, value)}
                                key={value}
                                label={value}
                                onChange={changeHandler("pricing-type", searchParams.setSearchParam)}
                                value={value}
                            />
                        ))
                }
            </FormGroup>
        </Collapse>
    )
}

export default PricingType