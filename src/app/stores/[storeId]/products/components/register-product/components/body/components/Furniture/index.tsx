import { useContext } from "react"
import classNames from "classnames"

import { ProductFormContext } from "../../context"

import Container from "../CategoryContainer"
import Label from "../Label"
import Row from "@/components/Form/RegisterUser/components/Row"
import TextField from "@/components/Textfield"

const FurnitureDetailsContainer = () => {
    const { 
        input,
        changeDimensions,
        changeMaterial
    } = useContext(ProductFormContext)

    return (
        <Container 
            className="gap-y-4"
            title="Furniture details">
            <TextField 
                { ...input.furnicture.material }
                className="mb-0 w-full"
                label="Material"
                onChange={changeMaterial}
            />
            <div>
                <Label>Dimensions</Label>
                <Row>
                    <TextField 
                        { ...input.furnicture.dimensions.length }
                        className="mb-0 w-full sm:w-1/3"
                        label="Length"
                        onChange={changeDimensions("length")}
                    />
                    <TextField 
                        { ...input.furnicture.dimensions.width }
                        className="mb-0 w-full sm:w-1/3"
                        label="Width"
                        onChange={changeDimensions("width")}
                    />
                    <TextField 
                        { ...input.furnicture.dimensions.height }
                        className="mb-0 w-full sm:w-1/3"
                        label="Height"
                        onChange={changeDimensions("height")}
                    />
                </Row>
            </div>
        </Container>
    )
}

export default FurnitureDetailsContainer