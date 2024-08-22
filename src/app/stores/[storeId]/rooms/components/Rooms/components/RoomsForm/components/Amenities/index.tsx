
import Chip from "@mui/material/Chip"

import InsertInput from "@/components/Input/InsertInput"
import Legend from "@/components/shared/Legend"

type PropsType = {
    list: string[];
    onInsert: (amenity: string) => void;
    onRemove: (amenity: string) => void;
}

const Amenities = ({ list, onInsert, onRemove }: PropsType) => {

    const deleteHandler = (amenity: string) => () => onRemove(amenity);

    return (
        <fieldset>
            <Legend>
                Amenities
            </Legend>
            <InsertInput onInsert={onInsert}/>
            <ul className="flex flex-wrap gap-x-3 mt-3">
                {
                    list
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