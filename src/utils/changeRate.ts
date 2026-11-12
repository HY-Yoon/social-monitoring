import { formatDecimal } from "./format";

type ChangeRate = {
    changeIcon : string,
    growthType : 'positive' | 'negative' | 'neutral',
    displayRate : string,
}

export const ChangeRateInfo = (value: number): ChangeRate => {
    const roundedRate = Number(value.toFixed(1));
    const growthType = roundedRate === 0
            ? 'neutral'
            : roundedRate < 0 ? 'negative' : 'positive';

    const changeIcon = growthType === 'positive' ? '▲' : growthType === 'negative' ? '▼' : '';

    const displayRate = formatDecimal(Math.abs(roundedRate));

    return { changeIcon, growthType, displayRate };
}