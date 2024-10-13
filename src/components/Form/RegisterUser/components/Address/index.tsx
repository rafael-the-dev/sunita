import { useContext } from "react"

import { UserFormContext } from "../../context"

import lang from "@/lang/address.json"

import useLanguage from "@/hooks/useLanguage"

import Row from "../Row"
import Textfield from "@/components/Textfield"

const Address = () => {
    const {
        address: {
            countryChangeHandler,
            cityChangeHandler,
            numberChangeHandler,
            streetChangeHandler,
            statetChangeHandler,
        },
        getAddress,
        input
    } = useContext(UserFormContext)

    const { language } = useLanguage()

    const address = getAddress()

    return (
        <div className="flex flex-col gap-y-4">
            <Row>
                <Textfield 
                    { ...address.country }
                    className="mb-0 w-full sm:w-1/2"
                    label={ lang["country"]["label"][language] }
                    onChange={countryChangeHandler}
                    required
                />
                <Textfield 
                    { ...address.province }
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
            <Row>
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
            </Row>
        </div>
    )
}

export default Address