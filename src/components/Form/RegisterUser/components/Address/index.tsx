import { useContext } from "react"

import { UserFormContext } from "../../context"

import Row from "../Row"
import Textfield from "@/components/Textfield"

const Address = () => {
    const {
        changeAddress,
        changeHouseNumber,
        input
    } = useContext(UserFormContext)

    return (
        <div className="flex flex-col gap-y-4">
            <Row>
                <Textfield 
                    { ...input.address.country }
                    className="mb-0 w-full sm:w-1/2"
                    label="Counry"
                    onChange={changeAddress("country")}
                    placeholder="Insert first name"
                    required
                />
                <Textfield 
                    { ...input.address.province }
                    className="mb-0 w-full sm:w-1/2"
                    label="Province"
                    onChange={changeAddress("province")}
                    placeholder="Insert first name"
                    required
                />
            </Row>
            <Row>
                <Textfield 
                    { ...input.address.city }
                    className="mb-0 w-full sm:w-1/2"
                    label="City"
                    onChange={changeAddress("city")}
                    placeholder="Insert city name"
                    required
                />
                <Textfield 
                    { ...input.address.block }
                    className="mb-0 w-full sm:w-1/2"
                    label="block"
                    onChange={changeAddress("block")}
                    placeholder="Insert block name"
                    required
                />
            </Row>
            <Row>
                <Textfield 
                    { ...input.address.house }
                    className="mb-0 w-full sm:w-1/2"
                    label="House number"
                    onChange={changeHouseNumber}
                    placeholder="Insert house number"
                    required
                    type="number"
                />
            </Row>
        </div>
    )
}

export default Address