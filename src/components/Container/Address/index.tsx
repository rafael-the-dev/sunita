import { useContext } from "react"
import dynamic from "next/dynamic"

import { AddressInputType, AddressEventHandlers } from "@/hooks/useAddress/types"
import {COUNTRIES} from "@/types/address"

import lang from "@/lang/address.json"

import { getList } from "@/helpers"

import useLanguage from "@/hooks/useLanguage"

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

    const { language } = useLanguage()

    const address = getAddress()

    return (
        <div className="flex flex-col gap-y-4">
            <Row>
                <Select 
                    { ...address.country }
                    className="mb-0 w-full sm:w-1/2"
                    label={ lang["country"]["label"][language] }
                    list={countriesList}
                    onChange={countryChangeHandler}
                />
                <Textfield 
                    { ...address.state }
                    className="mb-0 w-full sm:w-1/2"
                    label={ lang["state"]["label"][language]}
                    onChange={statetChangeHandler}
                    placeholder={ lang["state"]["placeholder"][language]}
                    required
                />
            </Row>
            <Row>
                <Textfield 
                    { ...address.city }
                    className="mb-0 w-full sm:w-1/2"
                    label={ lang["city"]["label"][language] }
                    onChange={cityChangeHandler}
                    placeholder={ lang["city"]["placeholder"][language] }
                    required
                />
                <Textfield 
                    { ...address.number }
                    className="mb-0 w-full sm:w-1/2"
                    label={ lang["number"]["label"][language] }
                    onChange={numberChangeHandler}
                    placeholder={ lang["number"]["placeholder"][language] }
                    required
                    type="number"
                />
            </Row>
            <Textfield 
                { ...address.street }
                className="mb-0 w-full"
                fullWidth
                label={ lang["street"]["label"][language] }
                multiline
                minRows={4}
                onChange={streetChangeHandler}
                placeholder={ lang["street"]["placeholder"][language] }
                required
            />
            { hasCords && onLocationFound && <MapContainer onLocationFound={onLocationFound}/> }
        </div>
    )
}

export default Address