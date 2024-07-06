import { ChangeEvent } from "react";
import FormGroup from "@mui/material/FormGroup";

import { USER_CATEGORY } from "@/types/user";

import useSearchParams from "@/hooks/useSearchParams";

import Collapse from "@/components/shared/collapse";
import Checkbox from "@/components/checkbox";

const UserPosition = () => {
    const searchParams = useSearchParams();

    const position = searchParams.get("position", "")

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        if(value === position) searchParams.removeSearchParam("position");
        else searchParams.setSearchParam("position", e.target.value);
    }

    return (
        <Collapse
            title="Position">
            <FormGroup>
                {
                    Object
                        .entries(USER_CATEGORY)
                        .map(([ value, key ]) => (
                                <Checkbox 
                                    checked={key === position}
                                    label={key}
                                    onChange={changeHandler}
                                    key={key}
                                    value={key}
                                />
                            )
                        )
                }
            </FormGroup>
        </Collapse>
    );
}

export default UserPosition;