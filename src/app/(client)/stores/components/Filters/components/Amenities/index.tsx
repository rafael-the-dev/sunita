import {useMemo} from "react"
import FormGroup from "@mui/material/FormGroup"

import { STORE_AMENITIES } from "@/types/warehouse"

import Collapse from "@/components/shared/collapse"
import Checkbox from "@/components/checkbox"

const Amenities = () => {
    const list = useMemo(
        () => Object
            .values(STORE_AMENITIES),
        []
    )

    return (
        <Collapse title="Amenities">
            <FormGroup>
                {
                    list.map(item => (
                        <Checkbox 
                            key={item}
                            label={item}
                            onChange={() => {}}
                            value={item}
                        />
                    ))
                }
            </FormGroup>
        </Collapse>
    )
}

export default Amenities