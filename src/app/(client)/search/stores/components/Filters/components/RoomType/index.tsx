import FormGroup from "@mui/material/FormGroup"

import { ROOM_TYPE } from "@/types/room"

import useSearchParams from "@/hooks/useSearchParams"
import { getList } from "@/helpers"

import Collapse from "@/components/shared/collapse"
import RadioButton from "@/components/radio-button"

const list = getList(ROOM_TYPE)

const RoomType = () => {
    const searchParams = useSearchParams()

    const room = searchParams.get("room", "")
    
    return (
        <Collapse classes={{ root: "bg-white" }} title="Room Type">
            <FormGroup>
                {
                    list.map(item => (
                        <RadioButton 
                            { ...item }
                            checked={searchParams.isChecked(room, item.value)}
                            key={item.value}
                            onChange={searchParams.changeHandler("room", searchParams.setSearchParam)}
                        />
                    ))
                }
            </FormGroup>
        </Collapse>
    )
}

export default RoomType