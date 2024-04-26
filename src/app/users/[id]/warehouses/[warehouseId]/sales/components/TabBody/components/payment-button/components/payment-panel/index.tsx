import * as React from "react"
import Tab from "./components/tab"
import classNames from "classnames"

import styles from "./styles.module.css"

import PaymentMethods from "./components/payment-methods";
import SuccessfulPayment from "./components/successful-payment";//:;

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
];

const PaymentPanel = ({ closeDialog }: { closeDialog: () => void }) => {
    const [ tab, setTab ] = React.useState("PAYMENT");

    const changeTab = React.useCallback((value: string) => {
        setTab(currentTab => {
            if(currentTab === "SUCCESS_PAYMENT") return currentTab;

            return value;
        })
    }, []);
    const setSuccefulPayment = React.useCallback(() => setTab("SUCCESS_PAYMENT"), []);

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
                    "PAYMENT": <PaymentMethods setSuccefulPayment={setSuccefulPayment} />,
                    "SUCCESS_PAYMENT": <SuccessfulPayment onClose={closeDialog} />
                }[tab]
            }
        </div>
    );
};

export default PaymentPanel;