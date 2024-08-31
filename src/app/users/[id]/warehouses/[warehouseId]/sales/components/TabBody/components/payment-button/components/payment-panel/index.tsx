import * as React from "react"
import Tab from "./components/tab"
import classNames from "classnames"

import styles from "./styles.module.css"

import { getList } from "@/helpers"

import Debt from "./components/Debt"
import PaymentMethods from "./components/payment-methods";
import SuccessfulPayment from "./components/successful-payment";//:;

enum TABS {
    PAYMENT = "payment",
    DEBT = "debt",
    SUCCESSFULL_PAYMENT = "successfull-payment"
}

type PropsType = {
    closeDialog: () => void
}

const list = getList(TABS)
    .filter(tab => tab.value !== TABS.SUCCESSFULL_PAYMENT);

const PaymentPanel = ({ closeDialog }: PropsType) => {
    const [ tab, setTab ] = React.useState(TABS.PAYMENT);

    const changeTab = React.useCallback((value: TABS) => {
        setTab(currentTab => {
            if(currentTab === TABS.SUCCESSFULL_PAYMENT) return currentTab;

            return value;
        })
    }, []);

    const setSuccefulPayment = React.useCallback(() => setTab(TABS.SUCCESSFULL_PAYMENT), []);

    return (
        <div className={classNames(styles.root, `flex flex-col h-full`)}>
            <ul className="flex">
                {
                    list.map(item => (
                        <Tab 
                            key={item.value}
                            id={item.value}
                            changeTab={changeTab}
                            tab={tab}>
                            { item.label }
                        </Tab>
                    ))
                }
            </ul>
            {
                {
                    [TABS.DEBT]: <Debt />,
                    [TABS.PAYMENT]: <PaymentMethods setSuccefulPayment={setSuccefulPayment} />,
                    [TABS.SUCCESSFULL_PAYMENT]: <SuccessfulPayment onClose={closeDialog} />
                }[tab]
            }
        </div>
    );
};

export default PaymentPanel;