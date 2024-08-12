import { useContext } from "react"
import classNames from "classnames"
import moment from "moment"

import { ProductFormContext } from "../../context"

import Container from "../CategoryContainer"
import DateInput from "@/components/date"
import Row from "@/components/Form/RegisterUser/components/Row"
import TextField from "@/components/Textfield"

const ExpirableProductsContainer = () => {
    const {
        changeBarcode,
        changeExpirationDate,
        changeManufactureDate,
        input
    } = useContext(ProductFormContext)

    return (
        <Container 
            title="Expirable">
                <TextField
                    { ...input.expirable.barcode }
                    className={classNames("mb-6 w-full")}
                    placeholder="Barcode"
                    label="Barcode"
                    onChange={changeBarcode}
                />
            <Row>
                <DateInput
                    { ...input.expirable.manufactureDate }
                    className={classNames("mb-0 sm:w-1/2")}
                    date
                    label="Manufacture Date"
                    maxDate={moment(moment.now()).toISOString()}
                    onChange={changeManufactureDate}
                />
                <DateInput
                    { ...input.expirable.expirationDate }
                    className={classNames("mb-0 sm:w-1/2")}
                    date
                    label="Best Before"
                    minDate={input.expirable.manufactureDate.value}
                    onChange={changeExpirationDate}
                />
            </Row>
        </Container>
    )
}

export default ExpirableProductsContainer