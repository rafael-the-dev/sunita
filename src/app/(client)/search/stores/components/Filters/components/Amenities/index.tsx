import { ChangeEvent, useCallback, useMemo } from "react"
import FormGroup from "@mui/material/FormGroup"

import { STORE_AMENITIES } from "@/types/warehouse"

import useSearchParams from "@/hooks/useSearchParams"

import Collapse from "@/components/shared/collapse"
import Checkbox from "@/components/checkbox"

const Amenities = () => {
    const searchParams = useSearchParams()

    const amenities = searchParams.getAll("amenities")

    const list = useMemo(
        () => Object
            .values(STORE_AMENITIES),
        []
    )

    const changeHandler = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => searchParams.setSearchParams("amenities", e.target.value),
        [ searchParams ]
    )

    const isSelected = useCallback(
        (value: STORE_AMENITIES) => amenities.includes(value),
        [ amenities ]
    )

    return (
        <Collapse title="Amenities">
            <FormGroup>
                {
                    list.map(item => (
                        <Checkbox 
                            checked={isSelected(item)}
                            key={item}
                            label={item}
                            onChange={changeHandler}
                            value={item}
                        />
                    ))
                }
            </FormGroup>
        </Collapse>
    )
}

export default Amenities