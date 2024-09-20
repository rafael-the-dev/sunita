import { useContext } from "react"

import { AddressInputType, AddressEventHandlers } from "@/hooks/useAddress/types"

import Row from "@/components/Form/RegisterUser/components/Row"
import Textfield from "@/components/Textfield"

type PropsType = AddressEventHandlers & {
    getAddress: () => AddressInputType
}

const Address = ({ getAddress, countryChangeHandler, cityChangeHandler, numberChangeHandler, statetChangeHandler, streetChangeHandler }: PropsType) => {
    const address = getAddress()

    return (
        <div className="flex flex-col gap-y-4">
            <Row>
                <Textfield 
                    { ...address.country }
                    className="mb-0 w-full sm:w-1/2"
                    label="Counry"
                    onChange={countryChangeHandler}
                    placeholder="Insert country name"
                    required
                />
                <Textfield 
                    { ...address.province }
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
        </div>
    )
}

export default Address