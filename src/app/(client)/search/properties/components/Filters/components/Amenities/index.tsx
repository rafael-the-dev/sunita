import FormGroup from "@mui/material/FormGroup"

import { STORE_AMENITIES } from "@/types/warehouse"

import useSearchParams from "@/hooks/useSearchParams"
import { getList } from "@/helpers"

import Collapse from "@/components/shared/collapse"
import Checkbox from "@/components/checkbox"

const list = getList(STORE_AMENITIES)

const Amenities = () => {
    const searchParams = useSearchParams()

    const amenities = searchParams.getAll("amenities")

    return (
        <Collapse classes={{ root: "bg-white" }} title="Amenities">
            <FormGroup>
                {
                    list.map(item => (
                        <Checkbox 
                            { ...item }
                            checked={searchParams.isChecked(amenities, item.value)}
                            key={item.value}
                            onChange={searchParams.changeHandler("amenities", searchParams.toggleSearchParams)}
                        />
                    ))
                }
            </FormGroup>
        </Collapse>
    )
}

export default Amenities