import * as React from "react"
import classNames from "classnames"

import { CLOTH_CATEGORIES, CLOTH_GENDER, CLOTH_SEASON, CLOTH_STYLE } from "@/types/product"

import { getList, clothCategories, clothGenders, clothSeasons, clothStyles } from "@/helpers/cloth";

import Container from "../CategoryContainer";
import Select from "@/components/shared/combobox";
import DateInput from "@/components/date";
import Label from "../Label";
import Row from "@/components/Form/RegisterUser/components/Row";
import TextField from "@/components/Textfield";


const ClothDetailsContainer = () => {

    const categoriesMemo = React.useMemo(
        () => (
            <Select 
                className="mb-0 w-full sm:w-1/3"
                label="Category"
                list={clothCategories}
                onChange={() => {}}
                value={CLOTH_CATEGORIES.DRESS}
            />
        ),
        [ ]
    )

    const gendersMemo = React.useMemo(
        () => (
            <Select 
                className="mb-0 w-full sm:w-1/3"
                label="Gender"
                list={clothGenders}
                onChange={() => {}}
                value={CLOTH_GENDER.MALE}
            />
        ),
        [ ]
    )

    const seasonsMemo = React.useMemo(
        () => (
            <Select 
                className="mb-0 w-full sm:w-1/3"
                label="Season"
                list={clothSeasons}
                onChange={() => {}}
                value={CLOTH_SEASON.ALL}
            />
        ),
        [ ]
    )

    const stylesMemo = React.useMemo(
        () => (
            <Select 
                className="mb-0 w-full sm:w-1/3"
                label="Style"
                list={clothStyles}
                onChange={() => {}}
                value={CLOTH_STYLE.CASUAL}
            />
        ),
        [ ]
    )

    return (
        <Container 
            className="gap-y-4"
            title="Cloth details">
            <Row>
                <TextField 
                    className="mb-0 w-full sm:w-1/3"
                    label="Brand"
                />
                <TextField 
                    className="mb-0 w-full sm:w-1/3"
                    label="Barcode"
                />
                {
                    categoriesMemo
                }
            </Row>
            <Row>
                {
                    gendersMemo
                }
                {
                    stylesMemo
                }
                {
                    seasonsMemo
                }
            </Row>
            <Row>
                <TextField 
                    className="mb-0 w-full sm:w-1/3"
                    label="Color"
                />
                <TextField 
                    className="mb-0 w-full sm:w-1/3"
                    label="Size"
                />
                <TextField 
                    className="mb-0 w-full sm:w-1/3"
                    label="Material"
                />
            </Row>
        </Container>
    )
}

export default ClothDetailsContainer