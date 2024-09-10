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
            path: "/auth/login",
            useRegExp: false,

        },
        {
            methods: [ "GET" ],
            path: "/auth/refresh",
            useRegExp: false,

        },
        {
            methods: [ "GET" ],
            path: "/stores/properties",
            useRegExp: false,

        },
        {
            methods: [ "GET" ],
            path: "^/stores/properties/[A-z0-9\-]+$",
            useRegExp: true,

        },
        {
            methods: [ "GET", "POST" ],
            path: "^/stores/[A-z0-9\-]+/properties/bookings$",
            useRegExp: true,
        }
    ]
   
    const resource = publicResources.find(
        ({ methods, path, useRegExp }) => {
            if(!methods.includes(req.method)) return false

            return useRegExp ? pathname.match(path) : (path === pathname)
        }
    )
    
    return Boolean(resource)
}