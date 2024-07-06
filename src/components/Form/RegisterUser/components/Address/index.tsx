import { useContext } from "react"

import { UserFormContext } from "../../context"

import Row from "../Row"
import Textfield from "@/components/Textfield"

const Address = () => {
    const {
        changeName,
        input
    } = useContext(UserFormContext)

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
                    { ...input.firstName }
                    className="mb-0 w-full sm:w-1/2"
                    label="First name"
                    onChange={changeName("firstName")}
                    placeholder="Insert first name"
                    required
                />
            </Row>
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
                    { ...input.firstName }
                    className="mb-0 w-full sm:w-1/2"
                    label="First name"
                    onChange={changeName("firstName")}
                    placeholder="Insert first name"
                    required
                />
            </Row>
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
                    { ...input.firstName }
                    className="mb-0 w-full sm:w-1/2"
                    label="First name"
                    onChange={changeName("firstName")}
                    placeholder="Insert first name"
                    required
                />
            </Row>
        </div>
    )
}

export default Address