
import { Scheduler, SchedulerTypes } from "devextreme-react/scheduler"

import { BookingInfoType } from "@/types/booking"

type PropsType = {
    list: BookingInfoType[],
    onAppointmentClick?: (e: SchedulerTypes.AppointmentClickEvent) => void//::
}

const SchedulerContainer = ({ list, onAppointmentClick }: PropsType) => {

    return (
        <Scheduler
            allDayExpr="dayLong"
            dataSource={list}
            currentView="week"
            descriptionExpr="price.hour"
            endDateExpr="checkOut"
            onAppointmentClick={onAppointmentClick}
            recurrenceRuleExpr="recurrence"
            startDateExpr="checkIn"
            textExpr="name">
        </Scheduler>
    )
}

export default SchedulerContainer