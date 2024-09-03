import { useContext } from "react"

import { ProductFormContext } from "../../context"

import Container from "../CategoryContainer"
import Row from "@/components/Form/RegisterUser/components/Row"
import TextField from "@/components/Textfield"

const Price = () => {
    const {
        changePrice,
        input
    } = useContext(ProductFormContext)

    return (
        <Container
            className="!mt-4"
            title="Price">
            <Row>
                <TextField
                    { ...input.price.purchase }
                    className="mb-0 w-full sm:w-1/2"
                    name="purchase-price-input"
                    placeholder="Purchase price"
                    label="Purchase price"
                    onChange={changePrice("purchase")}
                    required
                />
                <TextField
                    { ...input.price.sell }
                    className="mb-0 w-full sm:w-1/2"
                    name="sell-price-input"
                    placeholder="Sell price"
                    label="Sell price"
                    onChange={changePrice("sell")}
                    required
                />
            </Row>
        </Container>
    )
}

export default Price