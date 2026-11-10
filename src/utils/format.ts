const numberFormatters = new Map<number, Intl.NumberFormat>();

export const formatInteger = (count: number): string => {
    return new Intl.NumberFormat('ko-KR').format(count);
};

export const formatDecimal = (
    count: number,
    fractionDigits = 1,
): string => {
    if (!numberFormatters.has(fractionDigits)) {
        numberFormatters.set(
            fractionDigits,
            new Intl.NumberFormat('ko-KR', {
                maximumFractionDigits: fractionDigits,
            }),
        );
    }

    return numberFormatters.get(fractionDigits)!.format(count);
};