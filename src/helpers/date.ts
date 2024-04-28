import { SaleInfoType } from "@/types/sale";
import moment from "moment";

export const formatDate = (dateParam: Date | number | moment.Moment ) => moment(dateParam).format("DD/MM/YYYY");

export const formatDates = (list: SaleInfoType[]) => {
    if(list.length === 0) return formatDate(Date.now());

    if(list.length > 1) {
        const firstDate = formatDate(list[0].createdAt);
        const lastDate = formatDate(list[list.length - 1].createdAt);

        if(firstDate === lastDate) {
            if(firstDate === formatDate(Date.now())) return `Today  -  ${firstDate}`;

            return firstDate;
        }

        return `${firstDate} - ${lastDate}`;
    } else {
        const date = formatDate(new Date(list[0]?.createdAt));

        if(date === formatDate(Date.now())) return `Today  -  ${date}`;

        return date;
    }
};

export const resetTime = (dateTime: moment.Moment) => {
    dateTime.hours(0);
    dateTime.minutes(0);
    dateTime.seconds(0);
    dateTime.milliseconds(0);
};

export const resetDate = ({ endDate, startDate }) => {
    const firstDate = startDate ?? Date.now();
    const from = moment(firstDate)
    const to = moment(endDate ? ( startDate ? endDate : Date.now() ) : firstDate)

    resetTime(from);

    resetTime(to);
    to.add(1, 'days');
    
    return {
        "date": { $gte: from.toISOString(), $lt: to.toISOString() }
    };
};