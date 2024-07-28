import { useCallback, useRef } from "react"

import { RoomType } from "@/types/room"
import { TableHeadersType } from "@/components/table/types"

import Status from "@/components/shared/Status"
import Table from "@/components/shared/table"

type PropsType = {
    data: RoomType[],
    onClickTableRow: (row: RoomType) => () => void
}

const RoomsContainer = ({ data, onClickTableRow }: PropsType) => {
    const tableHeaders = useRef<TableHeadersType[]>(
        [
            {
                label: "Type",
                key: {
                    value: "type"
                }
            },
            {
                label: "Number of rooms",
                key: {
                    value: "quantity"
                }
            },
            {
                label: "Hourly price",
                key: {
                    value: "hourlyPrice"
                }
            },
            {
                label: "Daily price",
                key: {
                    value: "dailyPrice"
                }
            },
            {
                getComponent({ item }) {
                    const room = item as RoomType

                    return <Status status={room.status}  />
                },
                label: "Status",
                key: {
                    value: "status"
                }
            },
            
        ]
    )

    const getRoomsList = useCallback(
        () => data ?? [],
        [ data ]
    )

    return (
        <Table 
            data={getRoomsList()}
            headers={tableHeaders}
            onClickRow={onClickTableRow}
        />
    )
}

export default RoomsContainer