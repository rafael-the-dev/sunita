import { useCallback, useRef } from "react"
import Avatar from "@mui/material/Avatar"

import { RoomType } from "@/types/room"
import { TableHeadersType } from "@/components/table/types"

import Status from "@/components/shared/Status"
import Table from "@/components/shared/table"
import { PropertyType } from "@/types/property"

type PropsType = {
    data: PropertyType[],
    onClickTableRow: (row: RoomType) => () => void
}

const RoomsContainer = ({ data, onClickTableRow }: PropsType) => {
    const tableHeaders = useRef<TableHeadersType[]>(
        [
            {
                getComponent({ item }) {
                    const property = item as PropertyType

                    return (
                        <div className="flex justify-center w-full">
                            <Avatar 
                                alt={property.name} 
                                src={property?.images[0]}  
                                sx={{ height: 47, width: 47 }}
                                variant="square"
                            />
                        </div>
                    )
                },
                label: "Image",
                key: {
                    value: "images"
                }
            },
            {
                label: "Name",
                key: {
                    value: "name"
                }
            },
            {
                label: "Type",
                key: {
                    value: "type"
                }
            },
            {
                label: "Hourly price",
                key: {
                    value: "price",
                    subKey: {
                        value: "hourly"
                    }
                }
            },
            {
                label: "Daily price",
                key: {
                    value: "price",
                    subKey: {
                        value: "daily"
                    }
                }
            },
            {
                label: "Price per night",
                key: {
                    value: "price",
                    subKey: {
                        value: "night"
                    }
                }
            },
            {
                getComponent({ item }) {
                    const property = item as PropertyType

                    return (
                        <div className="flex justify-center w-full">
                            <Status status={property.status}  />
                        </div>
                    )
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