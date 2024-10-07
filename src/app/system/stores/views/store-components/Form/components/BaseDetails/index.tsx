import { useContext } from "react"
import classNames from "classnames"

import { STATUS } from "@/types";

import { FormContext } from "../../context"
import { FixedTabsContext as StaticTabsContext } from "@/context/FixedTabsContext";

import Address from "@/components/Container/Address"
import Contact from "@/components/Container/Contact"
import Legend from "@/components/shared/Legend"
import Row from "@/components/Form/RegisterUser/components/Row"
import Select from "@/components/shared/combobox"
import Textfield from "@/components/Textfield"

const statusList = [
    {
        label: "Active",
        value: STATUS.ACTIVE
    },
    {
        label: "Inactive",
        value: STATUS.INACTIVE
    }
]

const BaseDetails = () => {
    const { 
        address,
        contact, 
        name,
        status,
        nameChangeHandler,
        statusChangeHandler
    } = useContext(FormContext)

    const { getDialog } = useContext(StaticTabsContext);

    const storeDetails = getDialog().current?.payload;
    const hasPayload = Boolean(storeDetails);

    return (
        <div className="flex flex-col items-stretch grow gap-y-4">
            <Row>
                <Textfield 
                    { ...name }
                    className={classNames("mb-0 w-full", { "sm:w-1/2": hasPayload})}
                    label="Name"
                    onChange={nameChangeHandler}
                    placeholder="Inset store name"
                />
                {
                    hasPayload && (
                        <Select 
                            className="mb-0 w-full sm:w-1/2"
                            list={statusList}
                            label="Status"
                            onChange={statusChangeHandler}
                            value={status}
                        />
                    )
                }
            </Row>
            <fieldset className="flex flex-col gap-y-4 mt-6">
                <Legend
                    className="mb-6">
                    Contact
                </Legend>
                <div className="flex flex-col gap-y-4">
                    <Contact 
                        contact={contact.getContact()}
                        onAddContact={contact.addPhoneNumber}
                        onChange={contact.changePhone}
                        onRemove={contact.removePhoneNumber}
                    />
                </div>
            </fieldset>
            <fieldset className="flex flex-col gap-y-4 mt-6">
                <Legend
                    className="mb-6">
                    Address
                </Legend>
                <Address { ...address } hasCords onLocationFound={address.setCords} />
            </fieldset>
        </div>
    )
}

export default BaseDetails