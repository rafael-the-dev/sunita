import * as React from "react"

import { StoresContext } from "../../context"

import { formatDates } from "@/helpers/date"

import Card from "@/components/shared/report-card"
import Filters from "./components/Filters"
import Table from "./components/Table"

const SubscriptionFees = () => {
    const { fees } = React.useContext(StoresContext);

    const feesRange = formatDates(fees?.data?.data?.list ?? []);
    const total = fees?.data?.data?.total ?? 0;

    return (
        <div className="flex flex-col items-stretch justify-between w-full">
            <div className="flex flex-col items-stretch">
                <div className="items-stretch mb-6 px-3 md:flex">
                    <Card>
                        <div>
                            <Card.Title>
                                <span className="text-base">Date</span><br/>
                                { feesRange  }
                            </Card.Title>
                        </div>
                        <div>
                            <Card.Description>
                                { total } MT
                            </Card.Description>
                        </div>
                    </Card>
                    <Filters />
                </div>
                <Table />
            </div>
        </div>
    )
}

export default SubscriptionFees