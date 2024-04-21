
export type UserType = {
    _id?: string,
    category: string,
    firstName: string,
    lastName: string,
    username: string,
    password?: string
}

export type DecodedUserType = UserType &  {
    exp: number,
    iat: number
}