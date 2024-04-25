import * as React from "react"
import Tab from "./components/tab"
import classNames from "classnames"

import styles from "./styles.module.css"

import PaymentMethods from "./components/payment-methods"

type ButtonProps = {
    children: React.ReactNode
}

const list = [
    {

        id: "PAYMENT",
        label: "Payment"
    },
    {
        id: "DEBT",
        label: "Debt"
    }
]

const PaymentPanel = () => {
    const [ tab, setTab ] = React.useState("PAYMENT");

    const changeTab = React.useCallback((value: string) => setTab(value), []);

    return (
        <div className={classNames(styles.root, `flex flex-col h-full`)}>
            <ul className="flex">
                {
                    list.map(item => (
                        <Tab 
                            key={item.id}
                            id={item.id}
                            changeTab={changeTab}
                            tab={tab}>
                            { item.label }
                        </Tab>
                    ))
                }
            </ul>
            {
                {
                    "PAYMENT": <PaymentMethods />
                }[tab]
            }
        </div>
    )
}

export default PaymentPanel