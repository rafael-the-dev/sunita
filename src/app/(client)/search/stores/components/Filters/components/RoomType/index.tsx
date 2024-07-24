import { ChangeEvent, useCallback, useMemo } from "react"
import FormGroup from "@mui/material/FormGroup"

import { ROOM_TYPE } from "@/types/room"

import useSearchParams from "@/hooks/useSearchParams"

import Collapse from "@/components/shared/collapse"
import RadioButton from "@/components/radio-button"

const RoomType = () => {
    const searchParams = useSearchParams()

    const room = searchParams.get("room", "")

    const list = useMemo(
        () => Object
            .values(ROOM_TYPE),
        []
    )

    const changeHandler = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => searchParams.setSearchParam("room", e.target.value),
        [ searchParams ]
    )

    const isSelected = useCallback(
        (value: ROOM_TYPE) => room === value,
        [ room ]
    )

    return (
        <Collapse title="Room Type">
            <FormGroup>
                {
                    list.map(item => (
                        <RadioButton 
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

export default RoomType