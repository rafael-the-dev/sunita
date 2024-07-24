import { NextResponse } from "next/server"

import { DecodedUserType, User, USER_CATEGORY } from "@/types/user"
import { CredentialsType,  } from "@/types/login"

import { decode, verifyToken } from "@/helpers/auth"

export const GET = (): NextResponse<CredentialsType> => {
    const client: User = {
        address: null,
        category: USER_CATEGORY.CLIENT,
        document: null,
        firstName: "",
        id: "",
        lastName: "",
        password: null,
        stores: [],
        username: ""
    }

    const token = decode(client)

    const { _id, exp, iat, ...userDetails } = verifyToken<DecodedUserType>(token)

    return NextResponse.json( 
        { 
            access: {
                expiresIn: exp,
                token 
            },
            user: userDetails
        }
    )
}