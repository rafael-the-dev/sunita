import * as React from "react"
import moment from "moment"

import { CustomerInfoType } from "@/types/guest"
import { SaleDebtType } from "@/types/sale"

import { LoginContext } from "@/context/LoginContext"
import { SalesContext } from "@/context/SalesContext"
import { SaleContext } from "@/context/SalesContext/context/SaleContext"

import useFetch from "@/hooks/useFetch"

import Alert from "@/components/alert"
import Button from "@/components/shared/button"
import ClientsTable from "@/components/shared/table/ClientsTable"
import Checkbox from "@/components/checkbox"
import DateInput from "@/components/date"
import SearchInput from "./components/Searchfield"

type DebtType = {
    customer: CustomerInfoType,
    dueDate: string,
    latePaymentFine: boolean
}

type ProsType = {
    onSuccess: () => void;
}

const Debts = ({ onSuccess }: ProsType) => {
    const { credentials } = React.useContext(LoginContext)
    const { fetchProducts } = React.useContext(SalesContext);
    const { getCart, resetCart } = React.useContext(SaleContext)

    const [ debt, setDebt ] = React.useState<DebtType>(
        {
            customer: null,
            dueDate: moment(Date.now()).add("days", 7).toISOString(),
            latePaymentFine: false
        }
    )

    const { fetchData, loading } = useFetch(
        {
            autoFetch: false,
            url: `/api/stores/${credentials?.user?.stores[0].storeId}/sales/debts`
        }
    )

    const alertProps = React.useRef(
        {
            description: "",
            severity: "",
            title: ""
        }
    )
    const onCloseFuncRef = React.useRef<() => void | null>(null);
    const onOpenFuncRef = React.useRef<() => void | null>(null);

    const alertMemo = React.useMemo(() => (
        <Alert 
            { ...alertProps.current }
            className={`mx-2 mb-6 ${loading && ""}`}
            onClose={onCloseFuncRef}
            onOpen={onOpenFuncRef}
        />
    ), [ loading ]);

    const addCustomer = React.useCallback(
        (customer: CustomerInfoType) => setDebt(debt => ({ ...debt, customer })),
        []
    )

    const dateChangeHandler = React.useCallback(
        (dueDate: string) => setDebt(debt => ({ ...debt, dueDate })),
        []
    )

    const hasErrors = () => !debt.customer;

    const latePaymentFineChangeHandler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setDebt(debt => ({ ...debt, latePaymentFine: e.target.checked })),
        []
    )

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(loading || !debt.customer) return;

        const cart = getCart()

        const items = cart
            .items
            .map(item => ({ ...item, product: { id: item.product.id, price: item.product.sellPrice } }));

        const productsDebt: SaleDebtType = {
            changes: 0,
            createdAt: null,
            createdBy: null,
            customer: debt.customer.id,
            dueDate: debt.dueDate,
            id: null,
            items,
            latePaymentFine: debt.latePaymentFine,
            profit: 0,
            paymentMethods: [],
            remainingAmount: 0,
            total: cart.total,
            totalReceived: 0
        }

        const onSuccessFunc = onSuccess

        await fetchData(
            {
                options: {
                    body: JSON.stringify(productsDebt),
                    method: "POST"
                },
                onError(error) {
                    alertProps.current = {
                        description: error.message,
                        severity: "error",
                        title: "Error"
                    };

                    onOpenFuncRef.current?.();
                },
                async onSuccess() {
                    onSuccessFunc();
                    resetCart();
                    await fetchProducts({})
                },
            }
        )
    }

    return (
        <form 
            className="flex flex-col grow justify-between px-2 py-4"
            onSubmit={submitHandler}>
            <div>
                { alertMemo }
                <SearchInput addCustomer={addCustomer}/>
                <ClientsTable 
                    data={ debt.customer ? [ debt.customer ] : []}
                />
                <div className="mt-4">
                    <Checkbox 
                        checked={debt.latePaymentFine}
                        label="Late payment fine"
                        onChange={latePaymentFineChangeHandler}
                    />
                </div>
                <div className="mt-4">
                    <DateInput 
                        className="mb-0 w-full sm:w-1/2"
                        date
                        label="Due date"
                        minDate={moment(Date.now()).toISOString()}
                        onChange={dateChangeHandler}
                        value={debt.dueDate}
                    />
                </div>
            </div>
            <div className="flex flex-col items-stretch justify-end sm:flex-row">
                <Button
                    className="py-2"
                    disabled={hasErrors() || loading}
                    type="submit">
                    { loading ? "Loading..." : "Submit"}
                </Button>
            </div>
        </form>
    )
}

export default Debts