import { ChangeEvent } from "react"
import RadioGroup from "@mui/material/RadioGroup"

import { FEES_TYPE } from "@/types/fees"

import { getList } from "@/helpers"

import useSearchParams from "@/hooks/useSearchParams"

import Checkbox from "@/components/checkbox"

const statusList = getList(FEES_TYPE)

const FeeTypeFilter = () => {
    const searchParams = useSearchParams()

    const statusQueryParams = searchParams.getAll("type")

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => searchParams.toggleSearchParams("type", e.target.getAttribute("value"))

    return (
        <RadioGroup>
            {
                statusList.map(feeType => (
                    <Checkbox 
                        { ...feeType }
                        checked={searchParams.isChecked(statusQueryParams, feeType.value)}
                        key={feeType.value}
                        onChange={changeHandler}
                    />
                ))
            }
        </RadioGroup>
    )
}

export default FeeTypeFilter