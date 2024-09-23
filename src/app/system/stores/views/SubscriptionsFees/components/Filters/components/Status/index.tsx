import { ChangeEvent } from "react"
import RadioGroup from "@mui/material/RadioGroup"

import { PAYMENT_STATUS } from "@/types/payment-method"

import { getList } from "@/helpers"

import useSearchParams from "@/hooks/useSearchParams"

import Checkbox from "@/components/checkbox"

const statusList = getList(PAYMENT_STATUS)

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