import * as React from "react";

import { SaleDetailsContext } from "@/context/SaleDetailsContext";
import { TableHeadersType } from "@/components/table/types";

import Select from "@/components/shared/combobox";
import Table from "@/components/shared/table";
import { PaymentMethodType } from "@/types/payment-method";
import { paymentMethodsList } from "@/config/payment-methods";

const PaymentMethods = () => {
    const {getSaleDetails } = React.useContext(SaleDetailsContext);
    const { paymentMethods } = getSaleDetails();

    const headers = React.useRef<TableHeadersType[]>([
        {
            label: "Via",
            getComponent: ({ item }) => {
                const paymentMethod = item as PaymentMethodType;
                return (
                    <Select 
                        className="mb-0"
                        list={paymentMethodsList}
                        onChange={() => {}}
                        value={ paymentMethod.id }
                    />
                )
            },
            key: {
                value: ""
            }
        },,
        {
            label: "Reference",
            key: {
                value: "amount"
            }
        },
        {
            label: "Amount",
            key: {
                value: "amount"
            }
        }
    ]);

    return (
        <div>
            <div>
                <Table 
                    data={paymentMethods}
                    headers={headers}
                />
            </div>
        </div>
    )
};

export default PaymentMethods;