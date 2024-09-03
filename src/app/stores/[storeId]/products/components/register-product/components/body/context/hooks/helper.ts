import { defaultInputField } from "@/config/input";


export const hasError = (obj: typeof defaultInputField) => obj.error || !obj.value