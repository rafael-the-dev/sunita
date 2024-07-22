import { useCallback, useContext, useEffect, useRef } from "react"

import { LoginContext } from "@/context/LoginContext"
import { FixedTabsContext } from "@/context/FixedTabsContext"
import { RoomsContext } from "../../context"

import { RoomType } from "@/types/room"
import { TableHeadersType } from "@/components/table/types"

import useFetch from "@/hooks/useFetch"
import useSearchParams from "@/hooks/useSearchParams"

import Button from "@/components/shared/button"
import RoomForm from "./components/RoomsForm"
import Status from "@/components/shared/Status"
import Table from "@/components/shared/table"
import RoomsForm from "./components/RoomsForm"

enum DIALOG_TYPE {
    REGISTER_ROOM = "register-room"
}

const Rooms = () => {
    const { credentials } = useContext(LoginContext)
    const { setDialog } = useContext(FixedTabsContext)
    const { fetchRooms, getRooms } = useContext(RoomsContext)

    const searchParams = useSearchParams()

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
        () => getRooms(),
        [ getRooms ]
    )

    const openDialogHandler = useCallback(
        (value: DIALOG_TYPE) => () => searchParams.setSearchParam("dialog", value),
        [ searchParams ]
    )

    const roomDialogHelper = useCallback(
        (title: string, room: RoomType) => {
            setDialog(
                {
                    header: {
                        title
                    },
                    body: <RoomsForm />,
                    payload: room
                }
            )
        },
        [ setDialog ]
    )

    const openRegisterRoomDialog = useCallback(
        () => roomDialogHelper("Add new room", null),
        [ roomDialogHelper ]
    )

    const openUpdateRoomDialog = useCallback(
        (room: RoomType) => () => roomDialogHelper("Update room", room),
        [ roomDialogHelper ]
    )

    const dialogQueryParam = searchParams.get("dialog", "") as DIALOG_TYPE;

    useEffect(
        () => {
            if(dialogQueryParam === DIALOG_TYPE.REGISTER_ROOM) openRegisterRoomDialog();
        }, 
        [ dialogQueryParam, openRegisterRoomDialog ]
    )

    return (
        <div className="flex flex-col justify-between h-full">
            <div>
                <Table 
                    data={getRoomsList()}
                    headers={tableHeaders}
                    onClickRow={openUpdateRoomDialog}
                />
            </div>
            <div className="flex flex-col gap-y-3 items-stretch mt-8 sm:flex-row sm:gap-x-3 sm:gap-y-0 sm:justify-end">
                <Button
                    className="py-2"
                    onClick={openDialogHandler(DIALOG_TYPE.REGISTER_ROOM)}>
                    Add new room
                </Button>
            </div>
        </div>
    )
}

export default Rooms