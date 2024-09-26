import { useContext } from "react"

import { UserFormContext } from "../../context"

import Row from "../Row"
import Textfield from "@/components/Textfield"

const Address = () => {
    const {
        countryChangeHandler,
        cityChangeHandler,
        getAddress,
        numberChangeHandler,
        streetChangeHandler,
        statetChangeHandler,
        input
    } = useContext(UserFormContext)

    const address = getAddress()

    return (
        <div className="flex flex-col gap-y-4">
            <Row>
                <Textfield 
                    { ...address.country }
                    className="mb-0 w-full sm:w-1/2"
                    label="Counry"
                    onChange={countryChangeHandler}
                    placeholder="Insert first name"
                    required
                />
                <Textfield 
                    { ...address.province }
                    className="mb-0 w-full sm:w-1/2"
                    label="Province"
                    onChange={statetChangeHandler}
                    placeholder="Insert first name"
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
                    label="House number"
                    onChange={numberChangeHandler}
                    placeholder="Insert house number"
                    required
                    type="number"
                />
            </Row>
            <Row>
                <Textfield 
                    { ...address.street }
                    className="mb-0 w-full sm:w-1/2"
                    label="block"
                    multiline
                    minRows={4}
                    onChange={streetChangeHandler}
                    placeholder="Insert block name"
                    required
                />
            </Row>
        </div>
    )
}

export default Address