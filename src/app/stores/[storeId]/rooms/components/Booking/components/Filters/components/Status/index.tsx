import { ChangeEvent } from "react"
import RadioGroup from "@mui/material/RadioGroup"

import { BOOKING_STATUS } from "@/types/booking"

import { getList } from "@/helpers"

import useSearchParams from "@/hooks/useSearchParams"

import Checkbox from "@/components/checkbox"

const statusList = getList(BOOKING_STATUS).filter(status => status.value !== BOOKING_STATUS.CANCELLED)

const StatusFilter = () => {
    const searchParams = useSearchParams()

    const statusQueryParams = searchParams.getAll("status")

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => searchParams.toggleSearchParams("status", e.target.getAttribute("value"))

    return (
        <RadioGroup>
            {
                statusList.map(status => (
                    <Checkbox 
                        { ...status }
                        checked={searchParams.isChecked(statusQueryParams, status.value)}
                        key={status.value}
                        onChange={changeHandler}
                    />
                ))
            }
        </RadioGroup>
    )
}

export default StatusFilter