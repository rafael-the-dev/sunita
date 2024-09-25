import { useContext } from "react"
import dynamic from "next/dynamic"

import { AddressInputType, AddressEventHandlers } from "@/hooks/useAddress/types"
import {COUNTRIES} from "@/types/address"

import { getList } from "@/helpers"

import Row from "@/components/Form/RegisterUser/components/Row"
import Select from "@/components/shared/combobox"
import Textfield from "@/components/Textfield"

const MapContainer = dynamic(
    () => import("./components/Map"),
    { ssr: false }
)

const countriesList = getList(COUNTRIES)

type PropsType = AddressEventHandlers & {
    getAddress: () => AddressInputType,
    hasCords?: boolean,
    onLocationFound?: (lat: number, long: number) => void
}

const Address = (props: PropsType) => {
    const { 
        getAddress, 
        hasCords, 
        countryChangeHandler, cityChangeHandler, 
        numberChangeHandler, 
        onLocationFound,
        statetChangeHandler, streetChangeHandler 
    } = props

    const address = getAddress()

    return (
        <div className="flex flex-col gap-y-4">
            <Row>
                <Select 
                    { ...address.country }
                    className="mb-0 w-full sm:w-1/2"
                    label="Country"
                    list={countriesList}
                    onChange={countryChangeHandler}
                />
                <Textfield 
                    { ...address.state }
                    className="mb-0 w-full sm:w-1/2"
                    label="State/Province"
                    onChange={statetChangeHandler}
                    placeholder="Insert state name"
                    required
                />
            </Row>
            <Row>
                <Textfield 
                    { ...address.city }
                    className="mb-0 w-full sm:w-1/2"
                    label="City"
                    onChange={cityChangeHandler}
                    placeholder="Insert city name"
                    required
                />
                <Textfield 
                    { ...address.number }
                    className="mb-0 w-full sm:w-1/2"
                    label="Property number"
                    onChange={numberChangeHandler}
                    placeholder="Insert property number"
                    required
                    type="number"
                />
            </Row>
            <Textfield 
                { ...address.street }
                className="mb-0 w-full"
                label="Street"
                multiline
                minRows={4}
                onChange={streetChangeHandler}
                placeholder="Insert street address"
                required
            />
            { hasCords && onLocationFound && <MapContainer onLocationFound={onLocationFound}/> }
        </div>
    )
}

export default Address