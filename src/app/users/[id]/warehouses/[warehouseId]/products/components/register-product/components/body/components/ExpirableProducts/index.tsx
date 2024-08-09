
import classNames from "classnames"

import Collapse from "../Collapse"
import Container from "../CategoryContainer"
import DateInput from "@/components/date"
import Row from "@/components/Form/RegisterUser/components/Row"
import TextField from "@/components/Textfield"

const ExpirableProductsContainer = () => {
    return (
        <Container 
            title="Expirable">
                <TextField
                    className={classNames("mb-6 w-full")}
                    name="barcode-input"
                    placeholder="Barcode"
                    label="Barcode"
                />
            <Row>
                <DateInput
                    className={classNames("mb-0 sm:w-1/2")}
                    date
                    label="Manufacture Date"
                    onChange={() => {}}
                    value={new Date(Date.now()).toISOString()}
                />
                <DateInput
                    className={classNames("mb-0 sm:w-1/2")}
                    date
                    label="Best Before"
                    onChange={() => {}}
                    value={new Date(Date.now()).toISOString()}
                />
            </Row>
        </Container>
    )
}

export default ExpirableProductsContainer