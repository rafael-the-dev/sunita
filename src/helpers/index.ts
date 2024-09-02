
export const isPublicRoute = (pathname: string) => {
    const publicPaths = [
        "/login",
        "/search/stores"
    ];

    const isPublicPath = publicPaths.includes(pathname);

    return isPublicPath
}

export const getList = (enumList: Object) => Object
    .values(enumList)
    .map(item => ({ label: item, value: item }));


export const getFullName = ({ firstName, lastName }: {firstName: string, lastName: string }) => `${firstName} ${lastName}` 