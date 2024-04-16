import { UserType } from "./user"

export type CredentialsType = {
    access: {
        expiresIn: number
        token: string
    },
    user: UserType
}

export type LoginCredentialsType = {
    password: string,
    username: string
}

export type LoginType = {
    credentials: CredentialsType
};

