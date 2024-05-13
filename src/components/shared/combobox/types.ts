import { ChangeEventFunc } from "@/types/events";


export type PropsType = {
    className?: string;
    label?: string;
    list: { 
        value: string | number ; 
        label: string | number ; 
    }[];
    onChange: ChangeEventFunc<HTMLInputElement>;
    value: string | number;
}