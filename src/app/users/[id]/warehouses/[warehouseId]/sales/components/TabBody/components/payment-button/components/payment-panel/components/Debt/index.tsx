import * as React from "react"

import { CustomerInfoType } from "@/types/guest"

import ClientsTable from "@/components/shared/table/ClientsTable"
import SearchInput from "./components/Searchfield"

type DebtType = {
    customer: CustomerInfoType
}

const Debts = () => {
    const [ debt, setDebt ] = React.useState<DebtType>(
        {
            customer: null 
        }
    )

    const addCustomer = React.useCallback(
        (customer: CustomerInfoType) => setDebt(debt => ({ ...debt, customer })),
        []
    )

    return (
        <div className="px-2 pt-4">
            <div>
                <SearchInput addCustomer={addCustomer}/>
                <ClientsTable 
                    data={ debt.customer ? [ debt.customer ] : []}
                />
            </div>
        </div>
    )
}

export default Debts