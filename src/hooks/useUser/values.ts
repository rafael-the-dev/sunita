
import { defaultInputField } from "@/config/input"

export const defaultUserInput = {
    firstName: structuredClone(defaultInputField),
    lastName: structuredClone(defaultInputField),
    username: structuredClone(defaultInputField),
}