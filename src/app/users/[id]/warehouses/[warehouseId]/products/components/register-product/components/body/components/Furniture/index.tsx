
import classNames from "classnames"

import Container from "../CategoryContainer"
import Label from "../Label"
import Row from "@/components/Form/RegisterUser/components/Row"
import TextField from "@/components/Textfield"

const FurnitureDetailsContainer = () => {

    return (
        <Container 
            className="gap-y-4"
            title="Furniture details">
            <TextField 
                className="mb-0 w-full"
                label="Material"
            />
            <div>
                <Label>Dimensions</Label>
                <Row>
                    <TextField 
                        className="mb-0 w-full sm:w-1/3"
                        label="Height"
                    />
                    <TextField 
                        className="mb-0 w-full sm:w-1/3"
                        label="Length"
                    />
                    <TextField 
                        className="mb-0 w-full sm:w-1/3"
                        label="Width"
                    />
                </Row>
            </div>
        </Container>
    )
}

export default FurnitureDetailsContainer