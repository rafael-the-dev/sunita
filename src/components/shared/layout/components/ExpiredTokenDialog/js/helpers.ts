

export const getEndAndStartTime= ({ expiresIn }: { expiresIn: number }) => {
    const MS_PER_MINUTE = 60000;
    const durationInMinutes = 2;

    const endTime = new Date((expiresIn * 1000) - (2 * MS_PER_MINUTE));

    return {
        end: endTime,
        start: new Date(endTime.getTime() - durationInMinutes * MS_PER_MINUTE)
    };
};