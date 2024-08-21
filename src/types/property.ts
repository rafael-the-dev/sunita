
import { AddressType } from "./user"
import { ROOM_TYPE } from "./room"
import { STATUS } from ".";

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
    status: STATUS;
    type: ROOM_TYPE
}

export type HouseType = {
    bedrooms: BedroomType[],
    bathrooms: number,
}

export type Property = {
    availability: AvailabilityType[],
    address: AddressType,
    amenities: string[], // e.g., ['Wi-Fi', 'Air Conditioning', 'Parking', 'Pool']
    description: string,
    house: HouseType,
    images: string[], // URLs to images of the property
    name: string,
    price: { 
        daily: string | Date, 
        hourly: string | Date, 
        night: string | Date, 
    },
    bedroom: BedroomType,
    size: number, // e.g., size in square meters
    type: PROPERTY_TYPE,
    owner: string,
}