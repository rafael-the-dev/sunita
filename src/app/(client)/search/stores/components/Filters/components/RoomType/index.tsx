import { ChangeEvent, useCallback, useMemo } from "react"
import FormGroup from "@mui/material/FormGroup"

import { ROOM_TYPE } from "@/types/room"

import useSearchParams from "../../../../hooks/useSearchParams"

import Collapse from "@/components/shared/collapse"
import RadioButton from "@/components/radio-button"

const RoomType = () => {
    const { changeHandler, searchParams } = useSearchParams()

    const room = searchParams.get("room", "")

    const list = useMemo(
        () => Object
            .values(ROOM_TYPE),
        []
    )
    return (
        <Collapse classes={{ root: "bg-white" }} title="Room Type">
            <FormGroup>
                {
                    list.map(item => (
                        <RadioButton 
                            checked={searchParams.isChecked(room, item)}
                            key={item}
                            label={item}
                            onChange={changeHandler("room", searchParams.setSearchParam)}
                            value={item}
                        />
                    ))
                }
            </FormGroup>
        </Collapse>
    )
}

export default RoomType