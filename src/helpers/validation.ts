export const isInvalidNumber = (value: number, minValue?: number) => {
    const min = minValue ?? 1;
    return (value < min) || isNaN(value) || !isFinite(value);
};