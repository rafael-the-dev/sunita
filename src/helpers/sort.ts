

export const sort = <T extends { createdAt: string | Date } >(list: T[], key="createdAt") => {
    list.sort((a, b) => {
        return new Date(b[key]).getTime() - new Date(a[key]).getTime();
    });
}