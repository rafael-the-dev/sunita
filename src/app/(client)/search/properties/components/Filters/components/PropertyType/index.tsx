import { ChangeEvent, useCallback, useMemo } from "react"
import FormGroup from "@mui/material/FormGroup"

import { PROPERTY_TYPE } from "@/types/property"

import useSearchParams from "@/hooks/useSearchParams"
import { getList } from "@/helpers"

import Collapse from "@/components/shared/collapse"
import RadioButton from "@/components/radio-button"

const list = getList(PROPERTY_TYPE)

const PropertyType = () => {
    const searchParams = useSearchParams()

    const propertyType = searchParams.get("type", PROPERTY_TYPE.BED_ROOM)

    return (
        <Collapse classes={{ root: "bg-white" }} title="Property Type">
            <FormGroup>
                {
                    list.map(item => (
                        <RadioButton 
                            { ...item }
                            checked={searchParams.isChecked(propertyType, item.value)}
                            key={item.value}
                            onChange={searchParams.changeHandler("type", searchParams.setSearchParam)}
                        />
                    ))
                }
            </FormGroup>
        </Collapse>
    )
}

export default PropertyType