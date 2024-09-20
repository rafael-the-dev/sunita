import classNames from "classnames"
import Typography from "./components/Typography"

type PropsType = {
    className?: string,
    changes: number,
    remainingAmount: number,
    total: number,
    totalReceivedAmount: number
}

const PaymentCheckout = ({ className, changes, remainingAmount, total, totalReceivedAmount }: PropsType) => {
    const hasChanges = totalReceivedAmount > total
    const hasRemainingAmount = remainingAmount > 0

    return (
        <div className={classNames(className, "flex flex-col items-end mt-16 mb-3")}>
            <Typography 
                classes={{ root: "text-2xl md:text-3xl", value: "font-bold ml-3" }}
                text="Total"
                value={ total }
            />
            { 
                hasRemainingAmount && (
                    <Typography 
                        classes={{ root: "text-red-600 text-md md:text-xl", value: "font-semibold ml-3" }}
                        text="Mising"
                        value={ remainingAmount }
                    />         
                )
            }
            { 
                hasChanges && (
                    <Typography 
                        classes={{ root: "text-yellow-600 text-md md:text-xl", value: "font-semibold ml-3" }}
                        text="Changes"
                        value={ changes }
                    />         
                )
            }
        </div>
    )
}

export default PaymentCheckout