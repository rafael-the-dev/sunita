import {useMemo} from "react"
import FormGroup from "@mui/material/FormGroup"

import { ROOM_TYPE } from "@/types/room"

import Collapse from "@/components/shared/collapse"
import RadioButton from "@/components/radio-button"

const Amenities = () => {
    const list = useMemo(
        () => Object
            .values(ROOM_TYPE),
        []
    )

    return (
        <Collapse title="Room Type">
            <FormGroup>
                {
                    list.map(item => (
                        <RadioButton 
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