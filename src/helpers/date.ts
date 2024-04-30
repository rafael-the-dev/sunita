import { SaleInfoType } from "@/types/sale";
import moment from "moment";

export type DateType = Date | string | number | moment.Moment;
export const dateFormat = "DD/MM/YYYY";
export const dateTimeFormat = "DD/MM/YYYY HH:mm A"

export const formatDate = (dateParam: DateType ) => moment(dateParam).format(dateFormat);

export const formatDates = (list: SaleInfoType[]) => {
    if(list.length === 0) return formatDate(Date.now());

    if(list.length > 1) {
        const startDate = formatDate(list[list.length - 1].createdAt);
        const endDate = formatDate(list[0].createdAt);

        if(startDate === endDate) {
            if(startDate === formatDate(Date.now())) return `Today  -  ${startDate}`;

            return startDate;
        }

        return `${startDate} - ${endDate}`;
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

export const toISOString = (date: DateType) => moment(date).toISOString();

export const resetDate = ({ endDate, startDate }: { endDate: DateType, startDate: DateType }) => {
    const firstDate = startDate ?? Date.now();
    const from = moment(firstDate);
    const to = moment(endDate ? ( startDate ? endDate : Date.now() ) : firstDate);
    
    return {
        "sales.createAt": { $gte: toISOString(from), $lt: toISOString(to) }
    };
};
