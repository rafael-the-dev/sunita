import { LATE_PAYMENT_FINE_PERIOD } from "."

export type SystemSettingsType = {
    fees: {
        subscription: {
            latePaymentFine: boolean,
            period: LATE_PAYMENT_FINE_PERIOD,
            tax: number
        }
    }
}