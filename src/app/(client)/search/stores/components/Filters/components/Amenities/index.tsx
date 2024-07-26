import { ChangeEvent, useCallback, useMemo } from "react"
import FormGroup from "@mui/material/FormGroup"

import { STORE_AMENITIES } from "@/types/warehouse"

import useSearchParams from "../../../../hooks/useSearchParams"

import Collapse from "@/components/shared/collapse"
import Checkbox from "@/components/checkbox"

const Amenities = () => {
    const { changeHandler, searchParams } = useSearchParams()

    const amenities = searchParams.getAll("amenities")

    const list = useMemo(
        () => Object
            .values(STORE_AMENITIES),
        []
    )

    return (
        <Collapse classes={{ root: "bg-white" }} title="Amenities">
            <FormGroup>
                {
                    list.map(item => (
                        <Checkbox 
                            checked={searchParams.isChecked(amenities, item)}
                            key={item}
                            label={item}
                            onChange={changeHandler("amenities", searchParams.setSearchParams)}
                            value={item}
                        />
                    ))
                }
            </FormGroup>
        </Collapse>
    )
}

export default Amenities