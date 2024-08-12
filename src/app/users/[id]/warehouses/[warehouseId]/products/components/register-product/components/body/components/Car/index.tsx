import { useContext, useMemo } from "react"
import classNames from "classnames"

import { CAR_ENGINE_TYPE, CAR_TRANSMISSION } from "@/types/product"

import { ProductFormContext } from "../../context"

import { getList } from "@/helpers"

import Container from "../CategoryContainer"
import DateInput from "@/components/date"
import Label from "../Label"
import Row from "@/components/Form/RegisterUser/components/Row"
import Select from "@/components/shared/combobox"
import TextField from "@/components/Textfield"

const engineTypes = getList(CAR_ENGINE_TYPE)
const transmissionList = getList(CAR_TRANSMISSION)

const CarDetailsContainer = () => {
    const {
        changeColor,
        changeEngineNumber, changeEngineType,
        changeMake, 
        changeModel,
        changeTransmission,
        changeYear,
        input,
    } = useContext(ProductFormContext)
    
    const engineType = input.car.engine.type.value
    const transmission = input.car.transmission.value

    const carEngineSelectMemo = useMemo(
        () => (
            <Select 
                className="mb-0 w-full sm:w-1/2"
                list={engineTypes}
                label="Type"
                onChange={changeEngineType}
                value={engineType}
            />
        ),
        [ changeEngineType, engineType ]
    )

    const carTransmissionMemo = useMemo(
        () => (
            <Select 
                className="mb-0 w-full sm:w-1/2"
                list={transmissionList}
                label="Transmission"
                onChange={changeTransmission}
                value={transmission}
            />
        ),
        [ changeTransmission, transmission ]
    )

    return (
        <Container 
            className="gap-y-4"
            title="Car details">
            <Row>
                <TextField 
                    { ...input.car.model }
                    className="mb-0 w-full sm:w-1/2"
                    label="Model"
                    onChange={changeModel}
                />
                <TextField 
                    { ...input.car.make }
                    className="mb-0 w-full sm:w-1/2"
                    label="Make"
                    onChange={changeMake}
                />
            </Row>
            <Row>
                { carTransmissionMemo }
                <TextField 
                    { ...input.car.year }
                    className="mb-0 w-full sm:w-1/2"
                    label="Year"
                    onChange={changeYear}
                />
            </Row>
            <Row>
                <TextField 
                    { ...input.color }
                    className="mb-0 w-full sm:w-1/2"
                    label="Color"
                    onChange={changeColor}
                />
            </Row>
            <div>
                <Label>Engine</Label>
                <Row>
                    { carEngineSelectMemo }
                    <TextField 
                        { ...input.car.engine.number}
                        className="mb-0 w-full sm:w-1/2"
                        label="Number"
                        onChange={changeEngineNumber}
                    />
                </Row>
            </div>
        </Container>
    )
}

export default CarDetailsContainer