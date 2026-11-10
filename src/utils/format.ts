export const formatInteger = (count: number): string => {
    return count.toLocaleString('ko-KR', {
        maximumFractionDigits: 0,
    });
};

export const formatDecimal = (
    count: number,
    fractionDigits = 1,
): string => {
    const [integer, decimal] = count.toFixed(fractionDigits).split('.');

    return [
        Number(integer).toLocaleString('ko-KR'),
        decimal,
    ].filter(Boolean).join('.');
};