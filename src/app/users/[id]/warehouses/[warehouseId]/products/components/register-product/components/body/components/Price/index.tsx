
import Container from "../CategoryContainer"
import Row from "@/components/Form/RegisterUser/components/Row"
import TextField from "@/components/Textfield"

const Price = () => {

    return (
        <Container
            className="!mt-4"
            title="Price">
            <Row>
                <TextField
                    className="mb-0 w-full sm:w-1/2"
                    name="purchase-price-input"
                    placeholder="Purchase price"
                    label="Purchase price"
                    required
                />
                <TextField
                    className="mb-0 w-full sm:w-1/2"
                    name="sell-price-input"
                    placeholder="Sell price"
                    label="Sell price"
                    required
                />
            </Row>
        </Container>
    )
}

export default Price