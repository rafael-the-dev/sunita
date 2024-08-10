
import classNames from "classnames"

import Container from "../CategoryContainer"
import DateInput from "@/components/date"
import Label from "../Label"
import Row from "@/components/Form/RegisterUser/components/Row"
import TextField from "@/components/Textfield"

const CarDetailsContainer = () => {

    return (
        <Container 
            className="gap-y-4"
            title="Car details">
            <Row>
                <TextField 
                    className="mb-0 w-full sm:w-1/2"
                    label="Model"
                />
                <TextField 
                    className="mb-0 w-full sm:w-1/2"
                    label="Make"
                />
            </Row>
            <Row>
                <TextField 
                    className="mb-0 w-full sm:w-1/2"
                    label="Transmission"
                />
                <TextField 
                    className="mb-0 w-full sm:w-1/2"
                    label="Year"
                />
            </Row>
            <div>
                <Label>Engine</Label>
                <Row>
                    <TextField 
                        className="mb-0 w-full sm:w-1/2"
                        label="Year"
                    />
                    <TextField 
                        className="mb-0 w-full sm:w-1/2"
                        label="Year"
                    />
                </Row>
            </div>
        </Container>
    )
}

export default CarDetailsContainer