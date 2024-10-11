
import classNames from "classnames";
import Chip from "@mui/material/Chip"

import { AMENITIES } from "@/types/property";
import { LANGUAGE } from "@/types/language"

import { getList } from "@/helpers";

import useLanguage from "@/hooks/useLanguage"

import InsertInput from "@/components/Input/InsertInput"
import Legend from "@/components/shared/Legend"

type PropsType = {
    list: string[];
    onInsert: (amenity: string) => void;
    onRemove: (amenity: string) => void;
}

const amenitiesList = getList(AMENITIES)
const amenitiesListClone = structuredClone(amenitiesList)

const lang = {
    amenities: {
        [LANGUAGE.ENGLISH]: "Amenities",
        [LANGUAGE.PORTUGUESE]: "Comodidades"
    },
    placeholder: {
        [LANGUAGE.ENGLISH]: "Insert amenity",
        [LANGUAGE.PORTUGUESE]: "Insere Comodidade"
    }
}

const Amenities = ({ list, onInsert, onRemove }: PropsType) => {
    const { language } = useLanguage()

    const deleteHandler = (amenity: string) => () => onRemove(amenity);

    const getSuggestionList = () => {
        const mappedList = list
            .map(amenity => ({ label: amenity, value: amenity }))
            .filter(amenity => amenitiesList.find(item => item.value !== amenity))

        return amenitiesList
            .map(item => ({
                isSelected: list.includes(item.value),
                label: item.value
            }))
    }

    const getSelectedAmenitiesList = () => {
        return list
            .filter(amenity => !Boolean(amenitiesList.find(item => item.value === amenity)))
    }

    const clickHandler = (item: string, isSelected: boolean) => () => isSelected ? onRemove(item) : onInsert(item)

    return (
        <fieldset>
            <Legend>
                { lang.amenities[language] }
            </Legend>
            <InsertInput 
                onInsert={onInsert}
                placeholder={lang.placeholder[language]}
            />
            <ul className="flex flex-wrap gap-x-3 mt-3">
                {
                    getSuggestionList()
                        .map(({ isSelected, label }) => (
                            <button
                                className={classNames(
                                    isSelected ? "bg-gray-200 border-gray-300" : "bg-white ",
                                    `border-gray-200 cursor-pointer outline-none px-2.5 py-1 rounded-full shadow-none text-black`
                                )}
                                key={label}
                                onClick={clickHandler(label, isSelected)}
                                type="button">
                                { label }
                            </button>
                        ))
                }
                {
                    getSelectedAmenitiesList()
                        .map(amenity => (
                            <Chip 
                                key={amenity}
                                label={amenity} 
                                onDelete={deleteHandler(amenity)}
                            />
                        )
                    )
                }
            </ul>
        </fieldset>
    )
}

export default Amenities