import { useCallback, useMemo, useRef } from "react"
import Avatar from "@mui/material/Avatar"

import {LANGUAGE} from "@/types/language"
import { RoomType } from "@/types/room"
import { TableHeadersType } from "@/components/table/types"

import useLanguage from "@/hooks/useLanguage"

import Status from "@/components/shared/Status"
import Table from "@/components/shared/table"
import { PropertyType } from "@/types/property"

type PropsType = {
    data: PropertyType[],
    onClickTableRow: (row: RoomType) => () => void
}

const lang = {
    image: {
        [LANGUAGE.ENGLISH]: "Image",
        [LANGUAGE.PORTUGUESE]: "Imagem"
    },
    name: {
        [LANGUAGE.ENGLISH]: "Name",
        [LANGUAGE.PORTUGUESE]: "Nome"
    },
    type: {
        [LANGUAGE.ENGLISH]: "Type",
        [LANGUAGE.PORTUGUESE]: "tipo"
    },
    price: {
        hour: {
            [LANGUAGE.ENGLISH]: "Hourly price",
            [LANGUAGE.PORTUGUESE]: "Preço por hora"
        },
        night: {
            [LANGUAGE.ENGLISH]: "Price per night",
            [LANGUAGE.PORTUGUESE]: "Preço por noite"
        },
        day: {
            [LANGUAGE.ENGLISH]: "Daily Price",
            [LANGUAGE.PORTUGUESE]: "Preço por dia"
        }
    },
    status: {
        [LANGUAGE.ENGLISH]: "Status",
        [LANGUAGE.PORTUGUESE]: "Estado"
    },
    profit: {
        [LANGUAGE.ENGLISH]: "Profit",
        [LANGUAGE.PORTUGUESE]: "Lucros"
    },
    sales: {
        [LANGUAGE.ENGLISH]: "Sales",
        [LANGUAGE.PORTUGUESE]: "Vendas"
    },
}

const RoomsContainer = ({ data, onClickTableRow }: PropsType) => {
    const { language } = useLanguage()

    const tableHeaders = useMemo(
        () => (
            {
                current: [
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
                        label: lang.image[language],
                        key: {
                            value: "images"
                        }
                    },
                    {
                        label: lang.name[language],
                        key: {
                            value: "name"
                        }
                    },
                    {
                        label: lang.type[language],
                        key: {
                            value: "type"
                        }
                    },
                    {
                        label: lang.price.hour[language],
                        key: {
                            value: "price",
                            subKey: {
                                value: "hourly"
                            }
                        }
                    },
                    {
                        label: lang.price.day[language],
                        key: {
                            value: "price",
                            subKey: {
                                value: "daily"
                            }
                        }
                    },
                    {
                        label: lang.price.night[language],
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
                        label: lang.status[language],
                        key: {
                            value: "status"
                        }
                    },
                    
                ]
            }
        ),
        [ language ]
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