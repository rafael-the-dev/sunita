
import { AddressType } from "./user"
import { ROOM_TYPE } from "./room"
import { STATUS } from ".";

export enum AMENITIES {
    BAR = "bar",
    GYM = "gym",
    POLL = "poll",
    PARKING = "parking",
    TV = "tv",
    WI_FI = "wi-fi"
}

export enum PROPERTY_TYPE {
    APARTMENT = "apartment",
    BED_ROOM = "bed-room",
    HOUSE = "house",
    OFICE = "office",
    STUDIO = "studio",
    WORKPLACE = "workplace",
}

export type AvailabilityType = {
    endDate: string | Date,
    startDate: string | Date
}

export type BedroomType = {
    quantity: number,
    type: ROOM_TYPE
}

export type HouseType = {
    bedrooms: BedroomType[],
    bathrooms: number,
}

export type PriceType = { 
    daily: number, 
    hourly: number, 
    night: number, 
}

export type PropertyType = {
    availability: AvailabilityType[],
    address: AddressType,
    amenities: string[], // e.g., ['Wi-Fi', 'Air Conditioning', 'Parking', 'Pool']
    description: string,
    house: HouseType,
    id: string,
    images: string[], // URLs to images of the property
    name: string,
    price: PriceType,
    bedroom: BedroomType,
    status: STATUS,
    //size: number, // e.g., size in square meters
    type: PROPERTY_TYPE,
    owner: string,
}