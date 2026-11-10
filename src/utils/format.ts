const integerFormatter = new Intl.NumberFormat('ko-KR');

const numberFormatters = new Map<number, Intl.NumberFormat>();

const getNumberFormatter = (fractionDigits: number): Intl.NumberFormat => {
    if (!numberFormatters.has(fractionDigits)) {
        numberFormatters.set(
            fractionDigits,
            new Intl.NumberFormat('ko-KR', {
                minimumFractionDigits: fractionDigits,
                maximumFractionDigits: fractionDigits,
            }),
        );
    }

    return numberFormatters.get(fractionDigits)!;
};

export const formatInteger = (count: number): string => {
    return integerFormatter.format(count);
};

export const formatDecimal = (
    count: number,
    fractionDigits = 1,
): string => {
    return getNumberFormatter(fractionDigits).format(count);
};