
export enum COUNTRIES {
    MOZAMBIQUE = 'mozambique'
}

export type AddressType = {
    country: COUNTRIES,
    cords: {
        lat: number,
        long: number
    },
    city: string,
    number: number,
    state: string,
    street: string
}