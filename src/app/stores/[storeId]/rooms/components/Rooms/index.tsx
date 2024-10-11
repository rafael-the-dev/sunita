import { useCallback, useContext, useEffect } from "react"

import { FixedTabsContext } from "@/context/FixedTabsContext"
import { RoomsContext } from "../../context"

import {LANGUAGE} from "@/types/language"
import { RoomType } from "@/types/room"

import useLanguage from "@/hooks/useLanguage"
import useSearchParams from "@/hooks/useSearchParams"

import Button from "@/components/shared/button"
import Filters from "./components/Filters"
import RoomsForm from "./components/RoomsForm"
import RoomsTable from "@/views/Booking/components/Rooms"
import SearchBox from "@/components/shared/Search/Container"

enum DIALOG_TYPE {
    REGISTER_ROOM = "register-room"
}

const lang = {
    buttons: {
        addNewProperty: {
            [LANGUAGE.ENGLISH]: "Add new property",
            [LANGUAGE.PORTUGUESE]: "Adicionar nova propriedade"
        }
    },
    title: {
        add: {
            [LANGUAGE.ENGLISH]: "Register new property",
            [LANGUAGE.PORTUGUESE]: "Registar nova propriedade"
        },
        update: {
            [LANGUAGE.ENGLISH]: "Update properrty",
            [LANGUAGE.PORTUGUESE]: "Atualizar propriedade"
        }
    },
}

const Rooms = () => {
    const { setDialog } = useContext(FixedTabsContext)
    const { getProperties } = useContext(RoomsContext)

    const searchParams = useSearchParams()

    const { language } = useLanguage()

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
        () => roomDialogHelper(lang.title.add[language], null),
        [ language, roomDialogHelper ]
    )

    const openUpdateRoomDialog = useCallback(
        (property: RoomType) => () => roomDialogHelper(lang.title.update[language], property),
        [ language, roomDialogHelper ]
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
            <div className="flex flex-col items-stretch mb-8">
                <SearchBox 
                    className="mb-6"
                    filters={<Filters />}
                />
                <RoomsTable 
                    data={getProperties()}
                    onClickTableRow={openUpdateRoomDialog}
                />
            </div>
            <div className="flex flex-col gap-y-3 items-stretch mt-8 sm:flex-row sm:gap-x-3 sm:gap-y-0 sm:justify-end">
                <Button
                    className="py-2"
                    onClick={openDialogHandler(DIALOG_TYPE.REGISTER_ROOM)}>
                    { lang.buttons.addNewProperty[language] }
                </Button>
            </div>
        </div>
    )
}

export default Rooms