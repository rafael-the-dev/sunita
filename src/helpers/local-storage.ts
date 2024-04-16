
import { CredentialsType } from "@/types/login"

type LocalStorageType = {
    credentials: CredentialsType
};

const LOCAL_STORAGE = "__my-app__";

export const configLocalStorage = () => localStorage.setItem(LOCAL_STORAGE, JSON.stringify({}))

const get = (): LocalStorageType | null => JSON.parse(localStorage.getItem(LOCAL_STORAGE));

export const getItem = <T>(key: string): T => get()[key];

type SetItemPropsType<T> = {
    fn?: (prevValue: T) => T
    key: string,
    value: T
}

export const setItem = <T>({ fn, key, value }: SetItemPropsType<T>) => {
    const prevData = get();

    if(fn) {
        const prevValue = getItem<T>(key);

        value = fn(prevValue);
    }

    localStorage.setItem(LOCAL_STORAGE, JSON.stringify({ ...prevData, [key]: value}));
};