import { ChangeEvent, useCallback, useContext, useMemo } from "react"

import { LANGUAGE } from "@/types/language"
import { USER_CATEGORY } from "@/types/user"

import { LoginContext } from "@/context/LoginContext"
import { UserFormContext } from "../../context"

import lang from "@/lang/user.json"

import useLanguage from "@/hooks/useLanguage"

import Contact from "@/components/Container/Contact"
import Legend from "@/components/shared/Legend"
import Row from "../Row"
import Select from "@/components/shared/combobox"
import Textfield from "@/components/Textfield"
import { getCategories } from "@/helpers/user"


const BaseDetails = () => {
    const { credentials } = useContext(LoginContext)

    const {
        contact: {
            addPhoneNumber,
            changePhone,
            removePhoneNumber
        },
        changeName, changePostition, changeUsername,
        getContact,
        input
    } = useContext(UserFormContext)

    const { language, translate } = useLanguage()

    const contact = getContact()

    const usersPositions = useMemo(
        () => getCategories(credentials?.user?.category)
            .map(item => ({ label: item, value: item }))
        ,
        [ credentials ]
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
                    label={ lang["firstName"]["label"][language] }
                    onChange={changeName("firstName")}
                    placeholder={ lang["firstName"]["placeholder"][language] }
                    required
                />
                <Textfield 
                    { ...input.lastName }
                    className="mb-0 w-full sm:w-1/2"
                    label={ lang["lastName"]["label"][language] }
                    onChange={changeName("lastName")}
                    placeholder={ lang["lastName"]["placeholder"][language] }
                    required
                />
            </Row>
            <Row>
                <Textfield 
                    { ...input.username }
                    className="mb-0 w-full sm:w-1/2"
                    label={ lang["username"]["label"][language] }
                    onChange={changeUsername}
                    placeholder={ lang["username"]["placeholder"][language] }
                    required
                />
                <Select 
                    { ...input.position }
                    className="mb-0 w-full sm:w-1/2"
                    list={usersPositions}
                    label={ lang["position"]["label"][language] }
                    onChange={usersPositionsChangeHandler}
                />
            </Row>
            <fieldset className="flex flex-col gap-y-4 mt-2">
                <Legend
                    className="mb-6">
                    {
                        translate(
                            {
                                [LANGUAGE.ENGLISH]: "Contact",
                                [LANGUAGE.PORTUGUESE]: "Contato"
                            }
                        )
                    }
                </Legend>
                <Contact
                    contact={contact}
                    //@ts-ignore
                    getAvailableTypes={contact.getAvailableTypes}
                    hasErrors={null}
                    onAddContact={addPhoneNumber}
                    onChange={changePhone}
                    onRemove={removePhoneNumber}
                    resetContact={null}
                />
            </fieldset>
        </div>
    )
}

export default BaseDetails