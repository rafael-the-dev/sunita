

export const sort = <T extends { createdAt: string | Date } >(list: T[]) => {
    list.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}