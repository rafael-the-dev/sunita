import { NextRequest } from "next/server"

export const isPublicPath = (req: NextRequest) => {
    //replace domain and query params
    const pathname = req
        .url
        .replace("http://localhost:3000/api", "")
        .replace( /\?[A-Za-z0-9&.+-=]*/g,"");

    const publicResources = [
        {
            methods: [ "POST" ],
            path: "/auth/login"

        },
        {
            methods: [ "GET" ],
            path: "/auth/refresh"

        },
        {
            methods: [ "GET" ],
            path: "/stores/properties"

        }
    ]

    const resource = publicResources.find(
        ({ methods, path }) => {
            return (path === pathname) && (methods.includes(req.method))
        }
    )
    
    return Boolean(resource)
}