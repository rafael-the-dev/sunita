import { NextRequest, NextResponse } from "next/server"

import { PHONE_TYPE } from "@/types/contact"
import { BaseStore, STORE_AMENITIES, StoresResponse } from "@/types/warehouse"
import { STATUS } from "@/types"

import { getId } from "@/helpers/id"

export const GET = (req: NextRequest) => {
    const response: StoresResponse<BaseStore[]> = {
        list: [
            {
                address: {
                    country: "Mozambique",
                    city: "Matola",
                    cords: {
                        lat: 223,
                        long: 12
                    },
                    province: "Maputo",
                    street: "Rua do complexo, 224"
                },
                amenities: [ STORE_AMENITIES.BAR, STORE_AMENITIES.WI_FI ],
                contact: {
                    email: "",
                    phone: [
                        {
                            number: "861646933",
                           type: PHONE_TYPE.MAIN
                        }
                    ]
                },
                description: "Lorem ispusm lor sid lorem orem efvan dsi",
                id: getId(),
                name: "Complexo Mutumbela",
                rooms: [],
                status: STATUS.ACTIVE
            },
            {
                address: {
                    country: "Mozambique",
                    city: "Matola",
                    cords: {
                        lat: 223,
                        long: 12
                    },
                    province: "Maputo",
                    street: "Rua do complexo, 224"
                },
                amenities: [ STORE_AMENITIES.BAR, STORE_AMENITIES.WI_FI ],
                contact: {
                    email: "",
                    phone: [
                        {
                            number: "861646933",
                           type: PHONE_TYPE.MAIN
                        }
                    ]
                },
                description: "Lorem ispusm lor sid lorem orem efvan dsi",
                id: getId(),
                name: "Complexo Mutumbela",
                rooms: [],
                status: STATUS.ACTIVE
            },
            {
                address: {
                    country: "Mozambique",
                    city: "Matola",
                    cords: {
                        lat: 223,
                        long: 12
                    },
                    province: "Maputo",
                    street: "Rua do complexo, 224"
                },
                amenities: [ STORE_AMENITIES.BAR, STORE_AMENITIES.WI_FI ],
                contact: {
                    email: "",
                    phone: [
                        {
                            number: "861646933",
                           type: PHONE_TYPE.MAIN
                        }
                    ]
                },
                description: "Lorem ispusm lor sid lorem orem efvan dsi",
                id: getId(),
                name: "Complexo Mutumbela",
                rooms: [],
                status: STATUS.ACTIVE
            },
            {
                address: {
                    country: "Mozambique",
                    city: "Matola",
                    cords: {
                        lat: 223,
                        long: 12
                    },
                    province: "Maputo",
                    street: "Rua do complexo, 224"
                },
                amenities: [ STORE_AMENITIES.BAR, STORE_AMENITIES.WI_FI ],
                contact: {
                    email: "",
                    phone: [
                        {
                            number: "861646933",
                           type: PHONE_TYPE.MAIN
                        }
                    ]
                },
                description: "Lorem ispusm lor sid lorem orem efvan dsi",
                id: getId(),
                name: "Complexo Mutumbela",
                rooms: [],
                status: STATUS.ACTIVE
            },
            {
                address: {
                    country: "Mozambique",
                    city: "Matola",
                    cords: {
                        lat: 223,
                        long: 12
                    },
                    province: "Maputo",
                    street: "Rua do complexo, 224"
                },
                amenities: [ STORE_AMENITIES.BAR, STORE_AMENITIES.WI_FI ],
                contact: {
                    email: "",
                    phone: [
                        {
                            number: "861646933",
                           type: PHONE_TYPE.MAIN
                        }
                    ]
                },
                description: "Lorem ispusm lor sid lorem orem efvan dsi",
                id: getId(),
                name: "Complexo Mutumbela",
                rooms: [],
                status: STATUS.ACTIVE
            }
        ],
    }

    return NextResponse.json(response)
}
