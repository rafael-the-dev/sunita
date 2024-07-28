import { useCallback, useContext, useEffect } from "react"

import { FixedTabsContext } from "@/context/FixedTabsContext"
import { RoomsContext } from "../../context"

import { RoomType } from "@/types/room"

import useSearchParams from "@/hooks/useSearchParams"

import Button from "@/components/shared/button"
import Filters from "./components/Filters"
import RoomsForm from "./components/RoomsForm"
import RoomsTable from "@/views/Booking/components/Rooms"
import SearchBox from "@/components/shared/Search/Container"

enum DIALOG_TYPE {
    REGISTER_ROOM = "register-room"
}

const Rooms = () => {
    const { setDialog } = useContext(FixedTabsContext)
    const { getRooms } = useContext(RoomsContext)

    const searchParams = useSearchParams()

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
            <div className="mb-8">
                <SearchBox 
                    className="mb-6"
                    filters={<Filters />}
                />
                <RoomsTable 
                    data={getRooms()}
                    onClickTableRow={openUpdateRoomDialog}
                />
            </div>
            <div className="flex flex-col gap-y-3 items-stretch mt-16 sm:flex-row sm:gap-x-3 sm:gap-y-0 sm:justify-end">
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