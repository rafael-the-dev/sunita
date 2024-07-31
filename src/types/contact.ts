
export enum PHONE_TYPE {
    HOME = "home",
    MAIN = "main",
    WORK = "work"
}

export type PhoneType = {
    number: string,
    type: PHONE_TYPE
}

export type ContactType = {
    email?: string,
    facebook?: string;
    instagram?: string;
    phone: PhoneType[],
    twitter?: string,
    website?: string
}