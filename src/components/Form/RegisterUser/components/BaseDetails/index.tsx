import { ChangeEvent, useCallback, useContext, useMemo } from "react"

import { USER_CATEGORY } from "@/types/user"

import { UserFormContext } from "../../context"

import Row from "../Row"
import Select from "@/components/shared/combobox"
import Textfield from "@/components/Textfield"


const BaseDetails = () => {
    const {
        changeName, changePostition, changeUsername,
        input,
    } = useContext(UserFormContext)

    const usersPositions = useMemo(
        () => Object
            .values(USER_CATEGORY)
            .map(value => ({ label: value, value })),
        []
    );

    const usersPositionsChangeHandler = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => changePostition(e.target.value as USER_CATEGORY),
        [ changePostition ]
    );

    return (
        <div className="flex flex-col gap-y-4">
            <Row>
                <Textfield 
                    { ...input.firstName }
                    className="mb-0 w-full sm:w-1/2"
                    label="First name"
                    onChange={changeName("firstName")}
                    placeholder="Insert first name"
                    required
                />
                <Textfield 
                    { ...input.lastName }
                    className="mb-0 w-full sm:w-1/2"
                    label="Last name"
                    onChange={changeName("lastName")}
                    placeholder="Insert last name"
                    required
                />
            </Row>
            <Row>
                <Textfield 
                    { ...input.username }
                    className="mb-0 w-full sm:w-1/2"
                    label="Username"
                    onChange={changeUsername}
                    placeholder="Example: rafael_tivane"
                    required
                />
                <Select 
                    { ...input.position }
                    className="mb-0 w-full sm:w-1/2"
                    list={usersPositions}
                    label="Position"
                    onChange={usersPositionsChangeHandler}
                />
            </Row>
        </div>
    )
}

export default BaseDetails