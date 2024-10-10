
import { CartType } from "@/types/cart";
import { CredentialsType } from "@/types/login"
import { LANGUAGE } from "@/types/language"
import { ProductInfoType } from "@/types/product";

type LocalStorageType = {
    credentials: CredentialsType;
    cart: CartType<ProductInfoType>;
    language: LANGUAGE;
};

const LOCAL_STORAGE = "__sunita-booking-app__";

export const configLocalStorage = () => {
    const defaultValues = {
        credentials: {
            access: {
                token: ""
            }
        },
        language: LANGUAGE.PORTUGUESE
    }

    localStorage.setItem(LOCAL_STORAGE, JSON.stringify(defaultValues))
}

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