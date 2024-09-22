import { ChangeEvent } from "react";

import { defaultUserInput } from "./values";

type ChangeHandlerType = (e: ChangeEvent<HTMLInputElement>) => void;

export type UserInputType = typeof defaultUserInput;

export type UserInputHandlers = {
    changeName: (key: "firstName" | "lastName") => ChangeHandlerType;
    changeUsername: ChangeHandlerType;
    getUserInput: () => UserInputType;
}